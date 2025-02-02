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

  const domains = await pb.collection('domains').getFullList({ filter: 'branch="executive"', sort: 'url' });

  const browser = await puppeteer.launch({
    args: ['--disable-web-security', '--allow-running-insecure-content'],
    headless: true,
  });

  for (const domain of domains.filter(
    domain => !domain.baseImg && !domain.dead && !domain.redirection && !domain.otherRedirect
  )) {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      try {
        const page = await browser.newPage();

        await page.goto(domain.url, { waitUntil: 'networkidle0' });
        await page.setViewport({ height: 1420, width: 1280 });

        const data = {
          baseImg: new File(
            [
              new Blob([
                await page.screenshot({
                  fullPage: true,
                  type: 'png',
                }),
              ]),
            ],
            `${domain.url}_${new Date().toISOString().replace(' ', '_')}.png`
          ),
        };

        await pb.collection('domains').update(domain.id, data);
        await page.close();
      } catch (error) {
        log.error(error);
      }
    });
  }

  process.exit(0);
}

main();
