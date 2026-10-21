// Content loading and validation. Errors stop the build; warnings are printed.
// Release mode additionally rejects any remaining placeholder.

import { readFile } from 'node:fs/promises';

export const PLACEHOLDER_PREFIX = '[NEEDED';
const STATUSES = ['open', 'upcoming', 'closed'];
const WORK_SETUPS = ['onsite', 'hybrid', 'remote'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_ID = /^[A-Za-z0-9_-]+$/;

export async function loadContent(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export function isPlaceholder(value) {
  return typeof value === 'string' && value.startsWith(PLACEHOLDER_PREFIX);
}

export function isEmail(value) {
  return typeof value === 'string' && EMAIL.test(value);
}

export function expectedFormUrl(formId) {
  return `https://docs.google.com/forms/d/e/${formId}/viewform`;
}

export function publishedRoles(content) {
  return (content.roles ?? [])
    .filter((role) => role.published === true)
    .sort((a, b) => a.order - b.order);
}

// Placeholders that would appear on the page (unpublished roles are skipped).
export function findPlaceholders(content) {
  const found = [];
  const walk = (value, path) => {
    if (isPlaceholder(value)) found.push({ path, value });
    else if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${path}[${i}]`));
    else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) walk(child, path ? `${path}.${key}` : key);
    }
  };
  const { roles, ...rest } = content;
  walk(rest, '');
  (roles ?? []).forEach((role, i) => {
    if (role.published === true) walk(role, `roles[${i}]`);
  });
  return found;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isValidTimeZone(value) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function validateContent(content, { release = false, now = new Date() } = {}) {
  const errors = [];
  const warnings = [];
  const check = (cond, message) => {
    if (!cond) errors.push(message);
  };

  check(isNonEmptyString(content.organization?.name), 'organization.name is required');
  check(isNonEmptyString(content.program?.name), 'program.name is required');
  check(isNonEmptyString(content.program?.tagline), 'program.tagline is required');
  if (isNonEmptyString(content.program?.tagline) && !isPlaceholder(content.program.tagline)) {
    check(content.program.tagline.length <= 160, 'program.tagline must be 160 characters or fewer');
  }
  const facts = content.program?.facts ?? [];
  check(Array.isArray(facts) && facts.length <= 4, 'program.facts must be a list of at most 4 items');
  check(isValidDate(content.site?.lastUpdated), 'site.lastUpdated must be a date (YYYY-MM-DD)');

  // Registration: the link must be exactly the approved form's viewform URL (design §7.4, DAC-14).
  const reg = content.registration ?? {};
  check(STATUSES.includes(reg.status), `registration.status must be one of: ${STATUSES.join(', ')}`);
  check(typeof reg.approvedFormId === 'string' && FORM_ID.test(reg.approvedFormId),
    'registration.approvedFormId must be the published Google Form ID');
  if (typeof reg.approvedFormId === 'string') {
    check(reg.url === expectedFormUrl(reg.approvedFormId),
      `registration.url must be exactly ${expectedFormUrl(reg.approvedFormId)} (no short links, other forms or parameters)`);
  }
  check(isNonEmptyString(reg.closedMessage), 'registration.closedMessage is required');

  const hasDates = reg.opensAt != null || reg.closesAt != null;
  if (hasDates) {
    check(isNonEmptyString(reg.timeZone) && isValidTimeZone(reg.timeZone),
      'registration.timeZone must be an IANA time zone (for example "Asia/Manila") when dates are set');
  }
  if (reg.status === 'upcoming') {
    check(isValidDate(reg.opensAt), 'registration.opensAt is required when status is "upcoming"');
  }
  if (reg.opensAt != null) check(isValidDate(reg.opensAt), 'registration.opensAt must be an ISO date-time');
  if (reg.closesAt != null) {
    check(isValidDate(reg.closesAt), 'registration.closesAt must be an ISO date-time');
    check(isNonEmptyString(reg.deadlineStatement),
      'registration.deadlineStatement (approved deadline wording) is required when closesAt is set');
    // Stops a stale "open" page being redeployed; it does not close a live site (design FS-1, DAC-65).
    if (reg.status === 'open' && isValidDate(reg.closesAt) && Date.parse(reg.closesAt) < now.getTime()) {
      errors.push('registration.closesAt is in the past while status is "open"; close registration or correct the date');
    }
  }

  // Roles.
  const roles = content.roles ?? [];
  check(Array.isArray(roles), 'roles must be a list');
  const slugs = new Set();
  roles.forEach((role, i) => {
    const at = `roles[${i}]`;
    check(typeof role.slug === 'string' && SLUG.test(role.slug), `${at}.slug must be kebab-case`);
    check(!slugs.has(role.slug), `${at}.slug "${role.slug}" is duplicated`);
    slugs.add(role.slug);
    check(isNonEmptyString(role.title), `${at}.title is required`);
    check(isNonEmptyString(role.summary), `${at}.summary is required`);
    if (isNonEmptyString(role.summary) && !isPlaceholder(role.summary)) {
      check(role.summary.length <= 200, `${at}.summary must be 200 characters or fewer`);
    }
    check(Array.isArray(role.responsibilities) && role.responsibilities.length > 0,
      `${at}.responsibilities needs at least one item`);
    check(Array.isArray(role.requiredQualifications) && role.requiredQualifications.length > 0,
      `${at}.requiredQualifications needs at least one item`);
    check(role.workSetup == null || WORK_SETUPS.includes(role.workSetup),
      `${at}.workSetup must be one of: ${WORK_SETUPS.join(', ')}, or null`);
    check(Number.isInteger(role.order), `${at}.order must be a whole number`);
    check(typeof role.published === 'boolean', `${at}.published must be true or false`);
  });
  const shown = publishedRoles(content);
  const titles = shown.map((role) => role.title);
  check(new Set(titles).size === titles.length,
    'published role titles must be unique (each role CTA needs a unique accessible name)');
  if (shown.length > 8) {
    warnings.push(`${shown.length} roles are published; the design proposes filters above 8 roles (not implemented)`);
  }

  check(Array.isArray(content.eligibility?.criteria) && content.eligibility.criteria.length > 0,
    'eligibility.criteria needs at least one item');
  check(Array.isArray(content.apply?.steps) && content.apply.steps.length > 0, 'apply.steps needs at least one item');
  check(isNonEmptyString(content.contact?.email), 'contact.email is required');
  if (isNonEmptyString(content.contact?.email) && !isPlaceholder(content.contact.email)) {
    check(isEmail(content.contact.email), 'contact.email must be a valid email address');
  }
  for (const field of ['controller', 'purpose', 'contact', 'approvalRef']) {
    check(isNonEmptyString(content.privacy?.[field]), `privacy.${field} is required`);
  }

  const placeholders = findPlaceholders(content);
  if (placeholders.length > 0) {
    const message = `${placeholders.length} placeholder(s) still need approved content`;
    if (release) errors.push(`${message}; release builds must not contain placeholders`);
    else warnings.push(`${message} (preview build only)`);
  }

  return { errors, warnings, placeholders };
}
