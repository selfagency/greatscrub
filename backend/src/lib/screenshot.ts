import type { Browser } from 'puppeteer';

import log from './logger.js';

async function takeScreenshot(url: string, browser: Browser) {
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
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

export { takeScreenshot };
