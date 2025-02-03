import disparity from 'disparity';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { isEmpty } from 'radashi';

import type { ChecksRecord, DomainsRecord } from './pb.d.ts';

import pb from './db.js';
import log from './logger.js';

disparity.colors = {
  added: { close: '</div>', open: '<div class="diff_added">' },
  charsAdded: { close: '</div>', open: '<div class="diff_chars_added">' },
  charsRemoved: { close: '</div>', open: '<div class="diff_chars_removed">' },
  header: { close: '</div>', open: '<div class="diff_header">' },
  removed: { close: '</div>', open: '<div class="diff_removed">' },
  section: { close: '</div>', open: '<div class="diff_section">' },
};

async function imageDiff(domain: DomainsRecord, screenshot: Buffer, lastCheck: ChecksRecord) {
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

      if (lastCheck.screenshot) {
        const lastShot = PNG.sync.read(
          Buffer.from(
            await (
              await fetch(pb.files.getURL(lastCheck, lastCheck.screenshot), { signal: AbortSignal.timeout(3000) })
            ).arrayBuffer()
          )
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

export { imageDiff, textDiff };
