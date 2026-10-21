// Renders the site from content. Pure functions: content in, HTML strings out.
// Every registration link is produced by registerLink(), the single place that
// reads registration.url and registration.status (design §7.3).

import { isEmail, isPlaceholder, findPlaceholders, publishedRoles } from './content.mjs';

const ICON_EXTERNAL =
  '<svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_CHEVRON =
  '<svg class="icon chevron" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const WORK_SETUP_LABELS = { onsite: 'Onsite', hybrid: 'Hybrid', remote: 'Remote' };

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Visible text. Placeholders are marked so reviewers can't mistake them for approved content.
function text(value) {
  if (isPlaceholder(value)) {
    return `<span class="placeholder"><span class="placeholder-label">Content needed:</span> ${escapeHtml(value.replace(/^\[NEEDED:?\s*/, '').replace(/\]$/, ''))}</span>`;
  }
  return escapeHtml(value);
}

function present(value) {
  return value != null && value !== '';
}

function formatDate(iso, timeZone) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  }).format(new Date(iso));
}

// The accessible name always begins with the visible label (WCAG 2.5.3) and names the destination.
function registerLink(content, { label, accessibleName = `${label} on Google Forms`, size = 'md', extraClass = '' }) {
  const reg = content.registration;
  if (reg.status !== 'open') return '';
  const classes = ['btn', 'btn-primary', `btn-${size}`, extraClass].filter(Boolean).join(' ');
  return `<a class="${classes}" href="${escapeHtml(reg.url)}" aria-label="${escapeHtml(accessibleName)}">${escapeHtml(label)}${ICON_EXTERNAL}</a>`;
}

function contactLink(content) {
  const email = content.contact.email;
  return isEmail(email) ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : text(email);
}

function statusBadge(content) {
  const reg = content.registration;
  if (reg.status === 'open') {
    const until = reg.closesAt ? ` · closes ${escapeHtml(formatDate(reg.closesAt, reg.timeZone))}` : '';
    return `<p class="badge badge-open"><span class="badge-dot" aria-hidden="true"></span>Registration open${until}</p>`;
  }
  if (reg.status === 'upcoming') {
    return `<p class="badge badge-upcoming"><span class="badge-dot" aria-hidden="true"></span>Registration opens ${escapeHtml(formatDate(reg.opensAt, reg.timeZone))}</p>`;
  }
  return '<p class="badge badge-closed"><span class="badge-dot" aria-hidden="true"></span>Registration closed</p>';
}

function statusNotice(content) {
  const reg = content.registration;
  if (reg.status === 'open') return '';
  const message = reg.status === 'upcoming'
    ? `Registration opens ${escapeHtml(formatDate(reg.opensAt, reg.timeZone))}.`
    : text(reg.closedMessage);
  return `<p class="notice">${message} Questions? Contact ${contactLink(content)}.</p>`;
}

function list(items, className = '') {
  const cls = className ? ` class="${className}"` : '';
  return `<ul${cls}>${items.map((item) => `<li>${text(item)}</li>`).join('')}</ul>`;
}

function renderHeader(content) {
  const cta = registerLink(content, { label: 'Register', size: 'sm', extraClass: 'header-cta' });
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="wordmark" href="/">${text(content.organization.name)}</a>
    <nav class="site-nav" aria-label="Page sections">
      <ul>
        <li><a href="/#roles">Roles</a></li>
        <li><a href="/#requirements">Requirements</a></li>
        <li><a href="/#apply">How to apply</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
    ${cta}
  </div>
</header>`;
}

function renderFooter(content) {
  const year = new Date(content.site.lastUpdated).getUTCFullYear();
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <p>© ${year} ${text(content.organization.name)}</p>
    <p>Last updated ${escapeHtml(content.site.lastUpdated)}</p>
    <p><a href="/#privacy">Privacy</a> · <a href="/#contact">Contact</a></p>
  </div>
</footer>`;
}

function renderPreviewBanner(content) {
  if (findPlaceholders(content).length === 0) return '';
  return '<div class="preview-banner" role="note"><div class="container">Preview: this page contains placeholder text marked “Content needed”. It is not ready to publish.</div></div>';
}

function renderKeyFacts(content) {
  const facts = (content.program.facts ?? []).filter((fact) => present(fact.value));
  if (facts.length < 2) return '';
  const items = facts
    .map((fact) => `<div class="fact"><dt>${escapeHtml(fact.label)}</dt><dd>${text(fact.value)}</dd></div>`)
    .join('');
  return `<dl class="key-facts">${items}</dl>`;
}

