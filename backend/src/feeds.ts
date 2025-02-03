import * as cheerio from 'cheerio';
import icoToPng from 'ico-to-png';
import { detectBufferMime, mimeToExt } from 'mime-detect';
import PQueue from 'p-queue';
import { Agent, setGlobalDispatcher } from 'undici';
import { unfurl } from 'unfurl.js';

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

  const domains = await pb
    .collection('domains')
    .getFullList({ filter: 'redirection="" && otherRedirect="" && dead=false', sort: 'url' });

  for (const domain of domains) {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      try {
        const metadata = await unfurl(domain.url, { follow: 3, timeout: 3000 });
        // log.info('metadata', metadata);

        let ext, favicon, mimetype;
        try {
          favicon = Buffer.from(await (await fetch(metadata.favicon as string))?.arrayBuffer());
          mimetype = await detectBufferMime(favicon);
          ext = mimeToExt(mimetype).split('+')[0];
          log.info(metadata.favicon, mimetype, ext);

          if (ext === 'ico' || ext === 'vnd.microsoft.icon') {
            try {
              favicon = await icoToPng(favicon, 128);
              ext = 'png';
            } catch (e) {
              log.error(e);
            }
          }
        } catch (e) {
          log.error(e);
        }

        const $ = cheerio.load(domain.baseSnapshot);

        const data: Record<string, unknown> = {};

        if (metadata.twitter_card) {
          data.twitter = `https://x.com/${metadata.twitter_card?.site?.replace('@', '')}`;
        } else {
          data.twitter = $('a[href*="twitter.com"], a[href*="x.com"]')?.[0]?.attribs?.href || null;
        }

        data.rss =
          $('link[type="application/rss+xml"], link[type="application/atom+xml"], meta[name*="rss"]')?.[0]?.attribs
            ?.href || null;

        if (favicon && mimetype?.startsWith('image')) {
          data.favicon = new File([favicon], `favicon.${ext}`);
        } else {
          data.favicon = null;
        }

        log.info(domain.url, data);

        // await pb.collection('domains').update(domain.id, data);
      } catch (error) {
        log.error(error);
      }
    });
  }
}

main();
