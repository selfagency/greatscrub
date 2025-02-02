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
    .getFullList({ filter: 'branch="executive" && redirection="" && otherRedirect="" && dead=0', sort: 'url' });

  for (const domain of domains.filter(
    domain => !domain.dead && !domain.redirect && !domain.otherRedirect && domain.branch === 'executive'
  )) {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      try {
        //
      } catch (error) {
        log.error(error);
      }
    });
  }
}

main();
