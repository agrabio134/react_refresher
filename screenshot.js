import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// List of file extensions to screenshot (you can add more if needed)
const fileExtensions = ['.js', '.html', '.css', '.md'];

async function getFiles(dir) {
    const files = await readdir(dir);
    const fileList = [];

    for (let file of files) {
        const fullPath = path.join(dir, file);
        const fileStats = await stat(fullPath);

        if (fileStats.isDirectory() && file !== 'node_modules') {
            // Recurse into subdirectories (excluding node_modules)
            fileList.push(...await getFiles(fullPath));
        } else if (fileExtensions.some(ext => file.endsWith(ext))) {
            // Add file to list if it's a code file
            fileList.push(fullPath);
        }
    }

    return fileList;
}

async function screenshotFile(filePath, page) {
    // Read the file content (can adjust based on type of file)
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Open a page and inject the content
    await page.setContent(`
        <html>
            <head><title>${path.basename(filePath)}</title></head>
            <body style="font-family: monospace; white-space: pre-wrap; padding: 20px; max-width: 1000px;">
                <pre>${fileContent}</pre>
            </body>
        </html>
    `);

    // Screenshot file content
    const screenshotPath = path.join('screenshots', `${path.basename(filePath)}.png`);
    await page.screenshot({
        path: screenshotPath,
        fullPage: true
    });
    console.log(`Screenshot saved: ${screenshotPath}`);
}

async function takeScreenshots() {
    const files = await getFiles('./');  // Starting point is the root of your repo
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const file of files) {
        await screenshotFile(file, page);
    }

    await browser.close();
}

// Run the function to take screenshots
takeScreenshots().catch(console.error);
