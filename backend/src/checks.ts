import PQueue from 'p-queue';
import puppeteer from 'puppeteer';
import { Agent, setGlobalDispatcher } from 'undici';

import pb from './lib/db.js';
import log from './lib/logger.js';

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

async function main() {
  const queue = new PQueue({ concurrency: 4 });

  const browser = await puppeteer.launch({
    args: ['--disable-web-security', '--allow-running-insecure-content'],
    headless: true,
  });

  log.info('logging into pocketbase');
  const domains = await pb
    .collection('domains')
    .getFullList({ filter: 'branch="executive" && redirection="" && otherRedirect="" && dead=0', sort: 'url' });

  log.info('processing domains');
  for (const domain of domains.filter(
    domain => !domain.dead && !domain.redirect && !domain.otherRedirect && domain.branch === 'executive'
  )) {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      let failed = false;
      let snapshot;
      let screenshot;
      try {
        snapshot = await (await fetch(domain.url, { signal: AbortSignal.timeout(3000) })).text();
        if (snapshot) {
          const page = await browser.newPage();
          await page.goto(domain.url, { waitUntil: 'networkidle0' });
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
            `${domain.url}_${new Date().toISOString().replace(' ', '_')}.png`
          );
          await page.close();
        }
      } catch {
        failed = true;
      }
      try {
        await pb.collection('checks').create({
          domain: domain.id,
          down: failed,
          screenshot,
          snapshot,
        });
      } catch (error) {
        log.error(error);
      }
    });
  }
}

main();
