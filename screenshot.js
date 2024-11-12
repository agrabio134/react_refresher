import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function captureScreenshot(filePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Read the code from the file
  const code = fs.readFileSync(filePath, 'utf-8');
  const formattedCode = `<pre><code>${code}</code></pre>`;

  // Set up the page content with the code
  await page.setContent(`<html><body>${formattedCode}</body></html>`);

  // Ensure the 'screenshots' directory exists
  const screenshotsDir = 'screenshots';
  if (!fs.existsSync(screenshotsDir)){
    fs.mkdirSync(screenshotsDir);
  }

  // Take screenshot and save to 'screenshots' directory
  const screenshotPath = `${screenshotsDir}/${path.basename(filePath)}.png`;
  await page.screenshot({ path: screenshotPath });

  // Log if the screenshot was taken and file size
  const stats = fs.statSync(screenshotPath);
  console.log(`Screenshot saved: ${screenshotPath}, size: ${stats.size} bytes`);

  await browser.close();
}

async function main() {
  const codeDirectory = './src';  // Path to the directory with your code files
  const filePaths = fs.readdirSync(codeDirectory)
    .filter(file => file.endsWith('.js'))  // You can add other file extensions as needed
    .map(file => path.join(codeDirectory, file));

  for (const filePath of filePaths) {
    await captureScreenshot(filePath);
  }
}

main().catch(console.error);
