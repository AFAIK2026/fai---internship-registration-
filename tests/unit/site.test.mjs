// Unit tests for content validation and rendering (no browser needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mkdtemp, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateContent, expectedFormUrl } from '../../src/content.mjs';
import { renderIndex, renderNotFound } from '../../src/render.mjs';
import { build, normalizeBase } from '../../scripts/build.mjs';

const CONTENT_PATH = new URL('../../content/site.json', import.meta.url);
const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfV8tXTNl-DZL3wUmJ3H5sneP9l2mHm-9_1l2xXnA9uinpBFg/viewform';
const OPTS = { stylesheet: '/assets/styles.test.css' };

async function baseContent() {
  return JSON.parse(await readFile(CONTENT_PATH, 'utf8'));
}

// A fully approved-looking fixture (no placeholders), used for release-mode tests.
function approved(content) {
  const c = structuredClone(content);
  c.organization.name = 'Example Org';
  c.program = { name: 'Example Internship', tagline: 'Short tagline.', overview: ['Overview.'], facts: [] };
  c.roles = [
    { slug: 'role-a', title: 'Role A', department: null, workSetup: 'hybrid', location: null, summary: 'Summary A.',
      responsibilities: ['Do A'], requiredQualifications: ['Qual A'], preferredQualifications: [], order: 1, published: true },
    { slug: 'role-b', title: 'Role B', department: null, workSetup: null, location: null, summary: 'Summary B.',
      responsibilities: ['Do B'], requiredQualifications: ['Qual B'], preferredQualifications: [], order: 2, published: true },
  ];
  c.eligibility = { criteria: ['Criterion'], documents: [], unsureGuidance: null };
  c.apply.steps = ['Step one.', 'Step two.'];
  c.contact.email = 'interns@example.org';
  c.privacy = { controller: 'Example Org', processor: 'Google', purpose: 'Registration', retention: '1 year',
    contact: 'privacy@example.org', policyUrl: null, approvalRef: 'PRIV-1' };
  return c;
}

