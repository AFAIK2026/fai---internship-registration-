// Applicant-journey tests in a real browser against the built dist/.
// Google Forms is stubbed at the network layer: these tests prove the site
// navigates to the exact form URL, not that the live form accepts responses.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer } from '../../scripts/serve.mjs';

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfV8tXTNl-DZL3wUmJ3H5sneP9l2mHm-9_1l2xXnA9uinpBFg/viewform';
const DIST = fileURLToPath(new URL('../../dist', import.meta.url));
const AXE_PATH = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
const MOBILE = { width: 360, height: 640 };
const DESKTOP = { width: 1280, height: 800 };

let server;
let browser;
let base;

before(async () => {
  server = await startServer({ dir: DIST });
  base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

// Opens a page with a stubbed Google Forms and collects console errors.
async function openPage({ viewport = MOBILE, javaScriptEnabled = true, bypassCSP = false } = {}) {
  const context = await browser.newContext({ viewport, javaScriptEnabled, bypassCSP });
  await context.route((url) => url.hostname === 'docs.google.com', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Google Form (stub)</title><p>stub</p>' }));
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(err.message));
  return { context, page, errors };
}

for (const [label, viewport] of [['mobile', MOBILE], ['desktop', DESKTOP]]) {
  test(`${label}: hero Register now opens the exact form in the same tab, and Back returns`, async () => {
    const { context, page, errors } = await openPage({ viewport });
    await page.goto(base);
    await page.getByRole('link', { name: 'Register now on Google Forms' }).first().click();
    await page.waitForURL(FORM_URL);
    assert.equal(page.url(), FORM_URL);
    assert.equal(context.pages().length, 1, 'form must open in the same tab');
    await page.goBack();
    assert.equal(page.url(), base);
    assert.deepEqual(errors, []);
    await context.close();
  });

  test(`${label}: no console errors, no horizontal scroll, all sections reachable`, async () => {
    const { context, page, errors } = await openPage({ viewport });
    await page.goto(base);
    for (const id of ['roles', 'requirements', 'apply', 'contact', 'privacy']) {
      assert.equal(await page.locator(`#${id} h2`).count(), 1, `section #${id}`);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(overflow <= 0, `horizontal overflow of ${overflow}px`);
    assert.deepEqual(errors, []);
    await context.close();
  });
}

test('mobile 360x640: H1, status and Register now are inside the first viewport (DAC-01)', async () => {
  const { context, page } = await openPage({ viewport: MOBILE });
  await page.goto(base);
  for (const locator of [page.locator('h1'), page.locator('.badge'), page.getByRole('link', { name: 'Register now on Google Forms' }).first()]) {
    const box = await locator.boundingBox();
    assert.ok(box && box.y + box.height <= MOBILE.height, 'element must be fully inside the first viewport');
  }
  await context.close();
});

test('mobile 320px: no horizontal scroll (DAC-26)', async () => {
  const { context, page } = await openPage({ viewport: { width: 320, height: 568 } });
  await page.goto(base);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 0, `horizontal overflow of ${overflow}px`);
  await context.close();
});

test('role details open with the keyboard and the role CTA opens the form (DAC-41, AF-3)', async () => {
  const { context, page } = await openPage({ viewport: MOBILE });
  await page.goto(base);
  const card = page.locator('.role-card').first();
  await card.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await card.locator('details').evaluate((d) => d.open), true);
  const cta = card.getByRole('link', { name: /^Register for this role: .*, on Google Forms$/ });
  await cta.click();
  await page.waitForURL(FORM_URL);
  assert.equal(page.url(), FORM_URL);
  await context.close();
});

test('keyboard: the first Tab reaches the skip link, which moves focus to main', async () => {
  const { context, page } = await openPage({ viewport: DESKTOP });
  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Skip to main content');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  await context.close();
});

test('desktop: header navigation scrolls to sections and the header Register CTA is shown', async () => {
  const { context, page } = await openPage({ viewport: DESKTOP });
  await page.goto(base);
  await page.getByRole('navigation', { name: 'Page sections' }).getByRole('link', { name: 'How to apply' }).click();
  await page.waitForURL(`${base}#apply`);
  assert.ok(await page.locator('#apply h2').isVisible());
  assert.equal(await page.locator('.site-header .header-cta').isVisible(), true);
  await context.close();
});

test('mobile: header navigation and header CTA are hidden (no hamburger menu)', async () => {
  const { context, page } = await openPage({ viewport: MOBILE });
  await page.goto(base);
  assert.equal(await page.locator('.site-header .site-nav').isVisible(), false);
  assert.equal(await page.locator('.site-header .header-cta').isVisible(), false);
  await context.close();
});

test('JavaScript disabled: content renders, details open, Register works (DAC-22)', async () => {
  const { context, page } = await openPage({ viewport: MOBILE, javaScriptEnabled: false });
  await page.goto(base);
  await page.locator('.role-card summary').first().click();
  assert.ok(await page.locator('.role-card .role-details').first().isVisible());
  await page.getByRole('link', { name: 'Register now on Google Forms' }).first().click();
  await page.waitForURL(FORM_URL);
  await context.close();
});

test('unknown paths return HTTP 404 with a link home (DAC-24)', async () => {
  const { context, page } = await openPage({ viewport: MOBILE });
  const response = await page.goto(`${base}no-such-page`);
  assert.equal(response.status(), 404);
  assert.equal(await page.locator('h1').textContent(), 'Page not found');
  assert.equal(await page.getByRole('link', { name: 'Go to the internship page' }).getAttribute('href'), '/');
  await context.close();
});

for (const [label, viewport] of [['mobile', MOBILE], ['desktop', DESKTOP]]) {
  test(`${label}: axe-core finds no serious or critical WCAG 2.2 A/AA violations, with a role expanded (DAC-40)`, async () => {
    // bypassCSP only lets the test inject axe; the site itself is unchanged.
    const { context, page } = await openPage({ viewport, bypassCSP: true });
    for (const path of ['', 'no-such-page']) {
      await page.goto(base + path);
      if (path === '') await page.locator('.role-card summary').first().click();
      await page.addScriptTag({ path: AXE_PATH });
      const results = await page.evaluate(() =>
        window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
      const serious = results.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.length} node(s)`);
      assert.deepEqual(serious, [], `/${path}`);
    }
    await context.close();
  });
}
