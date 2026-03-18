import puppeteer from './node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { execPath } from './node_modules/puppeteer/lib/esm/puppeteer/node/install.js';

// Use require for CJS
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pup = require('./node_modules/puppeteer');

(async () => {
  const browser = await pup.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.querySelectorAll('.reveal, .client-logo, .team-card').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('revealed');
    });
  });
  const el = await page.$('section[id="clientes"]');
  await el.screenshot({ path: 'temporary screenshots/clients-zoom.png' });
  console.log('Clients section screenshotted');
  const teamEl = await page.$('section[id="equipe"]');
  if (teamEl) await teamEl.screenshot({ path: 'temporary screenshots/team-zoom.png' });
  await browser.close();
})();
