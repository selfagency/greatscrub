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
  const queue = new PQueue({ concurrency: 8 });

  log.info('getting domains');
  const domains = await pb
    .collection('domains')
    .getFullList({ filter: 'dead=false && redirection="" && otherRedirect=""', sort: 'url' });

  log.info('logging into archivebox');
  const token = await (
    await fetch('http://localhost:8000/api/v1/auth/get_api_token', {
      body: JSON.stringify({
        password: process.env.ARCHIVE_PASSWORD,
        username: process.env.ARCHIVE_USERNAME,
      }),
      method: 'POST',
    })
  ).json();

  domains.map(async domain => {
    await queue.add(async () => {
      try {
        log.info('submitting', domain.url);
        await fetch('http://localhost:8000/api/v1/cli/add', {
          body: JSON.stringify({
            extractors: 'singlefile',
            tag: domain.branch,
            urls: [domain.url],
          }),
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
          method: 'POST',
        });
      } catch (error) {
        log.error(error);
      }
    });
  });
}

main();