function renderHero(content, roleCount) {
  const reg = content.registration;
  const notes = (reg.notes ?? []).map((note) => `<li>${text(note)}</li>`).join('');
  const inAppHelp = reg.status === 'open' && present(content.site.url)
    ? `<p class="help">If the form doesn't open, open this page in your browser: ${escapeHtml(content.site.url)}</p>`
    : '';
  const deadline = reg.status === 'open' && present(reg.deadlineStatement)
    ? `<p class="help deadline">${text(reg.deadlineStatement)}</p>`
    : '';
  const help = reg.status === 'open'
    ? `<p class="help">Registration takes place on Google Forms. Register now opens the form; your registration is only complete once you submit it there. Trouble opening it? <a href="#contact">Contact us</a>.</p>`
    : '';
  const facts = renderKeyFacts(content);
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-main">
    ${statusBadge(content)}
    <h1 id="hero-title">${text(content.program.name)}</h1>
    <p class="lead">${text(content.program.tagline)}</p>
    <div class="hero-actions">
      ${registerLink(content, { label: 'Register now', size: 'lg', extraClass: 'btn-block-mobile' })}
      ${roleCount > 0 ? '<a class="link-secondary" href="#roles">See open roles' + ICON_CHEVRON + '</a>' : ''}
    </div>
    ${statusNotice(content)}
    ${help}
    ${deadline}
    ${notes ? `<ul class="help notes">${notes}</ul>` : ''}
    ${inAppHelp}
    </div>
    ${facts ? `<aside class="hero-aside" aria-label="Key facts">${facts}</aside>` : ''}
  </div>
</section>`;
}

function renderOverview(content) {
  const paragraphs = (content.program.overview ?? []).filter(present);
  if (paragraphs.length === 0) return '';
  return `<section class="section" id="about" aria-labelledby="about-title">
  <div class="container prose">
    <h2 id="about-title">About the program</h2>
    ${paragraphs.map((p) => `<p>${text(p)}</p>`).join('')}
  </div>
</section>`;
}

function roleMeta(role) {
  const parts = [role.department, role.workSetup ? WORK_SETUP_LABELS[role.workSetup] : null, role.location]
    .filter(present)
    .map(text);
  return parts.length ? `<p class="role-meta">${parts.join(' · ')}</p>` : '';
}

function roleDetails(content, role) {
  const preferred = (role.preferredQualifications ?? []).filter(present);
  return `<div class="role-details">
      <h4>What you'll do</h4>
      ${list(role.responsibilities)}
      <h4>Must have</h4>
      ${list(role.requiredQualifications)}
      ${preferred.length ? `<h4>Nice to have</h4>${list(preferred)}` : ''}
      ${registerLink(content, { label: 'Register for this role', accessibleName: `Register for this role: ${role.title}, on Google Forms`, extraClass: 'btn-block-mobile' })}
    </div>`;
}

function renderRoleCard(content, role) {
  return `<li class="role-item">
  <article class="role-card" id="role-${escapeHtml(role.slug)}" aria-labelledby="role-${escapeHtml(role.slug)}-title">
    <h3 id="role-${escapeHtml(role.slug)}-title">${text(role.title)}</h3>
    ${roleMeta(role)}
    <p class="role-summary">${text(role.summary)}</p>
    <details>
      <summary>View details<span class="visually-hidden"> for ${escapeHtml(role.title)}</span>${ICON_CHEVRON}</summary>
      ${roleDetails(content, role)}
    </details>
  </article>
</li>`;
}

function renderRoles(content, roles) {
  let body;
  if (roles.length === 0) {
    body = `<p>No internship roles are currently listed. Contact ${contactLink(content)} for information.</p>`;
  } else if (roles.length === 1) {
    const role = roles[0];
    body = `<article class="role-card role-single" id="role-${escapeHtml(role.slug)}" aria-labelledby="role-${escapeHtml(role.slug)}-title">
    <h3 id="role-${escapeHtml(role.slug)}-title">${text(role.title)}</h3>
    ${roleMeta(role)}
    <p class="role-summary">${text(role.summary)}</p>
    ${roleDetails(content, role)}
  </article>`;
  } else {
    body = `<ul class="role-grid">${roles.map((role) => renderRoleCard(content, role)).join('')}</ul>`;
  }
  const count = roles.length === 1 ? '1 open role' : `${roles.length} open roles`;
  return `<section class="section section-alt" id="roles" aria-labelledby="roles-title">
  <div class="container">
    <div class="section-head">
      <h2 id="roles-title">Open roles</h2>
      ${roles.length ? `<p class="count">${count}</p>` : ''}
    </div>
    ${body}
  </div>
</section>`;
}

function renderEligibility(content) {
  const { criteria, documents, unsureGuidance } = content.eligibility;
  const docs = (documents ?? []).filter(present);
  const callout = present(unsureGuidance)
    ? `<div class="callout"><h3>Not sure if you qualify?</h3><p>${text(unsureGuidance)} <a href="#contact">Contact us</a>.</p></div>`
    : '';
  return `<section class="section" id="requirements" aria-labelledby="requirements-title">
  <div class="container prose">
    <h2 id="requirements-title">Who can apply</h2>
    ${list(criteria, 'checklist')}
    ${docs.length ? `<h3>What to prepare</h3>${list(docs)}` : ''}
    ${callout}
  </div>
</section>`;
}

function renderApply(content) {
  const steps = content.apply.steps.map((step) => `<li>${text(step)}</li>`).join('');
  return `<section class="section section-alt" id="apply" aria-labelledby="apply-title">
  <div class="container prose">
    <h2 id="apply-title">How to apply</h2>
    <ol class="steps">${steps}</ol>
    ${registerLink(content, { label: 'Register now', extraClass: 'btn-block-mobile' })}
    ${statusNotice(content)}
  </div>
</section>`;
}

function renderFaq(content) {
  const items = (content.faq ?? []).filter((item) => item.published !== false);
  if (items.length < 3) return '';
  const entries = items
    .map((item) => `<details class="faq-item"><summary>${text(item.question)}${ICON_CHEVRON}</summary><p>${text(item.answer)}</p></details>`)
    .join('');
  return `<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="container prose">
    <h2 id="faq-title">Frequently asked questions</h2>
    ${entries}
  </div>
</section>`;
}

function renderContact(content) {
  const location = present(content.contact.location)
    ? `<p><span class="label">Where to find us:</span> ${text(content.contact.location)}</p>`
    : '';
  return `<section class="section" id="contact" aria-labelledby="contact-title">
  <div class="container prose">
    <h2 id="contact-title">Contact</h2>
    <p><span class="label">Email:</span> ${contactLink(content)}</p>
    ${location}
  </div>
</section>`;
}

function renderPrivacy(content) {
  const p = content.privacy;
  const rows = [
    ['Who is responsible for your data', p.controller],
    ['Service provider', p.processor],
    ['Why it is collected', p.purpose],
    ['How long it is kept', p.retention],
    ['Privacy contact', p.contact],
  ].filter(([, value]) => present(value));
  const policy = present(p.policyUrl) ? `<p><a href="${escapeHtml(p.policyUrl)}">Read the full privacy policy</a></p>` : '';
  return `<section class="section section-alt" id="privacy" aria-labelledby="privacy-title">
  <div class="container prose">
    <h2 id="privacy-title">Your privacy</h2>
    <p>This website has no forms and sets no cookies. Registration details are collected through Google Forms.</p>
    <dl class="privacy-list">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${text(value)}</dd></div>`).join('')}</dl>
    ${policy}
  </div>
</section>`;
}

