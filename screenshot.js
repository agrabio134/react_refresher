const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshot(filePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const code = fs.readFileSync(filePath, 'utf-8');
  const formattedCode = `<pre><code>${code}</code></pre>`;
  
  await page.setContent(`<html><body>${formattedCode}</body></html>`);
  await page.screenshot({ path: `${path.basename(filePath)}.png` });
  await browser.close();
}

async function main() {
  const filePaths = ['./src/index.js', './src/utils.js']; // Add paths to the files you want to capture
  for (const filePath of filePaths) {
    await captureScreenshot(filePath);
  }
}

main();
