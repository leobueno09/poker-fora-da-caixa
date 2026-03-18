const pup = require('./node_modules/puppeteer');

(async () => {
  const browser = await pup.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(function() {
    document.querySelectorAll('.reveal, .gallery-img, .benefits-photo, .why-photo').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('revealed');
    });
  });

  var sections = [
    { sel: 'section[id="equipe"]', name: 'team' },
    { sel: 'section[id="clientes"]', name: 'clients' },
    { sel: '.benefits-bg', name: 'benefits' },
    { sel: 'section:has(.why-photo)', name: 'whyus' },
  ];

  for (var i = 0; i < sections.length; i++) {
    var s = sections[i];
    var el = await page.$(s.sel);
    if (el) {
      await el.screenshot({ path: 'temporary screenshots/' + s.name + '-new.png' });
      console.log(s.name + '-new.png saved');
    }
  }

  // Gallery section - it's between clients and benefits
  var allSections = await page.$$('section');
  // Take a viewport screenshot scrolled to gallery area
  await page.evaluate(function() {
    var bgSections = document.querySelectorAll('section');
    for (var i = 0; i < bgSections.length; i++) {
      if (bgSections[i].querySelector('.gallery-grid')) {
        bgSections[i].scrollIntoView();
      }
    }
  });
  await new Promise(function(r) { setTimeout(r, 300); });
  await page.screenshot({ path: 'temporary screenshots/gallery-new.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('gallery-new.png saved');

  await browser.close();
})();
