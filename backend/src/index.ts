import PQueue from 'p-queue';
import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';
import { Agent, setGlobalDispatcher } from 'undici';

import type { DomainsRecord } from './lib/pb.d.ts';

import pb from './lib/db.js';
import { imageDiff, textDiff } from './lib/diff.js';
import log from './lib/logger.js';
import { takeScreenshot } from './lib/screenshot.js';

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

async function main() {
  const browser = await puppeteer.launch({
    args: ['--disable-web-security', '--allow-running-insecure-content'],
    headless: true,
  });

  log.info('logging into pocketbase');
  const domains = await pb
    .collection('domains')
    .getFullList({ filter: 'redirection="" && otherRedirect="" && dead=false', sort: 'url' });

  log.info('processing domains');
  const queue = new PQueue({ concurrency: 6 });

  domains.map(async (domain: DomainsRecord) => {
    await queue.add(async () => {
      log.info('processing domain', domain.url);

      let snapshot;
      let screenshot;
      let baseImgDiff;
      let lastShotDiff;
      let lastTextDiff;
      let baseTextDiff;

      try {
        snapshot = await (await fetch(domain.url as string, { signal: AbortSignal.timeout(3000) })).text();

        if (snapshot) {
          const lastCheck = await pb
            .collection('checks')
            .getFirstListItem(`domain="${domain.id}"`, { sort: 'created' });

          const txtDiff = textDiff(snapshot, lastCheck.snapshot, domain.baseSnapshot as string);
          lastTextDiff = txtDiff.lastTextDiff;
          baseTextDiff = txtDiff.baseTextDiff;

          const shot = await takeScreenshot(domain.url as string, browser);
          if (shot) {
            screenshot = new File(
              [new Blob([shot])],
              `${domain.url}_${new Date().toISOString().replace(' ', '_')}.png`
            );
            const imgDiff = await imageDiff(domain, Buffer.from(shot), lastCheck);
            baseImgDiff = imgDiff?.baseImgDiff;
            lastShotDiff = imgDiff?.lastShotDiff;
          }

          await pb.collection('checks').create({
            baseImgDiff: baseImgDiff
              ? new File([new Blob([PNG.sync.write(baseImgDiff as PNG)])], `${domain.url}_base_diff.png`)
              : null,
            baseTextDiff,
            domain: domain.id,
            down: false,
            lastShotDiff: lastShotDiff
              ? new File([new Blob([PNG.sync.write(lastShotDiff as PNG)])], `${domain.url}_last_diff.png`)
              : null,
            lastTextDiff,
            screenshot,
            snapshot,
          });
        } else {
          throw new Error();
        }
      } catch (error) {
        log.error(error);

        try {
          if ((error as Error).message.includes('net:')) {
            await pb.collection('checks').create({
              domain: domain.id,
              down: true,
            });
          }
        } catch (error) {
          log.error(error);
        }
      }
    });
  });
}

main();
