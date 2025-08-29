import { Browser, chromium } from 'playwright';

let browserInstance: Browser | null = null;
let inactivityTimer: any; // eslint-disable-line @typescript-eslint/no-explicit-any
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;
const initializeBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true,
      args: ['--disable-gpu', '--disable-software-rasterizer'],
    });
  }
  return browserInstance;
};

const scheduleBrowserClose = () => {
  clearTimeout(inactivityTimer); // Clear any existing timer
  inactivityTimer = setTimeout(async () => {
    if (browserInstance) {
      await closeBrowser();
    }
  }, INACTIVITY_TIMEOUT);
};

const closeBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};

const getBrowserInstance = async () => {
  await initializeBrowser();
  return await initializeBrowser();
};

export { closeBrowser, getBrowserInstance, initializeBrowser, scheduleBrowserClose };
