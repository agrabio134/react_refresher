import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const fileExtensions = ['.js', '.html', '.css', '.md'];

async function getFiles(dir) {
    const files = await readdir(dir);
    const fileList = [];

    for (let file of files) {
        const fullPath = path.join(dir, file);
        const fileStats = await stat(fullPath);

        if (fileStats.isDirectory() && file !== 'node_modules') {
            fileList.push(...await getFiles(fullPath));
        } else if (fileExtensions.some(ext => file.endsWith(ext))) {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

async function screenshotFile(filePath, page) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    await page.setContent(`
        <html>
            <head><title>${path.basename(filePath)}</title></head>
            <body style="font-family: monospace; white-space: pre-wrap; padding: 20px; max-width: 1000px;">
                <pre>${fileContent}</pre>
            </body>
        </html>
    `);

    const screenshotPath = path.join('screenshots', `${path.basename(filePath)}.png`);
    await page.screenshot({
        path: screenshotPath,
        fullPage: true
    });

    console.log(`Screenshot saved at ${screenshotPath}`);
}

async function takeScreenshots() {
    const files = await getFiles('./');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Add this line
    });
    const page = await browser.newPage();

    for (const file of files) {
        console.log(`Taking screenshot of ${file}`);
        await screenshotFile(file, page);
    }

    await browser.close();

    console.log("Files in 'screenshots' directory:");
    fs.readdirSync('screenshots').forEach(file => {
        console.log(file);
    });
}

if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

takeScreenshots().catch(error => {
    console.error("Error taking screenshots:", error);
});
