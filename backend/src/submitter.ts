import PQueue from 'p-queue';
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

  log.info('logging into pocketbase');
  const domains = await pb.collection('domains').getFullList({ filter: 'branch!="executive"', sort: 'url' });

  log.info('processing domains');
  for (const domain of domains) {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      try {
        log.info('submitting to wayback machine');
        await fetch('https://web.archive.org/save', {
          body: JSON.stringify({
            url: domain.url,
          }),
          headers: {
            Authorization: `LOW ${process.env.WAYBACK_ACCESS_KEY as string}:${process.env.WAYBACK_SECRET_KEY as string}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
      } catch (error) {
        log.error(error);
      }
    });
  }
}

main();
