const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:5173';
const SCREENSHOTS_DIR = path.join(__dirname, '../audit-results/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const auditLog = {
  consoleErrors: [],
  consoleWarnings: [],
  pageErrors: [],
  failedRequests: [],
  layoutOverflows: [],
  interactiveFailures: []
};

async function audit() {
  console.log('Starting Playwright Crawler Audit on', BASE_URL);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const routes = [
    { path: '/', name: 'home' },
    { path: '/products', name: 'products' },
    { path: '/services', name: 'services' },
    { path: '/academics', name: 'academics' },
    { path: '/coming-soon', name: 'coming-soon' }
  ];

  const viewports = [
    { width: 1440, height: 900, isMobile: false, label: 'desktop' },
    { width: 390, height: 844, isMobile: true, label: 'mobile' }
  ];

  for (const vp of viewports) {
    console.log(`\n=== Testing Viewport: ${vp.label} (${vp.width}x${vp.height}) ===`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });

    const page = await context.newPage();

    // Hook listeners
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        auditLog.consoleErrors.push({ viewport: vp.label, url: page.url(), text });
        console.error(`[CONSOLE ERROR] [${vp.label}] ${text}`);
      } else if (type === 'warning') {
        auditLog.consoleWarnings.push({ viewport: vp.label, url: page.url(), text });
        console.warn(`[CONSOLE WARN] [${vp.label}] ${text}`);
      }
    });

    page.on('pageerror', (err) => {
      auditLog.pageErrors.push({ viewport: vp.label, url: page.url(), message: err.message, stack: err.stack });
      console.error(`[PAGE ERROR] [${vp.label}] ${err.message}`);
    });

    page.on('response', (res) => {
      if (res.status() >= 400) {
        auditLog.failedRequests.push({
          viewport: vp.label,
          url: res.url(),
          status: res.status(),
          statusText: res.statusText()
        });
        console.error(`[FAILED HTTP] ${res.status()} ${res.url()}`);
      }
    });

    for (const r of routes) {
      const fullUrl = `${BASE_URL}${r.path}`;
      console.log(`Navigating to ${r.name} (${fullUrl})...`);

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (e) {
        console.warn(`Navigation to ${fullUrl} networkidle timed out, waiting load state...`);
        await page.waitForLoadState('load');
      }

      await page.waitForTimeout(1000);

      // If intro is visible on home, click skip or dismiss
      if (r.path === '/') {
        try {
          const skipBtn = await page.$('button:has-text("Skip intro"), button:has-text("SKIP INTRO")');
          if (skipBtn) {
            console.log('Skipping intro...');
            await skipBtn.click();
            await page.waitForTimeout(1500);
          }
        } catch (e) {}
      }

      // Check for horizontal overflow
      const overflowInfo = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
        const clientWidth = Math.min(body.clientWidth, html.clientWidth);
        const hasOverflow = scrollWidth > clientWidth + 2; // small buffer
        let offendingElements = [];
        if (hasOverflow) {
          document.querySelectorAll('*').forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth + 2) {
              offendingElements.push({
                tag: el.tagName,
                id: el.id,
                className: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
                right: rect.right,
                width: rect.width
              });
            }
          });
        }
        return { hasOverflow, scrollWidth, clientWidth, offendingElements: offendingElements.slice(0, 10) };
      });

      if (overflowInfo.hasOverflow) {
        console.error(`[OVERFLOW DETECTED] [${vp.label}] on ${r.name}: scrollWidth=${overflowInfo.scrollWidth}, clientWidth=${overflowInfo.clientWidth}`);
        auditLog.layoutOverflows.push({
          viewport: vp.label,
          route: r.name,
          ...overflowInfo
        });
      }

      // Screenshot initial view
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `${r.name}-${vp.label}-top.png`),
        fullPage: false
      });

      // Scroll and fullpage screenshot
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `${r.name}-${vp.label}-full.png`),
        fullPage: true
      });

      // Interactive states testing
      if (r.path === '/') {
        console.log('Testing Home interactive elements...');
        // Test WhyChooseUs steps if visible
        try {
          const stepButtons = await page.$$('button:has-text("02"), button:has-text("03"), button:has-text("04"), button:has-text("05")');
          for (const btn of stepButtons.slice(0, 3)) {
            await btn.click({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(300);
          }
        } catch (e) {
          auditLog.interactiveFailures.push({ route: r.name, detail: 'WhyChooseUs step clicks: ' + e.message });
        }

        // Test Social carousel next button
        try {
          const nextBtn = await page.$('button:has-text("Next Post")');
          if (nextBtn) {
            await nextBtn.click();
            await page.waitForTimeout(400);
          }
        } catch (e) {
          auditLog.interactiveFailures.push({ route: r.name, detail: 'Social carousel click: ' + e.message });
        }
      }

      if (r.path === '/services') {
        console.log('Testing Services interactive elements...');
        try {
          // Scope estimator sliders/buttons
          const buttons = await page.$$('button:has-text("Mobile App"), button:has-text("AI Integration"), button:has-text("Web Platform")');
          for (const btn of buttons) {
            await btn.click({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(200);
          }
        } catch (e) {}
      }

      if (r.path === '/academics') {
        console.log('Testing Academics interactive elements...');
        try {
          // Test waitlist modal open
          const applyBtn = await page.$('button:has-text("Apply for Next Cohort"), button:has-text("Join Waitlist")');
          if (applyBtn) {
            await applyBtn.click({ timeout: 2000 });
            await page.waitForTimeout(500);
            await page.screenshot({
              path: path.join(SCREENSHOTS_DIR, `academics-${vp.label}-modal.png`),
              fullPage: false
            });
            // Try typing and close
            const input = await page.$('input[type="email"]');
            if (input) {
              await input.fill('test@example.com');
              const submit = await page.$('button:has-text("Notify Me"), button:has-text("Submit"), button[type="submit"]');
              if (submit) await submit.click();
              await page.waitForTimeout(300);
            }
            const closeBtn = await page.$('button[aria-label="Close"], button:has-text("Done"), button:has-text("Close")');
            if (closeBtn) await closeBtn.click();
          }
        } catch (e) {
          auditLog.interactiveFailures.push({ route: r.name, detail: 'Academics modal: ' + e.message });
        }
      }
    }

    await context.close();
  }

  await browser.close();

  const reportPath = path.join(__dirname, '../audit-results/audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditLog, null, 2));
  console.log('\n=== Crawl Audit Finished ===');
  console.log(`Console Errors: ${auditLog.consoleErrors.length}`);
  console.log(`Console Warnings: ${auditLog.consoleWarnings.length}`);
  console.log(`Page Exceptions: ${auditLog.pageErrors.length}`);
  console.log(`Failed HTTP Requests: ${auditLog.failedRequests.length}`);
  console.log(`Layout Overflows: ${auditLog.layoutOverflows.length}`);
  console.log(`Interactive Failures: ${auditLog.interactiveFailures.length}`);
  console.log('Report written to', reportPath);
}

audit().catch((err) => {
  console.error('Fatal audit script error:', err);
  process.exit(1);
});
