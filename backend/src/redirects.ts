import PQueue from 'p-queue';
import PocketBase from 'pocketbase';
import { isEmpty } from 'radashi';
import { Agent, setGlobalDispatcher } from 'undici';

import { detectRedirects } from './lib/detect-redirects.js';

const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

import log from './lib/logger.js';

async function main() {
  const queue = new PQueue({ concurrency: 4 });

  log.info('logging into pocketbase');
  const pb = new PocketBase('https://thegreatscrub.pockethost.io');
  await pb.collection('users').authWithPassword(process.env.USERNAME as string, process.env.PASSWORD as string);
  const domains = await pb
    .collection('domains')
    .getFullList({ filter: 'branch="executive" && redirection="" && otherRedirect="" && dead=0', sort: 'url' });

  log.info('processing domains');
  for (const domain of domains.filter(
    domain =>
      isEmpty(domain.jan19Snapshot) ||
      !domain.jan19Snapshot.startsWith('https://web.archive.org/web/2025') ||
      !domain.jan19Snapshot.startsWith('https://web.archive.org/web/2024')
  )) {
    log.info('processing domain', domain.url);
    await queue.add(async () => {
      const data = {} as Domain;

      try {
        log.info('checking for domain redirection');
        const { dead, finalUrl } = await detectRedirects(domain.url);
        if (dead) {
          log.info('domain is dead');
          data.dead = true;
        } else {
          const redirect = finalUrl.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
          const redirection = domains.find(
            domain =>
              domain.url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] === redirect
          )?.id;
          if (redirection !== domain.id) {
            log.info('saving redirect', redirection);
            if (redirection) {
              data.redirection = redirection;
            } else if (redirect) {
              data.otherRedirect = redirect;
            }
          } else {
            log.info('no redirection found');
          }
        }
      } catch (err) {
        log.error(err);
      }

      try {
        if (!isEmpty(data)) {
          log.info('updating domain', data);
          await pb.collection('domains').update(domain.id, data);
        }
      } catch (error) {
        log.error(error);
      }
    });
  }
}

main();
