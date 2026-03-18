import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => { el.style.opacity='1'; el.style.transform='none'; });
  document.querySelectorAll('[style*="opacity: 0"]').forEach(el => { el.style.opacity='1'; el.style.transform='none'; });
});
await new Promise(r => setTimeout(r, 1000));

const dir = './temporary screenshots';
const files = fs.readdirSync(dir);
const nums = files.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1])).filter(n => !isNaN(n));
let counter = nums.length ? Math.max(...nums) + 1 : 1;

const sections = [
  { name: 'hero-logo', y: 0, h: 900 },
  { name: 'team', y: 2600, h: 1000 },
  { name: 'video', y: 4000, h: 800 },
];

for (const s of sections) {
  await page.evaluate(y => window.scrollTo(0, y), s.y);
  await new Promise(r => setTimeout(r, 400));
  const clip = { x: 0, y: s.y, width: 1440, height: s.h };
  const fname = path.join(dir, `screenshot-${counter}-${s.name}.png`);
  await page.screenshot({ clip, path: fname });
  console.log(`Saved: ${fname}`);
  counter++;
}

await browser.close();
