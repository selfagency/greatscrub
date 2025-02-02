import log from './logger';

export async function detectRedirects(url: string) {
  let currentUrl = url;
  let redirectCount = 0;
  let dead = false;
  const maxRedirects = 10; // Set a limit to avoid infinite loops

  while (redirectCount < maxRedirects) {
    try {
      const response = await fetch(currentUrl, { redirect: 'manual' });

      if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
        log.info('redirected to', response.headers.get('location'));
        const location = response.headers.get('location');
        currentUrl = new URL(location as string, currentUrl).href;
        redirectCount++;
      } else {
        break;
      }
    } catch (error) {
      log.error(error);
      dead = true;
      break;
    }
  }

  return { dead, finalUrl: currentUrl, redirectCount };
}
