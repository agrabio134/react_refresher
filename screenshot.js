const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/agrabio134/react_refresher');
  await page.screenshot({ path: './screenshot.png' });  // Save screenshot
  await browser.close();
})();
