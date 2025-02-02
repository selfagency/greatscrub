import PQueue from 'p-queue';
import { isEmpty } from 'radashi';
import { Agent, setGlobalDispatcher } from 'undici';

import pb from './lib/db.js';
import { detectRedirects } from './lib/detect-redirects.js';
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

      const outdated = (item: string | undefined) =>
        isEmpty(item) ||
        !item.startsWith('https://web.archive.org/web/2025') ||
        !item.startsWith('https://web.archive.org/web/2024') ||
        ((item.startsWith('https://archive.is/2024') || item.startsWith('https://archive.is/2025')) &&
          !item.startsWith('https://archive.is/20250118/') &&
          !item.startsWith('https://archive.is/202501/'));

      try {
        log.info('checking wayback machine');
        const waybackApiUrl = `https://archive.org/wayback/available?url=${domain.url.replace('https://', '')}&timestamp=20250129`;
        const result = (await (await fetch(waybackApiUrl)).json())?.archived_snapshots?.closest?.url.replace(
          'http://',
          'https://'
        );
        if (outdated(result)) {
          log.info('checking archive.is');
          const archiveIs = (await detectRedirects(`https://archive.is/202501/${domain.url.replace('https://', '')}`))
            ?.finalUrl;
          if (
            (archiveIs.startsWith('https://archive.is/2024') || archiveIs.startsWith('https://archive.is/2025')) &&
            !archiveIs.startsWith('https://archive.is/20250118/') &&
            !archiveIs.startsWith('https://archive.is/202501/')
          ) {
            log.info('saving archive.is snapshot', archiveIs);
            data.jan19Snapshot = archiveIs;
          } else {
            log.info("couldn't find a recent snapshot");
            data.jan19Snapshot = '';
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
