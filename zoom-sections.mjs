import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

// Force reveal all animated elements
await page.evaluate(() => {
  document.querySelectorAll('[class*="opacity-0"], .reveal, [data-animate]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});
await new Promise(r => setTimeout(r, 800));

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const files = fs.readdirSync(dir);
const nums = files.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1])).filter(n => !isNaN(n));
let counter = nums.length ? Math.max(...nums) + 1 : 1;

const sections = [
  { name: 'hero', y: 0, h: 900 },
  { name: 'stats-about', y: 900, h: 900 },
  { name: 'services', y: 1800, h: 900 },
  { name: 'methodology-team', y: 2700, h: 1000 },
  { name: 'clients-benefits', y: 3700, h: 1000 },
  { name: 'cta-footer', y: 4700, h: 900 },
];

for (const s of sections) {
  await page.evaluate(y => window.scrollTo(0, y), s.y);
  await new Promise(r => setTimeout(r, 300));
  const clip = { x: 0, y: s.y, width: 1440, height: s.h };
  const fname = path.join(dir, `screenshot-${counter}-${s.name}.png`);
  await page.screenshot({ clip, path: fname });
  console.log(`Saved: ${fname}`);
  counter++;
}

await browser.close();
