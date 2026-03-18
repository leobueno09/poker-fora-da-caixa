import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

// Find next available index
let idx = 1;
while (fs.existsSync(path.join(screenshotDir, `screenshot-${idx}${label ? '-' + label : ''}.png`))) idx++;
const outFile = path.join(screenshotDir, `screenshot-${idx}${label ? '-' + label : ''}.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page    = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
// Scroll through the page to trigger IntersectionObserver for all sections
await page.evaluate(async () => {
  await new Promise(resolve => {
    let totalHeight = 0;
    const step = 600;
    const timer = setInterval(() => {
      window.scrollBy(0, step);
      totalHeight += step;
      if (totalHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 80);
  });
});
// Force-reveal all animated elements that may not have triggered via IntersectionObserver
await page.evaluate(() => {
  document.querySelectorAll('.reveal, .pill-card, .svc-card, .team-card, .ben-card, .method-card, .client-chip, .why-stat').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.classList.add('revealed');
  });
});
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: outFile, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outFile}`);
