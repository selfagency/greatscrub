import * as cheerio from 'cheerio';
import { readFile } from 'node:fs/promises';
import PQueue from 'p-queue';
import PocketBase from 'pocketbase';
import puppeteer from 'puppeteer';
import { isEmpty } from 'radashi';

import log from './lib/logger.js';

async function main() {
  const queue = new PQueue({ concurrency: 4 });

  log.info('logging into pocketbase');
  const pb = new PocketBase('https://thegreatscrub.pockethost.io');
  await pb.collection('users').authWithPassword(process.env.USERNAME as string, process.env.PASSWORD as string);

  log.info('reading domains');
  const domains = JSON.parse(await readFile(`${process.cwd()}/data/domains.json`, 'utf-8'));

  log.info('processing domains');
  for (const domain of domains as DomainRaw[]) {
    await queue.add(async () => {
      const browser = await puppeteer.launch({
        args: ['--disable-web-security', '--allow-running-insecure-content'],
        headless: true,
      });

      const domainName = domain['Domain name'];

      let exists;
      try {
        exists = await pb.collection('domains').getFirstListItem(`url~"${domainName}"`);
      } catch {
        log.info(`creating record for ${domainName}`);
      }

      const data: Domain = {
        agency: domain['Agency'],
        branch: domain['Domain type'].toLowerCase(),
        office: domain['Organization name'],
        url: `https://${domainName}`,
      };

      log.info(`Processing ${domainName}`, data);

      // check wayback machine
      log.info('checking wayback machine');
      try {
        const waybackApiUrl = `https://archive.org/wayback/available?url=${domainName}&timestamp=20250119`;

        let wayback: Wayback;

        if (isEmpty(exists?.jan19snapshot)) {
          wayback = await (await fetch(waybackApiUrl)).json();
          log.info('waybackResponse', wayback);
          if (wayback) {
            const waybackUrl = wayback.archived_snapshots?.closest?.url.replace('http://', 'https://') || data.url;
            if (waybackUrl) {
              data.jan19Snapshot = waybackUrl;
              const $ = cheerio.load(data.jan19Snapshot);
              const links = $.extract({
                links: [
                  {
                    selector: 'a',
                    value: (el, key) => {
                      const href = $(el).attr('href');
                      return `${key}=${href}`;
                    },
                  },
                ],
              });
              data.x =
                links.links.find(link => link.includes('twitter.com'))?.match(/https:\/\/twitter\.com\/.+/i)?.[0] ||
                links.links.find(link => link.includes('x.com'))?.match(/https:\/\/x\.com\/.+/i)?.[0];
              data.feed = (links.links.find(link => link.includes('rss')) ||
                links.links.find(link => link.includes('feed')) ||
                links.links.find(link => link.includes('atom'))) as string;
            }

            log.info('capturing wayback machine screenshot');
            const page = await browser.newPage();
            await page.goto(waybackUrl, { waitUntil: 'networkidle0' });
            await page.setViewport({ height: 1420, width: 1280 });
            await page.evaluate(() => {
              document.querySelector('#wm-ipp-base')?.remove();
              document.querySelector('#wm-ipp-print')?.remove();
            });

            try {
              const ss = await page.screenshot({
                fullPage: true,
                type: 'png',
              });
              const screenshotBlob = new Blob([ss], { type: 'image/png' });
              data.jan19Screenshot = new File([screenshotBlob], `${domainName}_before.png`);
              await page.close();
            } catch {
              log.error();
            }
          }
        }
      } catch (err) {
        log.error(err);
      }

      // check up status, grab snapshot
      let failed = false;
      let snapshot;
      let screenshot;
      try {
        snapshot = await (await fetch(`https://www.${domainName}`, { signal: AbortSignal.timeout(3000) })).text();
        if (snapshot) {
          const page = await browser.newPage();
          await page.goto(data.url, { waitUntil: 'networkidle0' });
          await page.setViewport({ height: 1420, width: 1280 });
          screenshot = new File(
            [
              new Blob([
                await page.screenshot({
                  fullPage: true,
                  type: 'png',
                }),
              ]),
            ],
            `${domainName}_${new Date().toISOString().replace(' ', '_')}.png`
          );
          await page.close();
        }
      } catch {
        failed = true;
      }

      try {
        let res;

        log.info('updating record', data);
        if (exists) {
          res = await pb.collection('domains').update(exists.id, data);
        } else {
          res = await pb.collection('domains').create(data);
        }

        await pb.collection('checks').create({
          domain: res.id,
          down: failed,
          screenshot,
          textSnapshot: snapshot,
        });
      } catch (error) {
        log.error(error);
      }

      await browser.close();
    });
  }
}

main();
