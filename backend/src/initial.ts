import type { ElementHandle } from 'puppeteer';

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

  const domains = await pb.collection('domains').getFullList({ filter: 'branch!="executive"', sort: 'url' });

  const browser = await puppeteer.launch({
    args: ['--disable-web-security', '--allow-running-insecure-content'],
    headless: true,
  });

  for (const domain of domains.filter(domain => !domain.dead && !domain.redirection && !domain.otherRedirect)) {
    log.info('processing domain', domain.url);
    let element: ElementHandle | null;

    await queue.add(async () => {
      try {
        const page = await browser.newPage();

        await page.goto(domain.archiveUrl || domain.url, { waitUntil: 'networkidle2' });
        await page.setViewport({ height: 1420, width: 1280 });

        if (domain.archiveUrl) {
          if (domain.archiveUrl.includes('web.archive.org')) {
            await page.evaluate(() => {
              document.querySelector('#wm-ipp-base')?.remove();
              document.querySelector('#wm-ipp-print')?.remove();
            });
          }

          if (domain.archiveUrl.includes('archive.is')) {
            const selector = '#CONTENT';
            await page.waitForSelector(selector);
            element = await page.$(selector);
          }
        }

        const data = {
          baseImage: new File(
            [
              new Blob([
                domain.archiveUrl?.includes('archive.is')
                  ? ((await element?.screenshot({
                      fullPage: true,
                      type: 'png',
                    })) as Uint8Array)
                  : await page.screenshot({
                      fullPage: true,
                      type: 'png',
                    }),
              ]),
            ],
            `${domain.url}_${new Date().toISOString().replace(' ', '_')}.png`
          ),
          baseSnapshot: await (await fetch(domain.url)).text(),
        };
        await pb.collection('domains').update(domain.id, data);
        await page.close();
      } catch (error) {
        log.error(error);
        if ((error as Error).message.includes('net::ERR')) {
          await pb.collection('domains').update(domain.id, { dead: true });
        }
      }
    });
  }

  process.exit(0);
}

main();