function page(content, { title, description, stylesheet, body }) {
  return `<!doctype html>
<html lang="${escapeHtml(content.site.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="icon" href="data:,">
<link rel="stylesheet" href="${stylesheet}">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${renderPreviewBanner(content)}
${renderHeader(content)}
<main id="main" tabindex="-1">
${body}
</main>
${renderFooter(content)}
</body>
</html>
`;
}

export function renderIndex(content, { stylesheet }) {
  const roles = publishedRoles(content);
  const body = [
    renderHero(content, roles.length),
    renderOverview(content),
    renderRoles(content, roles),
    renderEligibility(content),
    renderApply(content),
    renderFaq(content),
    renderContact(content),
    renderPrivacy(content),
  ].join('\n');
  return page(content, {
    title: `${content.program.name} | ${content.organization.name}`,
    description: content.program.tagline,
    stylesheet,
    body,
  });
}

export function renderNotFound(content, { stylesheet }) {
  const body = `<section class="hero" aria-labelledby="hero-title">
  <div class="container">
    <h1 id="hero-title">Page not found</h1>
    <p class="lead">This page doesn't exist. The internship information is on the home page.</p>
    <div class="hero-actions">
      <a class="btn btn-secondary btn-md" href="/">Go to the internship page</a>
      ${registerLink(content, { label: 'Register now' })}
    </div>
  </div>
</section>`;
  return page(content, {
    title: `Page not found | ${content.organization.name}`,
    description: content.program.tagline,
    stylesheet,
    body,
  });
}
