# Internship Registration Explorer

A mobile-first, static website that students open from a QR code at a career fair. It explains the internship program, lists the open roles, and sends applicants to the existing Google Form to register.

The site is an information layer only. It has no backend, no forms, no cookies and no analytics. Registration happens entirely in Google Forms, and selecting **Register now** does not mean an application was submitted.

Design baseline: [`docs/design/DESIGN-internship-registration-explorer-v0.7.md`](docs/design/DESIGN-internship-registration-explorer-v0.7.md). Build decisions, open items and known limitations: [`docs/implementation-notes.md`](docs/implementation-notes.md).

## Run it

Requires Node.js 20 or newer.

```bash
npm install            # dev-only test tools (Playwright, axe-core); the site itself has no dependencies
npm run build          # preview build into dist/ (placeholders allowed and listed)
npm run preview        # build, then serve dist/ at http://127.0.0.1:4173
npm test               # unit tests: content validation and rendered HTML
npm run test:e2e       # build, then browser tests of the applicant journey and accessibility
npm run build:release  # release build: fails while any placeholder content remains
```

`dist/` is plain HTML and CSS and can be served by any static host.

## Updating content

All content lives in **[`content/site.json`](content/site.json)**. You don't need to touch code to change it. After editing, run `npm run build` (and `npm test`) to check it.

Text that still needs approval starts with `[NEEDED: …]`. It shows on the page as a highlighted **Content needed** label, with a preview banner at the top. `npm run build:release` refuses to build until every placeholder is replaced with approved content.

| Section | What it controls |
|---|---|
| `organization.name` | Name in the header, footer and page title |
| `program` | Program name (main heading), one-sentence tagline (≤ 160 characters), overview paragraphs, up to 4 key facts |
| `registration` | Form link, registration status and dates (see below) |
| `roles` | One entry per role. Set `"published": false` to hide a role without deleting it |
| `eligibility` | Who can apply, documents to prepare, and optional "Not sure if you qualify?" guidance |
| `apply.steps` | The "How to apply" steps |
| `contact` | Monitored email address (must be a real address for release) and optional location |
| `privacy` | Privacy notice fields, approved by the privacy owner |
| `faq` | Optional; shown only when there are at least 3 entries |

### Common tasks

- **Change the form.** Set `registration.approvedFormId` to the new form's published ID and `registration.url` to `https://docs.google.com/forms/d/e/{ID}/viewform`. The build rejects any other URL, including `forms.gle` short links, so every Register button always points to the approved form.
- **Close registration.** Switch the Google Form's "Accepting responses" off first, then set `registration.status` to `"closed"` and redeploy. Every Register button is removed and `registration.closedMessage` is shown. The website can't close itself at a deadline.
- **Registration not open yet.** Set `status` to `"upcoming"`, plus `opensAt` (ISO date-time with offset) and `timeZone` (an IANA name such as `"Asia/Manila"`).
- **Show a closing date.** Set `closesAt`, `timeZone`, and `deadlineStatement`, the wording approved for the deadline. The build fails if `closesAt` has passed while `status` is still `"open"`, so an out-of-date "open" page can't be redeployed.
- **Add a role.** Copy a role entry, give it a unique kebab-case `slug` and a unique `title`, and set `order`.

## Project layout

```
content/site.json        all site content (edit this)
src/content.mjs          content validation rules
src/render.mjs           HTML rendering
src/styles.css           design tokens and styles
scripts/build.mjs        builds dist/ (preview or --release)
scripts/serve.mjs        local static server for preview and tests
tests/unit/              validation and rendering tests (node:test)
tests/e2e/               browser journey and accessibility tests (Playwright, axe-core)
docs/                    design baseline and implementation notes
```
