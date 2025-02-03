import PQueue from 'p-queue';
// import puppeteer from 'puppeteer';
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

  // const browser = await puppeteer.launch({
  //   args: ['--disable-web-security', '--allow-running-insecure-content'],
  //   headless: true,
  // });

  const domains = await pb
    .collection('domains')
    .getFullList({ filter: 'redirection="" && otherRedirect="" && dead=false', sort: 'url' });

  domains.map(async domain => {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      try {
        //
      } catch (error) {
        log.error(error);
      }
    });
  });
}

main();
