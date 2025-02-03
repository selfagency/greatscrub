import type { Browser } from 'puppeteer';

import disparity from 'disparity';
import PQueue from 'p-queue';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';
import { isEmpty } from 'radashi';
import { Agent, setGlobalDispatcher } from 'undici';

import type { DomainsRecord } from './lib/pb.d.ts';

import pb from './lib/db.js';
import log from './lib/logger.js';

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

disparity.colors = {
  added: { close: '</div>', open: '<div class="diff_added">' },
  charsAdded: { close: '</div>', open: '<div class="diff_chars_added">' },
  charsRemoved: { close: '</div>', open: '<div class="diff_chars_removed">' },
  header: { close: '</div>', open: '<div class="diff_header">' },
  removed: { close: '</div>', open: '<div class="diff_removed">' },
  section: { close: '</div>', open: '<div class="diff_section">' },
};

async function imageDiff(domain: DomainsRecord, screenshot: Buffer, lastImage: string) {
  try {
    if (screenshot) {
      const newShot = PNG.sync.read(Buffer.from(screenshot));

      let baseImgDiff, lastShotDiff;

      if (domain.baseImage) {
        const baseImg = PNG.sync.read(
          Buffer.from(
            await (
              await fetch(pb.files.getURL(domain, domain.baseImage), { signal: AbortSignal.timeout(3000) })
            ).arrayBuffer()
          )
        );
        const { height, width } = baseImg;
        baseImgDiff = new PNG({ height, width });
        pixelmatch(baseImg.data, newShot.data, baseImgDiff.data, width, height, { threshold: 0.1 });
      }

      if (lastImage) {
        const lastShot = PNG.sync.read(
          Buffer.from(await (await fetch(lastImage, { signal: AbortSignal.timeout(3000) })).arrayBuffer())
        );
        const { height, width } = lastShot;
        lastShotDiff = new PNG({ height, width });
        pixelmatch(lastShot.data, newShot.data, lastShotDiff.data, width, height, { threshold: 0.1 });
      }

      return {
        baseImgDiff,
        lastShotDiff,
      };
    }
  } catch (error) {
    log.error(error);

    return {
      baseImgDiff: null,
      lastShotDiff: null,
    };
  }
}

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
  const queue = new PQueue({ concurrency: 4 });

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
            const imgDiff = await imageDiff(domain, Buffer.from(shot), lastCheck.screenshot);
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

async function takeScreenshot(url: string, browser: Browser) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.setViewport({ height: 1420, width: 1280 });
    const shot = await page.screenshot({
      fullPage: true,
      type: 'png',
    });
    await page.close();
    return shot;
  } catch (error) {
    log.error(error);
    return null;
  }
}

function textDiff(snapshot: string, lastSnapshot: string, baseSnapshot: string) {
  try {
    return {
      baseTextDiff:
        !isEmpty(baseSnapshot) && !isEmpty(snapshot)
          ? disparity.unified(baseSnapshot, snapshot, {
              paths: ['base_snapshot.html', 'current_snapshot.html'],
            })
          : null,
      lastTextDiff:
        !isEmpty(lastSnapshot) && !isEmpty(snapshot)
          ? disparity.unified(lastSnapshot, snapshot, {
              paths: ['last_snapshot.html', 'current_snapshot.html'],
            })
          : null,
    };
  } catch (error) {
    log.error(error);
    return { baseTextDiff: null, lastTextDiff: null };
  }
}

main();