function registerHrefs(html) {
  return [...html.matchAll(/<a class="btn btn-primary[^"]*" href="([^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&'));
}

function googleFormLinks(html) {
  return [...html.matchAll(/href="(https:\/\/docs\.google\.com[^"]*)"/g)].map((m) => m[1]);
}

test('shipped content is valid as a preview build and lists its placeholders', async () => {
  const result = validateContent(await baseContent());
  assert.deepEqual(result.errors, []);
  assert.ok(result.placeholders.length > 0);
});

test('release mode rejects any remaining placeholder (DAC-07)', async () => {
  const result = validateContent(await baseContent(), { release: true });
  assert.ok(result.errors.some((e) => e.includes('placeholder')));
});

test('release mode accepts fully approved content', async () => {
  const result = validateContent(approved(await baseContent()), { release: true });
  assert.deepEqual(result.errors, []);
});

test('every Register link equals the exact approved form URL and opens in the same tab (DAC-10, DAC-11)', async () => {
  const html = renderIndex(await baseContent(), OPTS);
  const hrefs = registerHrefs(html);
  assert.ok(hrefs.length >= 4, `expected hero, header, role and apply CTAs, got ${hrefs.length}`);
  for (const href of hrefs) assert.equal(href, FORM_URL);
  assert.deepEqual(new Set(googleFormLinks(html)), new Set([FORM_URL]));
  assert.doesNotMatch(html, /target=/);
});

test('the form URL must match the approved form ID exactly (DAC-14)', async () => {
  const content = await baseContent();
  assert.equal(content.registration.url, expectedFormUrl(content.registration.approvedFormId));
  const bad = [
    'https://forms.gle/abc123',
    'https://evil.example.com/forms/d/e/1FAIpQLSfV8tXTNl-DZL3wUmJ3H5sneP9l2mHm-9_1l2xXnA9uinpBFg/viewform',
    'https://docs.google.com/forms/d/e/1FAIpQLSfV8tXTNl-DZL3wUmJ3H5sneP9l2mHm-9_1l2xXnA9uinpBFg/edit',
    'https://docs.google.com/forms/d/e/SOMEOTHERFORMID/viewform',
    `${FORM_URL}?usp=sf_link`,
    FORM_URL.replace('https:', 'http:'),
  ];
  for (const url of bad) {
    const c = structuredClone(content);
    c.registration.url = url;
    assert.ok(validateContent(c).errors.some((e) => e.includes('registration.url')), url);
  }
});

test('closed and upcoming states contain no form links and no Register buttons (DAC-20, DAC-21)', async () => {
  const content = await baseContent();
  const closed = structuredClone(content);
  closed.registration.status = 'closed';
  const closedHtml = renderIndex(closed, OPTS);
  assert.equal(googleFormLinks(closedHtml).length, 0);
  assert.match(closedHtml, /Registration closed/);

  const upcoming = structuredClone(content);
  upcoming.registration.status = 'upcoming';
  upcoming.registration.timeZone = 'Asia/Manila';
  upcoming.registration.opensAt = '2030-01-15T09:00:00+08:00';
  assert.deepEqual(validateContent(upcoming).errors, []);
  const upcomingHtml = renderIndex(upcoming, OPTS);
  assert.equal(googleFormLinks(upcomingHtml).length, 0);
  assert.match(upcomingHtml, /Registration opens January 15, 2030/);
});

test('a past closing date while open fails the build; it does not close a live site (DAC-65)', async () => {
  const c = await baseContent();
  c.registration.timeZone = 'Asia/Manila';
  c.registration.closesAt = '2020-01-01T17:00:00+08:00';
  c.registration.deadlineStatement = 'Approved deadline wording.';
  assert.ok(validateContent(c).errors.some((e) => e.includes('closesAt is in the past')));
});

test('dates require a time zone and closing dates require approved deadline wording', async () => {
  const c = await baseContent();
  c.registration.closesAt = '2030-01-01T17:00:00+08:00';
  const errors = validateContent(c).errors;
  assert.ok(errors.some((e) => e.includes('timeZone')));
  assert.ok(errors.some((e) => e.includes('deadlineStatement')));
});

test('role CTAs have unique accessible names that begin with the visible label (DAC-12)', async () => {
  const html = renderIndex(approved(await baseContent()), OPTS);
  const names = [...html.matchAll(/aria-label="(Register for this role[^"]*)">Register for this role</g)].map((m) => m[1]);
  assert.deepEqual(names, ['Register for this role: Role A, on Google Forms', 'Register for this role: Role B, on Google Forms']);
  assert.match(html, /aria-label="Register now on Google Forms">Register now</);
});

test('zero roles shows neutral copy with no promise of future roles (DAC-05)', async () => {
  const c = approved(await baseContent());
  c.roles = [];
  const html = renderIndex(c, OPTS);
  assert.match(html, /No internship roles are currently listed\. Contact <a href="mailto:interns@example\.org">/);
  assert.doesNotMatch(html, /announced/i);
});

test('one role renders inline without a disclosure; unpublished roles are absent (DAC-04, DAC-06)', async () => {
  const c = approved(await baseContent());
  c.roles[1].published = false;
  const html = renderIndex(c, OPTS);
  assert.doesNotMatch(html, /<details>/);
  assert.match(html, /Role A/);
  assert.doesNotMatch(html, /Role B/);
});

test('the site collects nothing and has no inline styles or scripts (DAC-15, CSP)', async () => {
  const html = renderIndex(await baseContent(), OPTS);
  assert.doesNotMatch(html, /<form|<input|<script|style=|<style/i);
});

test('content is HTML-escaped', async () => {
  const c = approved(await baseContent());
  c.program.tagline = '<script>alert(1)</script>';
  const html = renderIndex(c, OPTS);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

test('placeholders are visibly marked and the preview banner appears only while they remain (BR-12)', async () => {
  const preview = renderIndex(await baseContent(), OPTS);
  assert.match(preview, /class="placeholder"/);
  assert.match(preview, /class="preview-banner"/);
  const release = renderIndex(approved(await baseContent()), OPTS);
  assert.doesNotMatch(release, /class="placeholder"|preview-banner|NEEDED/);
});

test('the 404 page links home and respects registration status', async () => {
  const content = await baseContent();
  assert.match(renderNotFound(content, OPTS), /Page not found[\s\S]*href="\/"/);
  const closed = structuredClone(content);
  closed.registration.status = 'closed';
  assert.equal(googleFormLinks(renderNotFound(closed, OPTS)).length, 0);
});

test('build writes index, 404 and a content-hashed stylesheet, and refuses invalid content', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'ire-build-'));
  const ok = await build({ outDir });
  assert.equal(ok.ok, true);
  assert.deepEqual((await readdir(outDir)).sort(), ['404.html', 'assets', 'index.html']);
  assert.match((await readdir(join(outDir, 'assets')))[0], /^styles\.[0-9a-f]{10}\.css$/);

  const badDir = await mkdtemp(join(tmpdir(), 'ire-bad-'));
  const badContent = join(badDir, 'site.json');
  const c = await baseContent();
  c.registration.url = 'https://forms.gle/abc123';
  await writeFile(badContent, JSON.stringify(c));
  const failed = await build({ contentPath: badContent, outDir: join(badDir, 'dist') });
  assert.equal(failed.ok, false);
});

test('a base path prefixes every internal link and the stylesheet (GitHub Pages project site)', async () => {
  const base = '/fai---internship-registration-/';
  const html = renderIndex(await baseContent(), { stylesheet: `${base}assets/styles.test.css`, base });
  assert.match(html, /href="\/fai---internship-registration-\/assets\/styles\.test\.css"/);
  assert.match(html, /class="wordmark" href="\/fai---internship-registration-\/"/);
  assert.match(html, /href="\/fai---internship-registration-\/#apply"/);
  assert.doesNotMatch(html, /href="\/(?!fai---internship-registration-\/)/, 'no link may point outside the base path');
  assert.match(renderNotFound(await baseContent(), { stylesheet: 'x', base }), /href="\/fai---internship-registration-\/">Go to the internship page/);
});

test('BASE_PATH is normalized and validated', () => {
  assert.equal(normalizeBase(), '/');
  assert.equal(normalizeBase(''), '/');
  assert.equal(normalizeBase('fai---internship-registration-'), '/fai---internship-registration-/');
  assert.equal(normalizeBase('/fai---internship-registration-/'), '/fai---internship-registration-/');
  assert.throws(() => normalizeBase('/bad path/'));
  assert.throws(() => normalizeBase('/"><script>/'));
});
