# Internship Registration Explorer — DESIGN Specification v0.7

| Field | Value |
|---|---|
| Phase | DESIGN (Kniel Workflow Framework) |
| Version | 0.7 — controlled correction of v0.6 from the independent VALIDATE review of v0.6 (no redesign) |
| Supersedes | `DESIGN-internship-registration-explorer-v0.6.md` (preserved unchanged); v0.5, v0.4, v0.3, v0.2 and v0.1 are also preserved unchanged |
| Correction sources | v0.2: `VALIDATE-internship-registration-explorer-design.md` (DEF-001 – DEF-023). v0.3: independent VALIDATE review of v0.2 dated 21 October 2026, supplied in the project conversation (findings IV-01 – IV-07). v0.4: independent VALIDATE review of v0.3 dated 21 October 2026, supplied in the project conversation (findings V03-01 – V03-04). v0.5: independent VALIDATE review of v0.4 dated 21 October 2026, supplied in the project conversation (findings V04-01 – V04-03). v0.6: independent VALIDATE review of v0.5 dated 21 October 2026, supplied in the project conversation (findings V05-01 – V05-02). v0.7: independent VALIDATE review of v0.6, supplied in the project conversation (findings V06-01 – V06-02) |
| Date | 2026-10-21 |
| Status | **Not approved for BUILD.** Provisional design proposal awaiting a fresh independent VALIDATE pass on v0.7 and decisions B-1 – B-12 (D-09) |
| Scope | Design only. No code, no repo changes, no deployment, no Google Forms changes. |

Legend used throughout (revised in v0.2, DEF-001):

**Status.** Every requirement, design proposal and acceptance criterion has exactly one status:
- **CONFIRMED**: approved by an authorized owner, with the approval recorded. *No item has this status at v0.2.*
- **PROPOSED**: a requirement or design choice awaiting the decision named next to it.
- **UNRESOLVED**: required information or a decision is missing (shown inline as **[NEEDED]**).
- **OUT OF SCOPE**: explicitly excluded (D-01 §1.5).

**Source and inline tags:**
- **[BRIEF-STATED]**: stated in the DESIGN brief. **Not** approved by a THINK gate. Status PROPOSED until DEC-001 and DEC-002.
- **[DESIGN]**: originated in this specification (status PROPOSED).
- **[PROPOSED]**: inline marker for a design choice pending a decision.
- **[NEEDED]**: inline marker for UNRESOLVED information.
- **[VERIFIED]**: directly observed, with evidence cited.

**IDs.** BR-nn = brief-derived requirements. DP-nn = design-originated proposals (new in v0.2). DEC-nnn = decisions (DEC-001 – DEC-012 match the VALIDATE report; DEC-013 was added in v0.3 and DEC-014 in v0.5). IV-nn = findings of the independent review of v0.2 (that report's V-01 – V-07). V03-nn = findings of the independent review of v0.3. V04-nn = findings of the independent review of v0.4. V05-nn = findings of the independent review of v0.5. V06-nn = findings of the independent review of v0.6. B-n = blockers, each mapped to one DEC (D-09 §9.1). OD-nn = noncritical open decisions kept from v0.1 (D-09 §9.2). DAC-nn = acceptance criteria (D-08).

---

## 0. Phase Entry Gate (THINK baseline check)

### 0.1 Evidence inspected

| Source | Result | Evidence |
|---|---|---|
| Project repo `AFAIK2026/fai---internship-registration-` | **Empty.** No commits on any branch; remote has no refs. | `git log` → "does not have any commits yet"; `git ls-remote origin` → no output; working tree has only `.git/` |
| GitHub issues in the project repo | **None** (0 open, 0 closed) | GitHub issues API: `totalCount: 0` |
| THINK baseline document / validation report | **Not found** anywhere available to this session | — |
| DESIGN brief (this request) | Gives objective, audience, form URL, reference URL, and the primary journey | Request text |
| Reference site (live) | **Could not be reached** from the sandbox (DNS resolution blocked) | `getaddrinfo ENOTFOUND filinvest-properties-explorer.vercel.app` |
| Reference source code | **Inspected read-only** at `Waphayll/filinvest-properties-explorer` (public, `main`, shallow clone). Not modified. | See §0.3 |
| Google Form endpoint | **Could not be reached** from the sandbox (proxy 403 / DNS) | `curl … CONNECT tunnel failed, response 403` |

**Conclusion:** No THINK baseline or THINK validation findings exist in any source I can access. **I cannot claim THINK has been approved.** The only requirements I can trace to are in the DESIGN brief. Section 0.2 gives them provisional IDs so they can be traced.

### 0.2 Critical prerequisites

| # | Prerequisite | Status | Evidence / gap | Blocks BUILD? |
|---|---|---|---|---|
| P-1 | Project objective and intended audience | **[BRIEF-STATED]**; UNRESOLVED until a baseline is adopted | Brief §1: "help career fair attendees discover internship opportunities and complete registration"; users = students on mobile via QR | **Yes**, until DEC-001 (B-6) |
| P-2 | Internship content requirements | **[NEEDED] — unresolved** | No organization name, roles, number of roles, eligibility, dates, or benefits supplied | **Yes** |
| P-3 | Content owner and approver | **[NEEDED] — unresolved** | Not named | **Yes** |
| P-4 | Google Forms registration approach | **[BRIEF-STATED]** approach; form behaviour **unverified** | URL supplied. Whether it is accepting responses, requires sign-in, is restricted to an organization domain, or what its fields are could not be checked | Partly. The approach is brief-stated (DEC-001); the exact form ID needs DEC-012 (B-9); access must be verified before release (DEC-007, B-5) |
| P-5 | Privacy and applicant-data responsibilities | **[NEEDED] — unresolved** | Data controller / form owner, retention, and applicable law are not identified | **Yes** (a privacy notice cannot be published without them) |
| P-6 | Hosting and organizational constraints | **[NEEDED] — unresolved** | No IT policy, domain, or hosting account information | **Yes** (affects the QR URL, which is printed and hard to change) |
| P-7 | Minimum acceptance criteria for the user journey | **Partially [BRIEF-STATED]** | The brief's 8-step journey is usable as the criteria basis; D-08 turns it into testable criteria (status PROPOSED) | No; the criteria themselves await DEC-002 (B-7) |

**Gate result:** THINK is **not demonstrably approved**. Under the brief's own rule, I've continued with a **provisional** design. It is built so that the unresolved items are **content and configuration decisions, not architecture changes**. Resolving them should not force a redesign. Every decision that depends on them is labelled [PROPOSED] or [NEEDED].

### 0.3 Reference inspection — verified observations (from source code)

Caveat: these come from the repository's `main` branch at commit `b9e9576`. The deployed site may differ. I haven't inferred anything about the live site beyond what the code shows.

| Area | Verified observation | Evidence (file) |
|---|---|---|
| Stack | Vite 6, React 19, TypeScript, Tailwind CSS 4, `motion`, `animejs`, Leaflet / react-leaflet, `qrcode.react`, optional Gemini (`@google/genai`), `express` (a dependency; no usage found in `src/`) | `package.json` |
| Screen flow | State machine of four full-screen views: `loading → landing → selection → viewer`, plus an inquiry modal | `src/App.tsx` |
| Loading | Blocking preloader: waits for all carousel, background, and logo images and concept maps to download and decode, then pauses 800 ms, before showing anything | `src/hooks/useAssetPreloader.ts` |
| Landing | Rotating background photos; H1 "Invest in a Prime Business Address"; italic subtitle; the whole screen is a click target with a pulsing "Tap Anywhere to Begin" button; desktop-only QR code "Scan to open on mobile" | `src/screens/LandingScreen.tsx` |
| Discovery | Full-screen, swipe-driven, looping carousel (one project at a time). Chevrons on desktop only; segmented dot indicators; per-slide CTA "Explore Township" | `src/screens/SelectionScreen.tsx` |
| Detail | Horizontal snap panels: split image/description, then an interactive site plan map | `src/screens/ViewerScreen.tsx`, `InteractiveSDP.tsx` |
| Lead capture | Inquiry form stores leads in `localStorage`; inquiries disabled by default | `src/App.tsx`, `InquiryModal.tsx` |
| Kiosk behaviour | 3-minute inactivity timeout resets to landing | `src/hooks/useInactivityTimeout.ts` |
| Visual | Primary `#171796`; base background `#1a2b4b`; Inter (body) and Montserrat (display), self-hosted via `@fontsource`; many 8–11 px uppercase, widely tracked labels | `src/index.css`, screens |
| Extras | Easter egg (7 clicks → external redirect), cursor glow, theme editor, chatbot | `src/App.tsx`, `components/` |
| Accessibility signals | Some `aria-label`s on icon buttons (e.g. carousel chevrons). No `prefers-reduced-motion` or `focus-visible` handling found in `src/` | grep of `src/` |
| Asset weight | `public/` is ~1.5 GB (Filinvest City photos ~1.4 GB) | `du -sh public` |

### 0.4 Reference evaluation — what to adopt, what to reject

| Reference pattern | Decision | Reasoning |
|---|---|---|
| One clear headline + one primary CTA on first view | **Adopt** | Matches the brief's "immediately understands" requirement |
| Visual cards for browsing multiple items, with indicators | **Adapt** as a stacked card list, not a carousel | A carousel shows one item at a time and hides the count; a scrollable list shows every option and works with the keyboard and Ctrl+F |
| Image + description detail pattern | **Adapt** as in-place expandable role details | Keeps the student on one page, one tap from Register |
| Self-hosted fonts, no CDN | **Adopt the principle** (zero third-party requests). Go further with a system font stack | Fewer bytes; no third-party dependency |
| "Scan to open on mobile" QR | **Adopt** for printed materials and an optional desktop booth screen | Directly relevant to a physical fair |
| Blocking preloader | **Reject** | Delays all information behind image downloads; bad on fair Wi-Fi |
| "Tap anywhere to begin" splash | **Reject** | Adds a step between scanning and understanding |
| Full-screen swipe carousel | **Reject** | Hides content, swipe-dependent, weak for keyboard and screen readers |
| Interactive map, chatbot, theme editor, easter egg, cursor glow | **Reject** | Not relevant to internship discovery; adds weight and risk |
| On-site lead capture | **Reject** | Would duplicate Google Forms and create a second store of personal data (violates the brief) |
| Inactivity reset | **Reject for mobile.** Optional only if a booth kiosk is approved (OD-10) | Only a kiosk needs it |
| Tiny uppercase tracked labels; heavy animation libraries | **Reject** | Legibility and performance |

---

## Brief-derived requirements (provisional traceability IDs)

**BR-01 – BR-12 are proposals, not approved business requirements.** They are derived from the DESIGN brief because no THINK baseline exists. Their status stays PROPOSED until DEC-001 (adopt a baseline) and DEC-002 (approve requirements). Map them to official THINK IDs when THINK is published.

| ID | Requirement (from brief) | Type | Source | Status | Design reference |
|---|---|---|---|---|---|
| BR-01 | Students immediately understand what the internship opportunity is | Functional | [BRIEF-STATED] §1, §4 step 3 | PROPOSED (DEC-002) | Hero, KeyFacts, ProgramOverview |
| BR-02 | Students can explore the opportunities when there is more than one | Functional | [BRIEF-STATED] §4 step 4, §5 | PROPOSED (DEC-002) | RoleList, RoleCard, §3.1 |
| BR-03 | Students can review qualifications and requirements | Functional | [BRIEF-STATED] §4 step 5 | PROPOSED (DEC-002) | RoleDetails, EligibilitySection |
| BR-04 | A "Register Now" action opens the supplied Google Form | Functional | [BRIEF-STATED] §1, §4 steps 6–8, §8 | PROPOSED (DEC-002) | RegisterLink, §2.4 |
| BR-05 | Google Forms remains the only system collecting and managing submissions; no custom form | Constraint | [BRIEF-STATED] §1, §8 | PROPOSED (DEC-002) | §2.5, §7.2 |
| BR-06 | Mobile-first; works when opened from a QR code at a fair | Non-functional | [BRIEF-STATED] §1, §7 | PROPOSED (DEC-002) | D-04, §5.5, §7.14 |
| BR-07 | Explorer-inspired, professionally branded; no invented branding | Constraint | [BRIEF-STATED] §1, §6 | PROPOSED (DEC-002) | D-05, §5.9 |
| BR-08 | Handle direct access, uncertain eligibility, inaccessible form, poor network, closed registration or outdated link, contact, keyboard / assistive technology | Functional | [BRIEF-STATED] §4 | PROPOSED (DEC-002) | AF-1–6, FS-1–9 |
| BR-09 | Accessible, privacy-conscious, reliable, fast on ordinary mobile connections | Non-functional | [BRIEF-STATED] §10 | PROPOSED (DEC-002) | §5.10, §7.8, §7.9, §7.13 |
| BR-10 | Maintainable by organizers without unnecessary development work, without an unrequested CMS | Non-functional | [BRIEF-STATED] §9 | PROPOSED (DEC-002) | §7.3, §7.4, §7.10, §7.12 |
| BR-11 | No database, auth, backend, paid API, or applicant management system unless documented | Constraint | [BRIEF-STATED] §11 | PROPOSED (DEC-002) | §7.1, §7.2 |
| BR-12 | No fabricated opportunities, qualifications, claims, or deadlines | Constraint | [BRIEF-STATED] §9 | PROPOSED (DEC-002) | Principle 4, §7.12 |

### Design-originated proposals (DP), new in v0.2

These features and targets are not in the brief. Each is PROPOSED and needs the decision shown. Acceptance criteria that enforce one are marked **conditional** in D-08 and become N/A if it is rejected.

| ID | Proposal | Supports | Decision | Status |
|---|---|---|---|---|
| DP-01 | Measurable goals G-1–G-5, including the performance and page-weight thresholds (§1.2, §7.9) | BR-01, BR-06, BR-09, BR-10 | DEC-002 | PROPOSED |
| DP-02 | `upcoming` registration state (FS-2) | BR-08 | DEC-002 | PROPOSED |
| DP-03 | Mobile sticky registration bar (§2.5) | BR-04, BR-06 | DEC-009 | PROPOSED, conditional on usability and accessibility evidence |
| DP-04 | Same-tab link-out to the form (§2.4, §2.5) | BR-04, BR-06 | DEC-002 | PROPOSED |
| DP-05 | Adaptive role list thresholds: 1 / 2–8 / filters above 8 / search above 20 (§3.1) | BR-02 | DEC-011 (after DEC-003) | PROPOSED (hypothesis) |
| DP-06 | KeyFacts, FAQ, 404 page, "Last updated" date, Open Graph metadata | BR-01, BR-08, BR-10 | DEC-002 | PROPOSED |
| DP-07 | Provisional visual system (D-05) | BR-07 | OD-05 | PROPOSED |
| DP-08 | Desktop QR panel | BR-06 | OD-10 | PROPOSED |
| DP-09 | Role prefill in form links | BR-04 | OD-09 | PROPOSED (default off) |
| DP-10 | Analytics, intent-only events | — | OD-08 | PROPOSED (default none) |
| DP-11 | Exact form-ID pinning with build-time validation (§7.4) | BR-04, BR-10 | DEC-012 | PROPOSED |
| DP-12 | Deadline and closure procedure, including the build rule for a past `closesAt` (FS-1, §7.4, §7.10) | BR-08, BR-10 | DEC-010 | PROPOSED |
| DP-13 | Technology stack: generator and CSS approach (§7.1) | BR-09, BR-10, BR-11 | DEC-008 | UNRESOLVED |
| DP-14 | Security response-header policy: the CSP, HSTS, Referrer-Policy and frame-protection controls in §7.8, and the host capability they require (added in v0.3, IV-01) | BR-09 | DEC-013 | PROPOSED |
| DP-15 | Register CTA placements beyond the hero: tablet/desktop header, each expanded role, How to apply, 404 page (added in v0.3, IV-06) | BR-04, BR-06 | DEC-002 | PROPOSED |

---

## Kniel output crosswalk

The brief's deliverables D-01 to D-09 contain all 17 standard Kniel DESIGN outputs:

| Kniel output | Where |
|---|---|
| 1 Executive Summary | Executive Summary (below) |
| 2 Information Architecture | D-03 |
| 3 User Flow | D-02 |
| 4 Wireframes | D-04 |
| 5 UI Layout | D-04 |
| 6 UX Decisions | D-02 §2.5, D-03 §3.4 |
| 7 Component Architecture | D-06, D-07 §7.3 |
| 8 Design System | D-05 |
| 9 Database Schema | D-07 §7.4 — **N/A (no database)**; the content model is the only schema |
| 10 API Design | D-07 §7.5 — **N/A (no API)**; one outbound link contract |
| 11 Folder Structure | D-07 §7.6 |
| 12 Naming Conventions | D-07 §7.7 |
| 13 Security | D-07 §7.8 |
| 14 Performance | D-07 §7.9 |
| 15 Design Risks | D-09 |
| 16 Build Instructions | D-07 §7.11 |
| 17 Acceptance Criteria | D-08 |
| — Traceability matrix (new in v0.2) | D-10 |
| — Change log and consistency audit (new in v0.2) | End of document |

---

## Executive Summary

**What we're designing:** a single-page, static, mobile-first website. A QR code at the fair opens it. It explains the internship program, lists the open roles as expandable cards, and sends students to the existing Google Form with one tap from the hero, from each role, and (on mobile, if the sticky bar DP-03 is approved) from anywhere on the page.

**Key decisions (all [PROPOSED] pending gate approval):**

| # | Decision | Why |
|---|---|---|
| 1 | **One page.** A role card list appears only when there is more than one role; filters only above 8 roles (a hypothesis: DP-05, DEC-011) | Fewest steps from scan to register; the opportunity count decides how complex discovery needs to be |
| 2 | **Link out to Google Forms in the same tab** (no embed, no custom form; same tab is DP-04) | Most reliable on mobile and in in-app browsers; Google owns submission, validation, and confirmation |
| 3 | **One configured registration URL, pinned to the exact approved form ID (DP-11, DEC-012), and one status flag** (`open` / `upcoming` / `closed`) drive every CTA | Changing the form or closing registration is a one-line content edit |
| 4 | **The QR code points to the website, never directly to the form** | Lets organizers change the form link after QR codes are printed |
| 5 | **Static site, HTML-first, zero third-party scripts.** Generator **UNRESOLVED** (DEC-008): Astro is the provisional leaning; Vite + React with prerendering and plain HTML with a build step remain candidates | Works without JavaScript, loads fast on fair Wi-Fi, HTTPS hosting with custom security headers, content in one validated file |
| 6 | **Provisional neutral visual system** (navy/blue, system fonts), ready to be replaced by official branding | The brief forbids inventing a brand |

**What is blocking BUILD:** no THINK baseline (B-6); no approved requirements or proposals (B-7); internship content (B-1); ownership (B-2); privacy, data responsibility and the form-field review (B-3); technology decision (B-8); exact approved form ID (B-9).
**Blocking release and QR printing:** security-header policy (B-11), which must be decided before the host; hosting and permanent domain (B-4); verified form access (B-5); deadline business rule, its enforcement and the closure procedure (B-10); and, only if an automatic close is chosen, the security review of that mechanism (B-12). See D-09.

---

# D-01 — Design Brief

### 1.1 Problem statement
Students at a busy career fair have seconds of attention and a phone. They need to learn what the internship is, check that they fit, and reach the registration form, without hunting, signing up for anything new, or waiting on slow pages. (Source: brief §1, BR-01 to BR-06.)

### 1.2 Design goals (measurable): [DESIGN] DP-01, PROPOSED pending DEC-002
| ID | Goal | Measure |
|---|---|---|
| G-1 | Understand the opportunity at a glance | Program name, one-line value proposition, registration status, and the Register CTA are visible in the first viewport at 360×640 without scrolling |
| G-2 | Register in one tap from anywhere | A Register CTA is visible or one tap away at every scroll position on mobile. Relies on DP-03 (sticky bar); if DEC-009 rejects it, G-2 becomes "a Register CTA in the hero, in every expanded role, and in How to apply" |
| G-3 | Fast on fair networks | FCP ≤ 1.8 s and LCP ≤ 2.5 s (Lighthouse mobile, default Slow 4G throttling, median of 5 runs); initial page weight ≤ 150 KB, measured as defined in §7.9 |
| G-4 | Inclusive | WCAG 2.2 AA conformance for all designed elements |
| G-5 | Low maintenance | Common updates (form URL, status, roles, contact) are edits to one content file, with build-time validation |

### 1.3 Design principles
1. **Information before decoration.** Text renders first; images are optional enhancements.
2. **One primary action.** "Register" is the only filled-button style on the page.
3. **Show, don't hide.** All roles are visible as a list; details expand in place.
4. **Truthful content.** Only show fields the content owner has verified. Empty fields are omitted, never padded.
5. **Boring technology.** Static HTML, no runtime dependencies, no third-party scripts.
6. **Replaceable brand layer.** All visual identity lives in design tokens.

### 1.4 Constraints
- Google Forms is the registration system (BR-05).
- No backend, database, auth, paid API, or applicant management (BR-11).
- No invented branding (BR-07) or content (BR-12).
- Free hosting expected [PROPOSED — from brief §11, "free-hosting requirements"; confirm under DEC-006].

### 1.5 Exclusions (explicitly out of scope)
Custom registration form; form embedding; applicant accounts; application status tracking; CMS; chatbot; maps; multilingual support (unless requested, OD-12); completed-registration analytics; offline mode / service worker.

---

# D-02 — User Journey and Interaction Specification

### 2.1 Primary journey (BR-01 to BR-04, BR-06)

```
[QR poster/flyer] --scan--> [Phone camera / scanner app]
        |
        v
(1) Page loads: Hero visible in first viewport
    - Program name, value proposition, status badge ("Registration open")
    - [Register now]  (primary)   [See open roles ↓] (secondary)
        |                               |
        | (ready)                       v
        |                     (2) Role list (cards): title, team, summary, setup
        |                               |  tap "View details"
        |                               v
        |                     (3) Card expands in place: responsibilities,
        |                         required / preferred qualifications,
        |                         [Register for <Role>]
        |                               |
        |<------------------------------+
        v
(4) [PROPOSED DP-03] Sticky bottom bar on mobile keeps [Register now] reachable
        |
        v
(5) Tap Register  ->  same tab navigates to Google Forms URL
        |
        v
(6) Student completes the form on Google (fields, validation: Google's)
        |
        v
(7) Google's confirmation page (whatever the form owner configured)
    Back usually returns to the website (browser behaviour, not verified;
    after a submission more than one Back may be needed)
```

Shortest path: **scan → Register now → form** (2 taps, counting the scan). No splash, interstitial, or modal sits between the page and the form.

### 2.2 Alternative flows

| ID | Scenario | Designed behaviour |
|---|---|---|
| AF-1 | Opened directly (typed URL, shared link, search) | Identical page; nothing depends on QR parameters. Optional `?src=qr` tagging only if analytics is approved (OD-08) |
| AF-2 | Unsure whether they qualify | An "Not sure if you qualify?" callout in the Eligibility section gives the eligibility rule in plain words and a contact link. Copy is [NEEDED] from the content owner; whether to encourage borderline applicants is a policy decision (OD-11) |
| AF-3 | Wants a specific role | Each expanded card has its own Register button. If the form has a role question and the owner approves, the button may use a Google Forms prefill link to preselect the role [PROPOSED, OD-09]. Otherwise all buttons use the same URL |
| AF-4 | Wants to contact the organizer | Contact section (email via `mailto:`, plus booth location if supplied) linked from the footer and from the help text under the CTA |
| AF-5 | Keyboard / assistive technology | Skip link → main; logical heading order; native disclosure for role details; every CTA is a real link with a unique accessible name (see D-05 §5.10) |
| AF-6 | Desktop visitor (e.g. booth screen or later at home) | Same content in a wider layout; header CTA replaces the sticky bar; optional "Scan to open on your phone" QR in the hero aside (OD-10) |

### 2.3 Error and failure states

| ID | Failure | Can the site detect it? | Designed behaviour | Operational control |
|---|---|---|---|---|
| FS-1 | Registration closed | Yes, via the content flag `registration.status = closed` | The status badge reads "Registration closed"; every Register CTA is **removed** (not shown disabled) and replaced by the configured closed message and a contact link; the sticky bar is hidden; the role list stays readable | Closure follows the procedure in §7.10. At the time set by the DEC-010 deadline rule, the operator (or backup) **switches the form off first**, then changes the site status and verifies both. Closing the form first stops new submissions as soon as the switch takes effect, whatever the deploy or cache timing, and until the site updates students who tap Register see Google's closed-form message and the help line. It does **not** make the cutoff exact: responses received during the switch-off interval are handled by the deadline rule (§7.10). Before the deadline the badge shows "open until {closesAt}". The build rule for a past `closesAt` (§7.4, DP-12) only prevents redeploying a stale "open" page; **it does not close a deployed site** |
| FS-2 | Not yet open [PROPOSED, DP-02] | Yes, via `status = upcoming` + `opensAt` | Badge "Registration opens {date}"; CTAs replaced by an "Opens {date}" notice | Same |
| FS-3 | Form URL outdated, deleted, or no longer accepting responses | **No.** It's cross-origin, so the site cannot check it without a backend (excluded) | The help line under every primary CTA reads: "Trouble opening the form? Email {contact}". The form itself shows Google's "no longer accepting responses" page if closed there | Pre-event link check (D-08 DAC-30); the owner keeps the site status in sync with the form's "Accepting responses" toggle |
| FS-4 | Form requires Google sign-in or is restricted to an organization domain | No | If verified that sign-in is required: help text "You'll be asked to sign in with a Google account." If restricted to a domain: **blocker**, because external students would be locked out (R-02) | Verify the form with the authorized end-to-end test (DAC-30) before printing QR codes (B-5, DEC-007) |
| FS-5 | Poor connectivity | Partly (the browser shows its own error) | HTML-first page under 150 KB; content readable before images load; no blocking loaders; images have reserved aspect ratios (no layout shift); text explains the form needs a connection | Booth staff carry printed short URL and form link; check venue Wi-Fi beforehand |
| FS-6 | JavaScript blocked or failing | n/a | All content, disclosures (native `<details>`), and links work without JavaScript; only the sticky-bar show/hide behaviour (DP-03, if approved) is enhanced by JavaScript; without it the bar stays visible whenever its CSS conditions hold (§2.5) | — |
| FS-7 | Opened in an in-app browser (scanner app, social app) | No | Same-tab navigation (no pop-ups). Help line: "If the form doesn't open, open this page in your browser: {short URL}" | Test on common scanner and social in-app browsers (DAC-33) |
| FS-8 | Unknown path / old link | Yes (static 404) | Branded 404 page with "Go to internship page" and the Register CTA (respecting status) | — |
| FS-9 | Stale cached page after a content change | n/a | HTML served with short cache lifetime and revalidation; hashed static assets cached long-term | Host cache headers (D-07 §7.9) |

### 2.4 Registration transition spec (BR-04, BR-05)

| Aspect | Spec |
|---|---|
| Element | A native link (`<a href>`) styled as a button, not a `<button>` with script |
| Target | The configured `registration.url`, which must match the exact approved form ID (DP-11, DEC-012, §7.4) |
| What URL validation does **not** prove | Pinning the form ID prevents accidental or malicious substitution. It does **not** show that the form is reachable, publicly accessible, or accepting responses. Those are verified separately by the authorized end-to-end test (DAC-30, B-5) |
| Tab behaviour | **Same tab** (no `target="_blank"`) [PROPOSED, DP-04]; rationale in §2.5 |
| Pre-transition copy | The text near the CTA sets expectations: "Registration takes place on Google Forms." Plus, only if verified, "about N minutes" and "Have your {documents} ready" |
| Link label | Visible: "Register now". Accessible name includes the destination: "Register now on Google Forms" (the visible label starts the accessible name, satisfying WCAG 2.5.3 Label in Name) |
| Icon | An "external" arrow icon after the label, `aria-hidden` (the destination is already in the accessible name) |
| Interstitial / confirmation modal | **None** — it would add a step and break the one-tap goal |
| After submission | Google's confirmation page. The website makes no claims about what that page shows; its content is owned by the form owner |
| Return | Browser Back normally returns to the site (not verified after a submission) |

### 2.5 UX decisions and trade-offs

**Same tab vs new tab**

| Option | Pros | Cons |
|---|---|---|
| **Same tab (recommended)** | Predictable on mobile; works in in-app browsers; no pop-up blocking; Back returns; one task at a time; no surprise tab sprawl for screen-reader users | On desktop the student leaves the site (mitigated by Back) |
| New tab | The site stays open on desktop | On mobile, tab switching is confusing; some in-app browsers handle `_blank` poorly; needs a "(opens in new tab)" warning; the student may lose track of the form |

Recommendation: use the same tab on all devices for consistency. Registration is the end of the journey, so there's no need to keep the site open.

**Link out vs embed**

| Option | Pros | Cons |
|---|---|---|
| **External link (recommended)** | Google handles sign-in, validation, file uploads, and confirmation natively; full-screen form on mobile; no iframe height or scroll issues; nothing new to maintain | The student leaves the site |
| Embed (iframe) | Feels "in-site" | Nested scrolling on mobile; fixed iframe height; sign-in and file-upload flows break or bounce out anyway; heavier page; harder to communicate errors |

The brief says not to embed automatically. Nothing in the requirements justifies embedding, so: **link out.**

**Sticky mobile CTA bar: [PROPOSED, DP-03], conditional on DEC-009**

Pros: supports G-2. Cons: takes about 72 px (≈13% of a 568-px-tall viewport, ≈22% in 320-px landscape), interacts with mobile browser toolbars, and can hide the element that has keyboard focus.

Conditions if adopted:
- **Visibility:** viewport width < 1024 px **and** viewport height ≥ 500 CSS px (a CSS media query, so it works without JavaScript) **and** `status = open`. With JavaScript, additionally hidden while the hero CTA is in view and while the footer intersects the viewport.
- **Focus not obscured (WCAG 2.2 SC 2.4.11):** the page sets `scroll-padding-bottom` equal to the bar height, so a focused element scrolled into view is never hidden behind the bar. Bottom padding equal to the bar height is also kept so the last content stays reachable.
- **Layout:** single row; the program short name truncates with an ellipsis; the button never wraps; respects `safe-area-inset-bottom`; no other controls.
- **Evidence required for DEC-009 (method defined in v0.3, IV-03):**
  - *Participants:* at least 5 people from the target audience, on real iOS and Android phones. Include at least one person who uses large text or screen magnification, if one can be recruited.
  - *Task:* "Starting from the page the QR code opens, find a role that fits [a profile you are given] and get to the registration form." Use the approved content, or a realistic fixture with the same number of roles.
  - *Design:* within-subjects. Each participant does the task on both variants (with the bar and without it), with the order alternated between participants. Both runs in portrait; then one variant repeated in landscape at 200% text.
  - *Measures:* success (reached the form without help: yes or no); time from page load to the form loading, taken from the screen recording; obstruction reports from a post-task question ("Did anything on the screen get in your way?").
  - *Decision rule for "no worse":* keep the bar only if (a) successes with the bar ≥ successes without it, (b) the median time with the bar is no more than 10% longer than without, (c) no participant reports the bar covering content, and (d) DAC-49 passes.
  - *Limits:* this is formative usability evidence for one design choice. It is **not** evidence of accessibility conformance, which comes from DAC-40 – DAC-49.

  If the bar is rejected, DP-03 is removed, G-2 is restated (§1.2), and DAC-27 and DAC-49 become N/A.

---

# D-03 — Information Architecture

### 3.1 Structure options vs opportunity model

| Option | Best when | Cost |
|---|---|---|
| A. Single landing page, no cards | **1 role** (or one general program) | Lowest |
| **B. Single page + expandable role cards** | **2–8 roles** | Low (no routing) |
| C. Landing + role detail pages / routes | More than 8 roles, or each role has long content worth deep-linking and sharing | Medium (routing, more pages to maintain) |

**Recommendation [PROPOSED, DP-05; the thresholds are hypotheses to confirm under DEC-011 once DEC-003 gives the real role count]:** build **Option B** with **adaptive rendering**:
- 1 role → render its details inline (Option A behaviour, no card chrome).
- 2–8 roles → card list with in-place details.
- More than 8 roles → add department filter chips above the list (D-06 `RoleFilter`). Search stays out of scope until there are more than 20 roles.

Why: the role count is unknown (P-2). This design covers the likely range without a structural change. Filters and search are not justified for a few roles: they add controls to scan and states to test, and save almost nothing when the full list fits in two or three screens.

Each role section gets a stable anchor (`#role-{slug}`) so a specific role can be shared or put on a role-specific QR later without new pages.

### 3.2 Page hierarchy (single page)

```
/ (index)
├── Skip link → #main
├── Header (logo/wordmark · [desktop: in-page links + Register])
└── main#main
    ├── 1  Hero                        (always)
    ├── 2  Program overview            (if content supplied)
    ├── 3  Open roles                  (always; adapts to role count)
    ├── 4  Eligibility & requirements  (always — BR-03)
    ├── 5  How to apply                (always)
    ├── 6  FAQ                         (only if ≥ 3 approved Q&As)
    ├── 7  Contact                     (always — AF-4)
    └── 8  Privacy notice              (always — P-5)
├── Footer (org name · privacy anchor · contact · "Last updated {date}")
├── Sticky register bar (PROPOSED DP-03; mobile only, status = open)
/404
```

### 3.3 Section responsibilities

| # | Section | Responsibility | Required? | Traces to |
|---|---|---|---|---|
| — | Header | Identify the organization; desktop navigation and CTA | Yes | BR-07 |
| 1 | Hero | What it is, who it's for, status, primary CTA | Yes | BR-01, BR-04, G-1 |
| 2 | Program overview | Program-wide facts: duration, setup, benefits (verified only) | Conditional | BR-01 |
| 3 | Open roles | Discover and compare roles; role details; role CTA | Yes | BR-02, BR-03 |
| 4 | Eligibility & requirements | Who can apply; what to prepare; "not sure?" help | Yes | BR-03, AF-2 |
| 5 | How to apply | 3 steps and what happens after submitting (only if the owner confirms the next steps) | Yes | BR-04 |
| 6 | FAQ | Reduce booth questions | Conditional | BR-08 |
| 7 | Contact | Fallback channel | Yes | AF-4, FS-3 |
| 8 | Privacy notice | Who gets applicant data and why; points to the form owner | Yes | P-5, BR-09 |
| — | Footer | Legal / ownership, freshness date | Yes | BR-10 |

### 3.4 Navigation model
- **Mobile:** no hamburger menu. The page is linear and short; a menu would add a tap, a JavaScript state, and a focus-trap problem for little benefit. Navigation comes from the hero's secondary link ("See open roles"). Registration is reached from the hero, the role cards, How to apply, and (if DP-03 is approved) the sticky bar.
- **Tablet and up (≥ 768 px):** header shows up to four in-page links: Roles · Requirements · How to apply · Contact, plus a Register button when status is open [PROPOSED, DP-15].
- Header is **not sticky** on mobile (saves vertical space; the sticky bar covers the CTA). On desktop the header is static too, which keeps behaviour simple and consistent.
- In-page links use smooth scrolling only when the user does not prefer reduced motion; target sections get `scroll-margin-top`.

---

# D-04 — Wireframe Specification

### 4.1 Mobile (360 × 640 reference; must work at 320 px)

```
┌────────────────────────────────┐
│ [Logo / Org name]              │  Header 56px, not sticky
├────────────────────────────────┤
│ ● Registration open until {d}  │  Status badge (success tone)
│                                │
│ {Program name} Internship      │  H1, 30px/36px
│ Program {Year}                 │
│                                │
│ {One-sentence value prop for   │  Lead, 18px
│  students, ≤ 160 chars}        │
│                                │
│ ┌────────────────────────────┐ │
│ │      Register now  ↗       │ │  Primary, full width, 48px+
│ └────────────────────────────┘ │
│ Registration takes place on    │  Help, 14px muted
│ Google Forms. Trouble? Email us│
│                                │
│  See open roles ↓              │  Secondary text link
│ ─────────────────────────────  │  ← first viewport ends ≈ here
│ ┌─────────┬─────────┐          │  Key facts (2×2), only verified:
│ │Duration │ Setup   │          │  e.g. Duration · Setup ·
│ │{x} wks  │{Hybrid} │          │  Deadline · Allowance
│ ├─────────┼─────────┤          │
│ │Deadline │ {…}     │          │
│ └─────────┴─────────┘          │
├────────────────────────────────┤
│ About the program (H2)         │
│ {2–4 short paragraphs/bullets} │
├────────────────────────────────┤
│ Open roles (H2)  · {n} roles   │
│ ┌────────────────────────────┐ │
│ │ {Role title}          (H3) │ │  RoleCard
│ │ {Department} · {Setup}     │ │
│ │ {1–2 line summary}         │ │
│ │ [View details ▾]           │ │  native disclosure, 48px row
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │  Expanded state:
│ │ {Role title}               │ │
│ │ ...                        │ │
│ │ [Hide details ▴]           │ │
│ │ What you'll do (H4)        │ │
│ │ • …                        │ │
│ │ Must have (H4)             │ │
│ │ • …                        │ │
│ │ Nice to have (H4)          │ │
│ │ • …                        │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ Register for this role↗│ │ │  primary, full width
│ │ └────────────────────────┘ │ │
│ └────────────────────────────┘ │
├────────────────────────────────┤
│ Who can apply (H2)             │
│ • {eligibility bullets}        │
│ What to prepare (H3)           │
│ • {documents}                  │
│ ┌ Not sure if you qualify? ──┐ │  Info callout
│ │ {guidance} Contact us →    │ │
│ └────────────────────────────┘ │
├────────────────────────────────┤
│ How to apply (H2)              │
│ ① Choose a role                │
│ ② Register on Google Forms     │
│ ③ {What happens next}          │
│ [Register now ↗]               │
├────────────────────────────────┤
│ FAQ (H2)  ▸ Q1  ▸ Q2  ▸ Q3     │  conditional
├────────────────────────────────┤
│ Contact (H2)                   │
│ ✉ {email}   📍 {booth/venue}    │
├────────────────────────────────┤
│ Your privacy (H2)              │
│ {3–5 sentence notice}          │
├────────────────────────────────┤
│ Footer: © {Org} · Last updated │
│ {date} · Privacy · Contact     │
└────────────────────────────────┘
┌────────────────────────────────┐  Sticky bar, PROPOSED DP-03 (after hero CTA
│ {Program} · [ Register now ↗ ] │  leaves viewport; hidden
└────────────────────────────────┘  near footer / when closed)
```

### 4.2 Tablet (768–1023 px)
- Container 720 px, 24 px gutters.
- Header shows in-page links + Register.
- Hero: single column; CTA auto width (min 240 px); key facts in one row of 4.
- Roles: **2-column card grid**. An expanded card spans both columns (`grid-column: 1 / -1`) so details stay readable. Expanding a card moves it onto its own full-width row, the cards after it reflow below, and focus stays on the card's summary. In browsers without CSS `:has()` support, the card expands within its own column instead (still readable, no JavaScript needed).
- Sticky bar (if DP-03 is approved): shown below 1024 px when the viewport is at least 500 px tall.

### 4.3 Desktop (≥ 1024 px)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]          Roles  Requirements  How to apply  Contact [Register ↗] │
├──────────────────────────────────────────────────────────────────┤
│ ● Registration open until {d}            ┌──────────────────────┐ │
│ {Program} Internship Program {Year}      │ Key facts card       │ │
│ {Value proposition}                      │ Duration · Setup ·   │ │
│ [Register now ↗]  See open roles ↓       │ Deadline · …         │ │
│ Registration takes place on Google Forms │ [optional QR: "Scan  │ │
│                                          │  to open on phone"]  │ │
│        (7 / 12 columns)                  └──────(5 / 12)────────┘ │
├──────────────────────────────────────────────────────────────────┤
│ Open roles · {n}                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   3-col grid; expanded   │
│ │ RoleCard │ │ RoleCard │ │ RoleCard │   card spans full row    │
│ └──────────┘ └──────────┘ └──────────┘                           │
├──────────────────────────────────────────────────────────────────┤
│ Who can apply (prose ≤ 68ch)  │  How to apply (steps)            │
├──────────────────────────────────────────────────────────────────┤
│ FAQ · Contact · Privacy (stacked, prose width)                   │
└──────────────────────────────────────────────────────────────────┘
```
- Container max 1120 px; prose blocks max 68ch.
- No sticky bar (the header CTA and in-section CTAs are visible).

### 4.4 Primary action placement summary

| Location | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero | Full-width primary | Auto-width primary | Auto-width primary |
| Header (DP-15) | — | Small primary | Small primary |
| Each expanded role (DP-15) | Full-width primary ("Register for this role") | same | same |
| How to apply (DP-15) | Primary | Primary | Primary |
| Sticky bar (DP-03, DEC-009) | Conditional | Conditional | — |
| 404 page (DP-15) | Primary | Primary | Primary |

All of them respect `registration.status` (FS-1, FS-2). Only the hero CTA traces directly to BR-04; every other placement is a proposal (DP-15).

### 4.5 Imagery placement
Optional. If approved photos exist: one landscape image (16:9) below the hero text on mobile, or in the hero aside on desktop. `loading="lazy"` below the fold; `fetchpriority` must never be raised above the H1. **The hero must be complete and usable with no image.**

---

# D-05 — Visual Design System

> **[PROPOSED, DP-07: provisional brand direction].** No official logo, colours, or typography were provided. Everything below is a neutral placeholder implemented as tokens, to be replaced by official brand values (OD-05). Replacement must re-run the contrast checks in §5.2.

### 5.1 Brand direction
"Trustworthy, clear, student-friendly." A calm navy/blue palette, generous white space, plain language, no stock-photo clichés, no gradients behind text, no decorative motion.

### 5.2 Colour tokens (contrast verified against WCAG 2.x formula)

| Token | Hex | Use | Contrast (measured) |
|---|---|---|---|
| `--color-ink` | `#0F172A` | Headings, body on white | 17.85:1 on #FFF |
| `--color-text` | `#334155` | Body text | 10.35:1 on #FFF |
| `--color-text-muted` | `#475569` | Help text, meta | 7.58:1 on #FFF; 7.24:1 on surface |
| `--color-text-subtle` | `#64748B` | Non-essential meta only (≥ 14px) | 4.76:1 on #FFF |
| `--color-bg` | `#FFFFFF` | Page | — |
| `--color-surface` | `#F8FAFC` | Alternating sections, cards | — |
| `--color-border` | `#CBD5E1` | Decorative dividers / card borders (not for meaning) | 1.48:1 (decorative only) |
| `--color-primary` | `#1D4ED8` | Primary button fill, links, focus ring | 6.70:1 white-on-primary; 6.41:1 on surface |
| `--color-primary-hover` | `#1E40AF` | Hover / active | 8.72:1 white-on |
| `--color-primary-tint` | `#EFF6FF` | Info callout background | primary text 6.16:1 |
| `--color-success-fg / bg` | `#166534` / `#DCFCE7` | "Registration open" badge | 6.49:1 |
| `--color-warning-fg / bg` | `#92400E` / `#FEF3C7` | "Opens soon" badge | 6.37:1 |
| `--color-danger-fg / bg` | `#991B1B` / `#FEE2E2` | "Registration closed" badge | 6.80:1 |
| `--color-inverse-bg` | `#0F172A` | Footer | white 17.85:1; `#BFDBFE` links 12.56:1 |

Rules: status is never conveyed by colour alone (the badge always has text plus an icon). `#94A3B8` and lighter are **banned for text** (2.56:1 fails).

Dark mode: **not in scope** [PROPOSED]. It's a single-use event page; a second theme doubles the contrast QA. The tokens make it a cheap addition later.

### 5.3 Typography
- **Family:** system UI stack — `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Trade-off: zero font download and instant render, versus less brand distinctiveness. If official branding specifies a typeface, self-host **one** variable WOFF2 subset (≤ 40 KB) with `font-display: swap`.
- **Scale (major third, 1.25)** — mobile / desktop:

| Token | Mobile | ≥ 1024px | Line height | Weight | Use |
|---|---|---|---|---|---|
| `--text-display` | 30px | 44px | 1.15 | 700 | H1 |
| `--text-h2` | 24px | 30px | 1.25 | 700 | Section titles |
| `--text-h3` | 20px | 22px | 1.3 | 600 | Role titles |
| `--text-h4` | 16px | 16px | 1.4 | 600 | Sub-lists in role details |
| `--text-lead` | 18px | 20px | 1.55 | 400 | Hero summary |
| `--text-body` | 16px | 17px | 1.6 | 400 | Body |
| `--text-small` | 14px | 14px | 1.5 | 400 | Help, meta |
| `--text-label` | 13px | 13px | 1.4 | 600 | Badges, tags (sentence case) |

- Minimum text size 13px (badges only); body never below 16px (also prevents iOS zoom-on-focus).
- **No all-caps for anything longer than 2 words**; no letter-spacing above 0.02em. (This corrects the reference's legibility issue.)
- Sizes in `rem` so text respects user font settings and scales to 200%.

### 5.4 Spacing (4px base)
`--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64 · `--space-9` 96.
Section vertical padding: 48px mobile / 64px tablet / 96px desktop. Card padding 16px mobile / 24px ≥ 768px. List item gap 8px.

### 5.5 Layout, grid, content width

| Breakpoint | Min width | Columns | Gutter | Container | Side padding |
|---|---|---|---|---|---|
| base | 0 | 4 | 16px | 100% | 16px |
| `sm` | 640px | 4 | 16px | 100% | 24px |
| `md` | 768px | 8 | 24px | 720px | 24px |
| `lg` | 1024px | 12 | 24px | 960px | 32px |
| `xl` | 1280px | 12 | 32px | 1120px | 32px |

Prose max width 68ch. Minimum supported width 320px with no horizontal scroll (WCAG 1.4.10 Reflow).

### 5.6 Borders, radius, elevation
- Radius: `--radius-sm` 4px (badges, tags) · `--radius-md` 8px (buttons, cards, callouts) · `--radius-full` (status dot only).
- Border: 1px `--color-border` on cards.
- Elevation: `--shadow-1` `0 1px 2px rgb(15 23 42 / 0.06)` on cards; `--shadow-2` `0 -2px 8px rgb(15 23 42 / 0.10)` on the sticky bar only. No other shadows.

### 5.7 Buttons and links

| Variant | Spec | States |
|---|---|---|
| **Primary** (Register only) | Fill `--color-primary`, white 16px/600 text, radius 8, min-height 48px, padding 12×24; full width below 640px | Hover/active: `--color-primary-hover`; focus: 3px outline `--color-primary` + 2px white offset; no disabled state (closed = removed, FS-1) |
| **Secondary** | Text link with chevron ("See open roles ↓"), primary colour, underline on hover/focus; 48px tap height | Visited same as default |
| **Disclosure** (`View details`) | Full-width row inside the card, 48px tall, chevron rotates 180° (instant if reduced motion) | `aria-expanded` is native via `<details>/<summary>` |
| **Inline link** | Primary colour, **always underlined** in body text (not colour alone) | Focus ring as above |

Only Register uses the filled style, so the primary action is never ambiguous.

### 5.8 Cards and panels
- **RoleCard:** surface white, 1px border, radius 8, shadow-1, padding 16/24. Order: title (H3) → meta line (department · setup · location, 14px muted) → summary (max 2 lines collapsed; full when expanded) → disclosure row → details → role CTA.
- **KeyFacts:** 2×2 grid on mobile, 1×4 on tablet, vertical list in the hero aside on desktop. Label 13px muted above a 16px/600 value. Render only facts with verified values; if fewer than 2, hide the block.
- **Callout (info):** `--color-primary-tint` background, 4px left border in primary, icon + text.
- **StatusBadge:** pill, 13px/600, icon + text, tone by status.

### 5.9 Icons and imagery
- Icons: one outline set, inlined as SVG (e.g. Lucide, MIT licence) — only the ~8 icons used: arrow-up-right, chevron-down, arrow-down, mail, map-pin, info, check-circle, clock. 20px, `currentColor`, `aria-hidden="true"` unless the icon is the only content (it never is in this design).
- Photos: only organization-owned or licensed, approved images of real people and workplaces (OD-05). Max 1600px wide, AVIF/WebP with JPEG fallback, ≤ 120 KB each, explicit `width`/`height`. No text baked into images. Decorative images get `alt=""`; informative ones get descriptive alt text.
- Logo: SVG supplied by the organization. **Until then, render the organization name as a text wordmark — never a made-up logo.**
- Favicon / social share image: derived from the official logo once supplied (OD-05).

### 5.10 Accessibility rules embedded in the system
- Focus: always visible, 3px, ≥ 3:1 against adjacent colours; never removed; never hidden behind fixed elements (WCAG 2.2 SC 2.4.11; see the sticky-bar conditions in §2.5).
- Touch targets ≥ 48×48 px for buttons, disclosures, navigation and standalone links (exceeds WCAG 2.5.8's 24px minimum). Links inside running text are exempt (WCAG 2.5.8 inline exception).
- Accessible names (WCAG 2.5.3 Label in Name; corrected in v0.2, DEF-006): every Register CTA's accessible name **begins with its visible label**. Role CTAs show "Register for this role" and are named "Register for this role: {Role title}, on Google Forms" (the suffix is visually hidden text after the visible text), so each role CTA is unique. Same-destination CTAs (hero, header, How to apply, sticky bar) share the name "Register now on Google Forms"; WCAG 2.4.4 allows identical names for links with the same purpose.
- Disclosure summaries: visible "View details" followed by visually hidden " for {Role title}".
- Motion: only 150 ms colour/opacity transitions and the chevron rotation; all disabled under `prefers-reduced-motion: reduce`. No auto-playing carousels or video.
- Language attribute set on `<html>` (OD-12 for language).

---

# D-06 — Component Specification

Conceptual responsibilities only (no code). "Content" refers to fields of the content model in D-07 §7.4.

| Component | Responsibility | Inputs (content) | States / variants | A11y notes |
|---|---|---|---|---|
| `BaseLayout` | Document shell: `<html lang>`, meta, title, description, Open Graph, skip link, header, main, footer | `site.*` | — | One `<main>`; landmarks: header, main, footer |
| `SkipLink` | Jump to `#main` | — | Hidden until focused | First focusable element |
| `SiteHeader` | Wordmark/logo; desktop nav; desktop Register (PROPOSED, DP-15) | `organization`, `registration` | ≥ 768px: nav + CTA; < 768px: logo only | Nav in `<nav aria-label="Page sections">` |
| `Hero` | H1, lead, status, CTAs, help line, key facts | `program`, `registration`, `contact` | open / upcoming / closed | Single H1 on the page |
| `StatusBadge` | Shows registration state | `registration.status`, dates | open (success), upcoming (warning), closed (danger) | Text + icon, not colour alone |
| `RegisterLink` | **The single source of every registration CTA**: reads `registration.url` and `status`; renders a link, a closed message, or nothing | `registration`, optional `role` (for prefill and accessible name), `size` (`lg` / `md` / `sm`), `fullWidthOnMobile` | open → link; upcoming / closed → notice text (or nothing, per placement) | Accessible name begins with the visible label and includes "on Google Forms"; role CTAs add the role title (§5.10); external icon `aria-hidden`; `href` equals the validated `registration.url` (DEC-012) |
| `RegisterHelp` | "Registration takes place on Google Forms. Trouble? Email {contact}." Optional verified sign-in / time notes | `registration.notes`, `contact.email` | — | Linked to the CTA via proximity (no `aria-describedby` needed) |
| `KeyFacts` | Program-level facts grid | `program.facts[]` | Hidden if fewer than 2 facts | `<dl>` semantics |
| `ProgramOverview` | Short "about" content | `program.overview` | Hidden if empty | H2 |
| `RoleList` | Chooses the rendering mode by role count; shows the count | `roles[]` (published only, ordered) | 0 → "No internship roles are currently listed. Contact {approved contact} for information." (a forward-looking variant only if the program lead approves its exact wording in the content sheet) (and CTA hidden if status ≠ open); 1 → inline details; 2–8 → cards; > 8 → cards + `RoleFilter` | H2 with count text "{n} open roles" |
| `RoleCard` | Summary + disclosure + details + role CTA | `role` | collapsed / expanded; expanded spans the full grid row | `<article>` with H3; `<details>/<summary>`: visible "View details" plus visually hidden " for {Role title}" (§5.10) |
| `RoleDetails` | Responsibilities, required and preferred qualifications | `role.*` lists | Lists omitted if empty | H4s, `<ul>` |
| `RoleFilter` (only if > 8 roles) | Filter chips by department | derived departments | All (default) / one selected | Button group with `aria-pressed`; result count announced via a polite live region; without JavaScript, all roles are shown |
| `EligibilitySection` | Program-wide eligibility, documents to prepare, "Not sure?" callout | `eligibility.*` | Callout hidden if no copy | H2 / H3 |
| `ApplySteps` | 3-step ordered list + CTA | `apply.steps[]` | — | `<ol>` |
| `FaqList` | Q&A | `faq[]` | Hidden if fewer than 3 items | `<details>` per item; H2 for the section |
| `ContactPanel` | Email, optional phone, booth/venue | `contact.*` | — | `mailto:` link text shows the address |
| `PrivacyNotice` | Short notice + link to the form owner's full policy if one exists | `privacy.*` | **Required; BUILD fails if missing** | H2 |
| `SiteFooter` | Org name, © year, last updated, anchors | `organization`, `site.lastUpdated` | — | `<footer>` |
| `StickyRegisterBar` | Mobile persistent CTA | `program.shortName`, `registration` | **[PROPOSED DP-03, DEC-009].** Visibility rules in §2.5: width < 1024 px, height ≥ 500 px, status open; with JavaScript, also hero CTA out of view and footer not intersecting. Without JavaScript: visible whenever the CSS conditions hold | Not a dialog; doesn't trap focus; positioned last in DOM order so reading order is unaffected; page bottom padding equals bar height so it never hides content; `scroll-padding-bottom` equals bar height so focus is never obscured (WCAG 2.4.11) |
| `NotFoundPage` | 404 recovery | `registration` | — | H1 "Page not found" |
| `QrPanel` (optional, OD-10) | Desktop "Scan to open on your phone" | site URL | Desktop only | QR image with alt "QR code linking to {short URL}" and the URL printed as text |

**Hierarchy**

```
BaseLayout
├── SkipLink
├── SiteHeader ─ RegisterLink(sm)
├── main
│   ├── Hero ─ StatusBadge · RegisterLink(lg) · RegisterHelp · KeyFacts · [QrPanel]
│   ├── ProgramOverview
│   ├── RoleList ─ [RoleFilter] · RoleCard* ─ RoleDetails · RegisterLink(md, role)
│   ├── EligibilitySection ─ Callout
│   ├── ApplySteps ─ RegisterLink(md)
│   ├── FaqList
│   ├── ContactPanel
│   └── PrivacyNotice
├── SiteFooter
└── StickyRegisterBar ─ RegisterLink(md)
```

---

# D-07 — Technical Design

### 7.1 Architecture options

| Criterion | **A. Astro (static output)** | B. Vite + React SPA (as in the reference) | C. Hand-written HTML/CSS | D. Google Sites |
|---|---|---|---|---|
| Works without JavaScript | Yes (HTML-first) | No, unless prerendering is added | Yes | Yes |
| Mobile performance | Excellent (no client JavaScript by default) | Good with care (adds a client runtime; size to be measured, as v0.1's estimate was unverified) | Excellent | Not verified |
| Content in one validated file | Yes (content collections + schema) | Possible (typed data file) | No, unless a templating or build step is added (content mixed with markup) | WYSIWYG |
| Maintainability by organizers | Edit JSON/Markdown → PR → auto-deploy | Edit a TS/JSON data file → PR | Edit HTML (error-prone) | Easiest editing, least control |
| Maintainer skills | **[NEEDED, DEC-004]**. v0.1 inferred familiarity from the reference repo; that inference is removed because the reference belongs to a different GitHub account and nothing links the two teams | [NEEDED] | [NEEDED] | — |
| Design-system fidelity / accessibility control | Full | Full | Full | Likely limited for custom CTA states and status logic (not verified) |
| Free HTTPS hosting, rollback | Any host meeting §7.10 (custom response headers required) | Same | Same | Google |
| Risk | Low | Low–medium (accidental runtime weight) | Content drift, duplication of the URL across CTAs | Org Workspace policy; brand limits |

**Status: UNRESOLVED, DEC-008 (owner: technical lead / maintainer).** Provisional leaning: **Option A, Astro static output**, styled with plain CSS custom properties in one `tokens.css` file. v0.1's Tailwind recommendation is withdrawn: nothing in D-05 needs a utility framework, though the maintainer may still choose one in the ADR. Client JavaScript is limited to one small external script, for the StickyRegisterBar (only if DP-03 is approved) and the RoleFilter (only above 8 roles).

Why this is only a leaning: the page needs almost no client-side interaction, which favours an HTML-first generator. But the deciding inputs are not yet known: who maintains the site and their skills (DEC-004), who edits content and how (OD-14), and which host IT allows (DEC-006).

Vite + React is acceptable **only** with build-time prerendering to static HTML, the same budgets and content model, and none of the reference's animation, map, AI or Express dependencies. Plain HTML (Option C) is acceptable with a small templating or build step so the form URL is defined once.

**ADR stub for DEC-008 (to be completed by the decision owner):**

| Criterion | Weight (to set) | A. Astro | B. Vite + React + prerender | C. Plain HTML + build step |
|---|---|---|---|---|
| Works without JavaScript | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Initial page weight against the §7.9 budget (measured on a prototype) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Content schema validation (form ID, privacy notice, required fields) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Maintainer skills (DEC-004) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Content-editor workflow (OD-14) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Host compatibility, including custom headers (DEC-006) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Keeps CSS and JS external so the strict CSP holds (§7.8) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |
| Long-term upkeep (dependency count, upgrade cadence) | [NEEDED] | [NEEDED] | [NEEDED] | [NEEDED] |

The decision, date, approver, and the rejected options with reasons are recorded in `docs/design/` (§7.6).

### 7.2 System context and integration boundaries

```
 ┌───────────────┐     scan      ┌──────────────────────────────┐
 │ Printed QR    │──────────────▶│ Static site (CDN, HTTPS)     │
 │ (site URL)    │               │  - HTML/CSS, ~0 JS           │
 └───────────────┘               │  - content baked at build    │
                                 └──────────────┬───────────────┘
                                                │ <a href> same tab (GET)
                                                ▼
                                 ┌──────────────────────────────┐
                                 │ Google Forms (owner: org)    │
                                 │  - fields, validation,       │
                                 │    sign-in, confirmation     │
                                 │  - responses → Sheets/Forms  │
                                 └──────────────────────────────┘
 Repo (GitHub) ──PR merge──▶ Host build ──▶ immutable deploy (rollback = redeploy previous)
```

Boundary rules:
- The site **sends nothing** to Google except the browser navigation; it receives nothing back.
- The site **stores no personal data**: no cookies, no localStorage, no forms.
- No third-party scripts, fonts, or embeds.

### 7.3 Component boundaries
- **Content layer** (data only): `site` config + `roles` collection + optional `faq`. Single source of truth.
- **Presentation layer** (pure components, D-06): read content and render it; no fetching.
- **Policy layer:** `RegisterLink` is the only component that knows about `registration.url` and `status`. Everything else composes it. This guarantees one place to change and one place to test.
- **Enhancement layer:** at most one small script module (sticky bar visibility if DP-03 is approved; optional filter), shipped as an external file. The page must pass all functional acceptance criteria with it disabled.

### 7.4 Content model (the only "schema"; no database)

Conceptual fields. Types and validation are what BUILD must enforce at build time.

**`site` (single record)**

| Field | Type | Required | Validation |
|---|---|---|---|
| `organization.name` | text | Yes | non-empty |
| `organization.logo` | asset path | No | SVG/PNG; falls back to a text wordmark |
| `program.name`, `program.shortName` | text | Yes | shortName ≤ 24 chars (sticky bar) |
| `program.tagline` | text | Yes | ≤ 160 chars |
| `program.overview` | rich text (Markdown) | No | — |
| `program.facts[]` | {label, value} | No | 0–4 items |
| `registration.approvedFormId` | text | Yes | The published form ID recorded by the form owner (DEC-012). Candidate from the brief: `1FAIpQLSfV8tXTNl-DZL3wUmJ3H5sneP9l2mHm-9_1l2xXnA9uinpBFg`, **not yet confirmed** |
| `registration.url` | URL | Yes | **Must equal `https://docs.google.com/forms/d/e/{approvedFormId}/viewform` exactly**, optionally followed only by the approved prefill parameters (OD-09). Short links (`forms.gle`) and any other host, path or form ID are rejected, and the build fails. *This proves the link points at the approved form. It does not prove the form is accessible or accepting responses (DAC-30).* |
| `registration.status` | enum `open` / `upcoming` / `closed` | Yes | — |
| `registration.opensAt` / `closesAt` | ISO date-time with offset | Conditional | `opensAt` required if `upcoming`; `closesAt` required if `open` and a deadline exists; shown in the canonical time zone decided under DEC-010 (OD-13 superseded in v0.5). **[PROPOSED, DP-12, DEC-010]:** the build fails if `status = open` and `closesAt` is in the past, so a stale "open" page cannot be redeployed. A deployed page does not change itself at the deadline; the operator closes it (FS-1, §7.10). If DEC-010 adopts a grace window, the advertised deadline stays in `closesAt` and the end of the window is recorded in `registration.graceEndsAt` |
| `registration.closedMessage` | text | Yes | — |
| `registration.notes[]` | text | No | Only verified statements (e.g. sign-in required, time to complete) |
| `registration.roleField` | {entryId} | No | Only if prefill is approved (OD-09) |
| `eligibility.criteria[]`, `eligibility.documents[]`, `eligibility.unsureGuidance` | text | criteria required | — |
| `apply.steps[]` | text (3) | Yes | — |
| `contact.email` | email | Yes | valid email |
| `contact.phone`, `contact.location` | text | No | — |
| `privacy.controller`, `privacy.processor`, `privacy.purpose`, `privacy.retention`, `privacy.policyUrl`, `privacy.contact`, `privacy.approvalRef`, `privacy.fieldInventoryRef` | text / URL | controller, purpose, contact, approvalRef, fieldInventoryRef required | `approvalRef` identifies the notice version approved by the privacy owner (DAC-60). `fieldInventoryRef` identifies the approved form-field inventory (DAC-66). An approval reference alone does not show the notice is still accurate; DAC-67 re-checks the live form against the inventory |
| `site.url` | URL | Yes | Canonical URL (the one encoded in the QR) |
| `site.lastUpdated` | date | Yes | — |

**`roles` (collection, one file per role)**

| Field | Type | Required |
|---|---|---|
| `slug` | kebab-case id | Yes (unique) |
| `title` | text | Yes |
| `department` | text | No |
| `summary` | text ≤ 200 chars | Yes |
| `workSetup` | enum onsite / hybrid / remote | No |
| `location` | text | No |
| `responsibilities[]` | text | Yes (≥ 1) |
| `requiredQualifications[]` | text | Yes (≥ 1) |
| `preferredQualifications[]` | text | No |
| `order` | integer | Yes |
| `published` | boolean | Yes (default false, so drafts never ship by accident) |

**`faq` (optional collection):** `question`, `answer`, `order`, `published`.

### 7.5 API design
**N/A.** There is no API. The only external contract:

| Contract | Spec |
|---|---|
| Registration link | `GET {registration.url}` via top-level navigation, same tab |
| Optional prefill (OD-09) | `{viewform URL}?usp=pp_url&entry.{roleField.entryId}={encoded role title}`. Allowed only after verifying the entry ID against the live form |
| Optional source tag (OD-08) | `?src=qr` on the **site** URL (never the form URL) |

### 7.6 Folder structure (conceptual; shown for the provisional Astro option, adjust to DEC-008)

```
/
├── docs/
│   ├── content-guide.md        # how organizers edit content (with examples)
│   ├── runbook.md              # change form URL · open/close · add role · rollback · QR
│   └── design/                 # this spec + approved decisions log
├── public/
│   ├── favicon.svg
│   ├── og-image.png            # from official brand (OD-05)
│   └── images/                 # approved, optimized photos only
├── src/
│   ├── content/
│   │   ├── config               # schema definitions (validation rules in §7.4)
│   │   ├── site.json
│   │   ├── roles/{slug}.md
│   │   └── faq/{nn}-{slug}.md
│   ├── components/             # D-06 components, one per file
│   ├── layouts/BaseLayout
│   ├── pages/index · 404
│   ├── scripts/sticky-register-bar   # sole enhancement script (only if DP-03 is approved)
│   └── styles/tokens.css       # all D-05 tokens; brand swap = edit this file
├── tests/                      # link, a11y, and content checks (D-08)
└── README.md
```

### 7.7 Naming conventions
| Item | Convention | Example |
|---|---|---|
| Components | PascalCase, noun | `RoleCard`, `RegisterLink` |
| Content files | kebab-case slug | `roles/marketing-intern.md` |
| Content keys | camelCase | `requiredQualifications` |
| Role anchors | `role-{slug}` | `#role-marketing-intern` |
| Section anchors | short kebab | `#roles`, `#requirements`, `#apply`, `#contact`, `#privacy` |
| CSS tokens | `--{category}-{name}` | `--color-primary`, `--space-4`, `--text-h2` |
| Branches | `{type}/{short-desc}` | `content/add-design-intern`, `fix/form-url` |
| Commits | Conventional Commits | `content: close registration` |
| Copy | Sentence case for all UI text; "Register now" (not "REGISTER NOW") | — |

### 7.8 Security considerations

**Status of the response-header controls: PROPOSED (DP-14), decided by the IT / security owner under DEC-013 (added in v0.3, IV-01).** The CSP, HSTS, Referrer-Policy and frame-protection headers below are this design's recommendation, not an approved organizational policy. DEC-013 decides which headers are mandatory, which are essential versus desirable, and whether an alternative arrangement (for example a host without custom headers, with the loss recorded) is acceptable. DEC-013's output is a **recorded header policy**: for each header in the table below, whether it is mandatory, recommended or not required, and its exact value (the values in the table are this design's proposals). DAC-52 tests that record, not this table (added in v0.4, V03-02). DEC-013 covers response headers and the host capability they need, and nothing else; it is not approval for any tool that can access the form or its responses (see DEC-014, added in v0.5, V04-02). The host decision (DEC-006) must follow DEC-013, because the answer determines which hosts qualify. The other controls in this table (exact form-ID validation, required review, no third-party scripts, no personal data on the site) do not depend on DEC-013.

| Risk | Control | Type |
|---|---|---|
| Registration URL swapped to another form (malicious or accidental) | Build-time **exact form-ID match** (§7.4, DEC-012); branch protection with **required review** on `site.json`; CODEOWNERS = content approver (the repo is public, so this is available on GitHub's free plan) | Design + operational |
| Third-party script compromise | No third-party scripts; strict CSP: `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'`. Compatible with §7.9 because all CSS and JS ship as external files: no inline `<style>`, no `style=` attributes, no inline scripts. The generator must be configured not to inline assets (e.g. Astro `build.inlineStylesheets: 'never'`) | Implementation |
| Clickjacking | `frame-ancestors 'none'` / `X-Frame-Options: DENY` | Implementation |
| Header controls depend on the host | If DEC-013 makes the headers mandatory, the host must support custom response headers (§7.10). A `<meta>` CSP cannot set `frame-ancestors` | Hosting (DEC-013, then DEC-006) |
| Transport | HTTPS only; HSTS set explicitly where the host allows, confirmed per host (DEC-006); no mixed content | Hosting |
| Referrer leakage | `Referrer-Policy: strict-origin-when-cross-origin` | Implementation |
| Personal data on site | The site collects nothing and sets no cookies. The host's access logs process visitors' IP addresses; the privacy owner decides whether the notice mentions this. Whether a consent banner is needed is the privacy owner's decision (DEC-005); none is designed unless analytics is added (OD-08) | Design + privacy owner |
| QR tampering (stickers over posters) | Print the short URL under every QR so students can check it; staff check posters | Operational |
| Dependency vulnerabilities | Minimal dev dependencies; automated dependency alerts | Operational |

### 7.9 Performance considerations
| Budget / rule | Target |
|---|---|
| Initial page weight **[PROPOSED, DP-01]** | ≤ 150 KB transferred, of which JS ≤ 10 KB. **Measured as:** Lighthouse "total byte weight" (transferred bytes), median of 5 mobile runs, for all requests before the load event at a 360×640 viewport with no scrolling. **Includes:** HTML, CSS, JS, web fonts, icons, favicon, manifest, and any image in the initial viewport. **Excludes:** lazy-loaded images below the fold (each still ≤ 120 KB) and requests made after user interaction |
| Images | Optional, lazy below the fold, ≤ 120 KB each, explicit dimensions |
| Web fonts | 0 (system stack) or 1 WOFF2 ≤ 40 KB, counted inside the 150 KB |
| Third-party requests | 0 |
| FCP / LCP / CLS / TBT (Lighthouse mobile, default Slow 4G throttling, median of 5 runs) | ≤ 1.8 s / ≤ 2.5 s / < 0.1 / ≤ 200 ms. INP (< 200 ms) can only be measured from field data and applies only if field data exists |
| Lighthouse | Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90 |
| Caching | HTML: `max-age=0, must-revalidate` (fresh status after a change); hashed assets: `max-age=31536000, immutable` |
| CSS delivery | **One external, content-hashed stylesheet; no inline CSS** (keeps the strict CSP in §7.8). Trade-off: one extra request on the first visit, versus allowing `'unsafe-inline'` or maintaining per-build CSP hashes. Accepted because the stylesheet is small and cached long-term. No render-blocking JS |

### 7.10 Hosting, domain, deployment, maintenance
- **Hosting [UNRESOLVED, DEC-006; decided after DEC-013]:** the host must offer HTTPS on a custom domain, preview deploys, instant rollback, and terms that allow organizational use on the chosen plan, plus **custom response headers if DEC-013 makes the §7.8 headers mandatory**. Candidates to check against current terms: Netlify, Cloudflare Pages, Vercel (its free Hobby plan is understood to be limited to personal, non-commercial use; verify). **GitHub Pages cannot set response headers**, so it is excluded if DEC-013 makes them mandatory; otherwise DEC-013 records which controls are given up.
- **Domain:** prefer an org-controlled subdomain (e.g. `internships.{org-domain}`), because the QR code is printed and must outlive any one hosting account. If a free host subdomain is used, the project name is effectively permanent once QR codes are printed.
- **Deploy:** merge to `main` → automatic build → production. Pull requests get preview URLs for content review.
- **Rollback:** promote the previous immutable deployment (seconds); document it in the runbook.
- **Maintenance tasks in the runbook:** change the form URL; open, close, or schedule registration; add, edit, or unpublish a role; update contact; post-event closure (set status `closed` and keep the page live with the closed message and contact, rather than deleting it, so printed QR codes don't 404).
- **Deadline business rule [UNRESOLVED, DEC-010; owner: program lead] (added in v0.3, IV-02).** The program lead decides one of:
  - **Hard cutoff, enforced at eligibility review (revised in v0.5, V04-01 and V04-03):** a submission is **eligible for review** only if its recorded timestamp, converted to the canonical time zone, meets the DEC-010 comparison rule below. The manual switch-off cannot be instantaneous (DAC-34 proposes a 2-minute tolerance), so Google Forms may still **record** some submissions during the switch-off interval and show those applicants its normal confirmation. Those submissions are recorded but **not eligible for review**. Nothing on the site, in the form or in any notice may say that Google Forms rejected them. The rule must state how affected applicants are informed (for example through a contact address the form collects, if it collects one; otherwise only through the published notice). This option is available only if the form owner verifies the timestamp source (DAC-37). If that can't be verified, a hard cutoff can't be enforced and must not be offered.
  - **Grace window:** submissions are accepted for a stated period after the advertised deadline (`registration.graceEndsAt`), and the form is switched off when the window ends. Submissions recorded after the window ends, including during the switch-off interval, are handled as in the hard-cutoff option, using the same comparison rule with `graceEndsAt` as the cutoff. The window is stated on the site so students aren't misled.
  - **Verified automatic close (added in v0.4, V03-04):** a mechanism that stops the form accepting responses at the deadline without manual action, such as a scheduling add-on or script. Allowed only if (a) the IT / security owner approves a review of that specific mechanism under DEC-014 (revised in v0.5, V04-02): what it is, the permissions it needs, which account owns and runs it (an organization-owned account, not a personal one), its access to response data, what happens if it fails (falling back to the manual procedure), and how it is removed after the event. DEC-013 covers response headers only and does not count as this approval. (b) The privacy owner approves its access to response data under DEC-005. (c) A rehearsal shows it closes the form within an agreed tolerance. Until all three hold, it is not part of this design.

  The design makes no default choice: this is a business rule, not a technical one. Whatever is chosen, **the published wording states the rule as it is actually enforced** (for example "Submissions recorded after {deadline} ({time zone}) are not eligible for review, even if Google Forms shows a confirmation") and never promises that the form stops at an exact moment. The build rule in §7.4 is not a substitute for any of this.

  The DEC-010 record states (expanded in v0.5, V04-01 and V04-03):
  - the option chosen;
  - the **canonical time zone** (an IANA time-zone name) and the cutoff as a full date-time with UTC offset: the deadline, or `graceEndsAt` for a grace window. The same time zone applies to every registration date shown on the site; OD-13 is superseded;
  - the **comparison rule** (revised in v0.7, V06-01). The cutoff C is stated at a **required resolution** q (for example 1 second or 1 minute). A recorded timestamp T, at the source's precision p, stands for an **uncertainty interval** of possible true times, converted to the canonical time zone:
    - [T, T + p) if the source truncates;
    - [T − p/2, T + p/2) if it rounds;
    - [T − p, T + p) if the method is unknown.

    A response is **eligible** if every time in its interval is at or before C, and **not eligible** if every time in its interval is after C. Otherwise it is a **boundary response**, and the record's **boundary rule** says whether boundary responses are eligible. The same boundary rule applies to every response and appears in the public wording. The rule never compares more finely than the source records: the interval's width must not exceed q, and DAC-37 fails if it does;
  - worked examples of the precision condition: a source that truncates to whole seconds gives intervals 1 second wide, so it supports q = 1 s or coarser. A source that truncates to whole minutes gives intervals 1 minute wide, so it supports q = 1 minute or coarser, but not q = 1 s. A minute-precision source whose method is unknown gives intervals 2 minutes wide, so it supports q = 2 minutes or coarser, but not q = 1 minute;
  - the **timestamp source** (for example the response timestamp in Google Forms, or the timestamp column of a linked response spreadsheet), its available precision (as observed in the stored or exported value, not only as displayed), whether it truncates or rounds (or that this is unknown), and how its time zone is interpreted. A linked spreadsheet may have its own time-zone setting, so the form owner verifies both with a test submission (DAC-37);
  - the **eligibility-record procedure**: who produces it, from which copy of the responses, how each response is classified, and who checks it (DAC-38);
  - how applicants whose submissions were recorded but not eligible are informed;
  - the approved **public wording**, which distinguishes a submission recorded by Google Forms from one that is eligible for review (DAC-36);
  - for an automatic close, the DEC-014 approval and the rehearsal evidence.

  Release stays blocked (B-10) until the rule and the mechanism agree.
- **Closure procedure [PROPOSED, DP-12, DEC-010]:** an operator role **and a backup role**, both with access to the form and deploy rights, are available from registration opening until closing. At the closing time set by the rule:
  1. Switch the form's "Accepting responses" off. Screenshot the closed form with the time showing.
  2. Set `registration.status = closed`, merge and deploy. Target: live within 15 min [PROPOSED].
  3. Check that the live site shows "Registration closed" and no form links. Record the time.
  4. Produce the eligibility record (DAC-38) from a copy of the responses, and record how submissions outside the permitted window were handled.
- **If something fails:**
  - *The form can't be switched off* (no access, outage): escalate at once to the backup, then the form owner. Responses received in the meantime are handled under the deadline rule and counted in step 4.
  - *The site can't be deployed:* the closed form is authoritative, and students who reach it see Google's closed message. Keep retrying the deploy; if a previous build already showed "closed", promote it (§7.10 rollback). Record the delay.
- **Test responses (revised in v0.7, V06-02):** these rules apply to every test submission to the live form (DAC-30, DAC-37).
  - *Before testing:* the form owner chooses a marker and **verifies it will appear in every response destination** used for the eligibility record. The preferred marker is a distinctive value (for example "TEST-DAC37-{date}") in a field that every destination exports. If no such field exists, the respondent's email address is acceptable only if the form collects it and every destination shows it. A timestamp alone is not a marker.
  - *Timing:* where possible, live-form tests run before the form is first shared with applicants, so any response recorded before that moment is known to be a test.
  - *Each test:* entered in a test log with its time, the account used, the marker, and every value entered.
  - *Afterwards:* the form owner removes the test response from the form and from every response destination (whether deleting a response in Google Forms also removes it from a linked spreadsheet must be confirmed by the form owner), and records which destinations were checked and that the marked row is gone.
  - *If removal can't be verified:* the row may be excluded from the eligibility record only if **exactly one row** in that destination carries the marker and matches the logged values. If no row or more than one row matches, that destination is not used for eligibility decisions until the form owner resolves it from the form's own response view. If it still can't be resolved, every candidate row stays in the review set, flagged "unresolved: possible test response", and the program lead records how those rows are treated. Nothing is excluded on a guess.
  - Genuine submissions are never edited or deleted to do any of this.
- Whether Google Forms can close itself on a schedule is not verified; do not rely on it. The procedure is rehearsed before the event (DAC-34) and evidenced at the live deadline (DAC-35).

### 7.11 Build instructions (hand-off to BUILD once approved)
1. Do not start until the BUILD-gate blockers in D-09 §9.1 (B-1, B-2, B-3, B-6, B-7, B-8, B-9) are resolved and recorded. B-4, B-5, B-10 and B-11, plus B-12 if DEC-010 selects an automatic close, must be resolved before release and QR printing; B-11 must be decided before B-4.
2. Scaffold the chosen option (DEC-008) with the folder structure in §7.6.
3. Implement tokens (§D-05) in one stylesheet first; components only use tokens.
4. Implement the content schema with **all validations in §7.4**; the build must fail on invalid content.
5. Implement components in D-06 order: `BaseLayout` → `RegisterLink` → `Hero` → `RoleList` / `RoleCard` → remaining sections → `StickyRegisterBar` (enhancement last).
6. Populate content only from the approved content sheet (D-07 §7.12). No placeholder or lorem text may ship.
7. Add the automated checks in D-08 (link equality, accessibility scan, budgets, status states).
8. Write `docs/content-guide.md` and `docs/runbook.md`.
9. Deploy to a preview URL for the VALIDATE phase; production only after VALIDATE approval.

### 7.12 Content governance

| Content item | Purpose | Required information | Source of truth | Owner / approver | Status |
|---|---|---|---|---|---|
| Organization name & logo | Identity, trust | Legal / display name; SVG logo; usage rules | Org brand guidelines | Brand / marketing owner | **[NEEDED]** |
| Program name, year, tagline | BR-01 | Official name; one-sentence value proposition | Program owner | Program lead (HR / recruitment) | **[NEEDED]** |
| Program overview & facts | Context | Duration, dates, setup, allowance/benefits **if offered** | HR policy | Program lead | **[NEEDED]** |
| Roles (each) | BR-02, BR-03 | Title, department, summary, responsibilities, required/preferred qualifications, setup, location | Hiring managers | Hiring manager → program lead approves | **[NEEDED]** (number of roles unknown) |
| Eligibility & documents | BR-03 | Who can apply (year level, courses, school, age, work authorization as applicable); documents to prepare | HR policy | Program lead | **[NEEDED]** |
| "Not sure you qualify?" guidance | AF-2 | Policy on borderline applicants | HR | Program lead | **[NEEDED]** (OD-11) |
| How to apply / next steps | BR-04 | Steps; what happens after submitting; response timeline **if committed** | Recruitment process | Program lead | **[NEEDED]** |
| Registration URL and approved form ID | BR-04 | Final `viewform` URL and its form ID | Google Form owner | Form owner | **[BRIEF-STATED] candidate; UNRESOLVED until DEC-012** |
| Registration status & dates | FS-1, FS-2 | Open/close dates, time zone, closed message | Program decision | Program lead | **[NEEDED]** |
| Form facts shown on site | §2.4 | Sign-in required? domain restriction? approximate time? file upload? | Live form settings | Form owner | **[NEEDED]** (OD-04) |
| Contact | AF-4, FS-3 | Monitored email; optional phone; booth location | Program team | Program lead | **[NEEDED]** |
| Privacy notice | P-5 | Data controller, purpose, recipients, retention, rights / contact, policy link, applicable law | Org privacy / DPO | Privacy owner / DPO | **[NEEDED]** |
| FAQ | BR-08 | ≥ 3 approved Q&As | Program team | Program lead | Optional |
| Photos | Trust | Approved, licensed images with consent of people pictured | Brand library | Brand owner | Optional |
| Site URL / domain | QR, canonical | Final URL | IT | IT / technical lead | **[NEEDED]** (DEC-006) |

**Process:** content is collected in a one-page content sheet (one row per field above). The program lead approves it. A maintainer copies it into the content files through a pull request; the approver reviews the preview deploy and merges. This uses git-based review and needs no CMS (BR-10). If organizers cannot use GitHub, the fallback is: the organizer edits the content sheet and the maintainer applies it (turnaround SLA to be agreed, OD-14).

### 7.13 Privacy and data responsibility (design-level)
- The website collects **no** personal data. Applicant data is collected through the Google Form. The **data controller is expected to be the organization** running the program [UNRESOLVED, DEC-005]; Google acts as a service provider (processor) through the form owner's account. The privacy owner must confirm these roles.
- The site must show a short privacy notice: who collects the data (controller), why (internship registration), where (Google Forms / Google Workspace account of the owner), how long (retention), and how to contact the owner. If the organizer operates in the Philippines, as the reference suggests but which is **not confirmed**, the Data Privacy Act of 2012 (RA 10173) likely applies; the privacy owner must confirm the applicable law.
- The form itself should carry its own consent and notice text. That is a form-owner action outside this site's scope; it is part of blocker B-3 (DEC-005) in D-09.
- The host's access logs process visitors' IP addresses; the privacy owner decides whether the notice mentions this (DEC-005).
- **Form-field review (part of B-3; added in v0.3, IV-04):** before BUILD, the form owner supplies an inventory of every field on the live form (label, required or optional, type of data) **and of the form's access and collection settings**, as listed in DAC-66 (amended in v0.4, V03-03). The privacy owner / legal reviewer records the purpose of each field and why it is necessary, and approves the inventory. The website notice and the form's own notice must both describe what is collected, how it is used, who receives it and how long it is kept, consistently with that inventory, and are approved together (DAC-66, DAC-68).
- **Eligibility record (added in v0.5, V04-01):** the copy of the responses used to produce the eligibility record (DAC-38) is personal data. Where it is stored, who can access it and how long it is kept are decided under B-3 (DEC-005).
- **Change-triggered revalidation (added in v0.3, IV-07):** any material change to the form's fields, purpose, recipients, retention or access settings triggers a new privacy review **before the changed form is used**. The runbook makes this a required step for any form change, and DAC-67 re-checks the live form against the approved inventory at every pre-event test.
- **Analytics [PROPOSED default: none].** If approved (OD-08), use a cookieless, privacy-friendly tool and record only page views and "Register clicked" events. **Clicks measure intent, not completed registrations.** Completed registrations can only be counted from the Google Forms response count, so reports must never present click counts as registrations.

### 7.14 QR code reliability (operational controls)
- Encode the **canonical site URL** (short, no tracking parameters unless OD-08 approves `?src=qr`).
- Error correction level **Q** (25%); quiet zone ≥ 4 modules; dark-on-light, contrast ≥ 7:1; minimum printed size 3 × 3 cm for handouts, ≥ 10 × 10 cm for posters viewed from 1 m or more.
- Print the human-readable short URL under every QR.
- Test every printed batch with the iOS camera, the Android camera / Google Lens, and at least one third-party scanner before the event (DAC-32).
- Never print QR codes before the domain decision (DEC-006) is final.

---

# D-08 — Design Acceptance Criteria

**Status of all criteria: PROPOSED.** A criterion takes effect when DEC-002 approves the requirements it traces to. Criteria that enforce a design-originated proposal (DP) are also **conditional** on that proposal's decision, and become N/A if it is rejected.

**Count: 62 criteria.** v0.1 defined 41. v0.2 added 13 (total 54) and reworded 23. v0.3 added 5 (DAC-34, 35, 66, 67, 68; total 59) and reworded 4 (DAC-05, 18, 52, 65). v0.4 added 1 (DAC-36; total 60) and reworded 4 (DAC-35, 52, 66, 67). v0.5 added 2 (DAC-37, 38; total 62) and reworded 2 (DAC-35, 36). v0.6 added none and reworded 4 (DAC-30, 36, 37, 38). v0.7 adds none and rewords 3 (DAC-36, 37, 38). No criterion has ever been removed. (A v0.1 chat summary said "40"; that was a counting error.) Each marker shows the latest version that changed the criterion: *(new)* / *(revised)* = v0.2; *(new v0.3)* / *(revised v0.3)* = v0.3; *(new v0.4)* / *(revised v0.4)* = v0.4; *(new v0.5)* / *(revised v0.5)* = v0.5; *(revised v0.6)* = v0.6; *(revised v0.7)* = v0.7.

**Numbering scheme** (documented in v0.2, DEF-014): IDs are grouped by tens.

| Range | Group |
|---|---|
| 01–09 | Journey and content |
| 10–19 | Registration transition and fallback channels |
| 20–29 | Status, failure states and responsive behaviour |
| 30–39 | Operational (pre-event) |
| 40–49 | Accessibility |
| 50–59 | Performance, security and static output |
| 60–69 | Governance, privacy, brand and maintenance |

Unused IDs **39, 55–59 and 69 are reserved, not missing**; nothing references them. v0.1 put status and responsive criteria together in the 20s; their IDs are kept rather than renumbered.

"Mobile" means a 360×640 CSS layout viewport in emulation **and** at least one real iOS and one real Android device. Every criterion traces to at least one requirement (BR) and names the design element it checks.

### Journey and content (01–09)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-01 *(revised)* | With final approved copy, at a 360×640 CSS layout viewport in emulation, the H1, tagline (≤ 160 chars), status badge and primary Register CTA sit fully inside the viewport without scrolling. On one real iOS and one real Android device with default browser toolbars, the same items are visible, or the deviation is recorded for DEC-002 | BR-01, BR-06 | Hero, G-1 | PROPOSED; needs B-1 |
| DAC-02 | From page load, one tap on the hero CTA opens the form (status open) | BR-04 | RegisterLink | PROPOSED |
| DAC-03 *(revised)* | With 2–8 published roles, every role title is present as an H3 in the collapsed list with no interaction, and each card expands in place to show responsibilities and required qualifications | BR-02, BR-03 | RoleList, RoleCard | PROPOSED; thresholds DEC-011 |
| DAC-04 *(revised)* | With exactly 1 published role, its details render inline with no disclosure control, and its title's heading level fits the page heading order (DAC-42) | BR-02 | RoleList | PROPOSED |
| DAC-05 *(revised v0.3)* | With 0 published roles, the page shows "No internship roles are currently listed. Contact {approved contact} for information." with a working contact link. Any forward-looking wording appears only if its exact text is approved in the content sheet (DAC-08) | BR-02, BR-08, BR-12 | RoleList | PROPOSED |
| DAC-06 | Roles with `published: false` are absent from the built HTML | BR-12 | §7.4 | PROPOSED |
| DAC-07 *(revised)* | Automated: the rendered text of every built page contains none of these case-insensitive tokens: `lorem`, `ipsum`, `TBD`, `TODO`, `XXX`, `{{`, `}}`, `[NEEDED]` | BR-12 | Principle 4 | PROPOSED |
| DAC-08 | Every displayed fact maps to an entry in the content sheet signed by the content approver. Evidence: the signed sheet with entry IDs | BR-01, BR-12 | §7.12 | PROPOSED; needs B-1, B-2 |
| DAC-09 *(new)* | The Eligibility section renders at least one criterion. "What to prepare" renders only when documents are supplied, and the "Not sure if you qualify?" callout only when approved guidance exists (OD-11) | BR-03, BR-08 | EligibilitySection, AF-2 | PROPOSED; needs B-1 |

### Registration transition and fallback channels (10–19)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-10 *(revised)* | Automated: every Register CTA's `href` equals the validated `registration.url` (or its approved prefill variant, OD-09), and no other link points to a Google Forms URL | BR-04, BR-10 | RegisterLink, §7.3 | PROPOSED; needs B-9 |
| DAC-11 | Register CTAs have no `target` attribute (same tab) | BR-04, BR-06 | §2.4 | PROPOSED; conditional on DP-04 (DEC-002) |
| DAC-12 *(revised)* | Each role CTA's accessible name is unique and contains its role title. Every Register CTA's accessible name begins with its visible label and contains "Google Forms". CTAs going to the same destination may share a name | BR-04, BR-09 | §5.10 | PROPOSED |
| DAC-13 | With status open, the text "Registration takes place on Google Forms" and a contact fallback appear next to the hero CTA | BR-08 | RegisterHelp, FS-3 | PROPOSED |
| DAC-14 *(revised)* | The build fails unless `registration.url` is exactly `https://docs.google.com/forms/d/e/{approvedFormId}/viewform` (plus approved prefill parameters only). Verified with one passing fixture and four failing ones: a `forms.gle` link, another host, another path, another form ID | BR-04, BR-10 | §7.4, DP-11 | PROPOSED; needs B-9. *Proves the destination, not access (see DAC-30)* |
| DAC-15 | The built site has no `<form>` or `<input>` elements, sets no cookies, and writes nothing to localStorage or sessionStorage | BR-05, BR-09 | §7.2, §7.13 | PROPOSED |
| DAC-16 *(revised)* | Manual, on iOS Safari, Android Chrome and one in-app browser: tapping Register loads a form whose URL contains `approvedFormId` and whose title matches the expected title recorded by the form owner; Back returns to the site | BR-04 | §2.1, §2.4 | PROPOSED; needs B-9 |
| DAC-17 *(new)* | If `registration.notes` records a verified sign-in requirement, that note renders next to the hero CTA. With status open, the in-app-browser fallback line with the short URL renders under the hero CTA | BR-08 | RegisterHelp, FS-4, FS-7 | PROPOSED; depends on B-5 |
| DAC-18 *(revised v0.3)* | At ≥ 768 px with status open, the header shows a Register CTA; with status upcoming or closed, it shows none | BR-04, BR-06 | SiteHeader, AF-6 | PROPOSED; **conditional on DP-15 (DEC-002)** |
| DAC-19 *(new)* | The Contact section shows the monitored email as a `mailto:` link whose visible text is the address, and the footer and the hero help line link to it | BR-08 | ContactPanel, AF-4 | PROPOSED; needs B-1 |

### Status, failure states and responsive behaviour (20–29)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-20 *(revised)* | `status=closed`: the badge reads "Registration closed"; the HTML contains zero links to any Google Form; the closed message and contact appear; no sticky bar and no header CTA | BR-08 | FS-1 | PROPOSED |
| DAC-21 *(revised)* | `status=upcoming`: the badge shows the opening date and time zone; zero form links; no sticky bar and no header CTA | BR-08 | FS-2 | PROPOSED; conditional on DP-02 (DEC-002) |
| DAC-22 | With JavaScript disabled: all content is readable, role details expand and collapse, and Register opens the form | BR-09 | FS-6 | PROPOSED |
| DAC-23 | With images blocked: no content or CTA is lost; CLS < 0.1 | BR-09 | FS-5 | PROPOSED |
| DAC-24 *(revised)* | An unknown path returns HTTP 404 and the 404 page with a link to the home page | BR-08 | FS-8 | PROPOSED; needs B-4 |
| DAC-25 *(revised)* | Within 5 minutes of a deploy completing, a normal reload in two browsers (one of them mobile) shows the new status | BR-10 | FS-9, §7.9 | PROPOSED; needs B-4 |
| DAC-26 | No horizontal scrolling at 320 px width, or at 400% zoom on a 1280 px viewport | BR-06, BR-09 | §5.5 | PROPOSED |
| DAC-27 *(revised)* | Sticky bar, with JavaScript: hidden while the hero CTA is in view, shown after it leaves; hidden while the footer intersects the viewport; hidden when the viewport is < 500 px tall, ≥ 1024 px wide, or status is not open; respects the iOS safe area; never covers the last content at the end of the page. Without JavaScript: shown whenever width < 1024 px, height ≥ 500 px and status is open | BR-04, BR-06 | §2.5, StickyRegisterBar | PROPOSED; **conditional on DP-03 (DEC-009)** |
| DAC-28 *(revised)* | Tablet: role cards in 2 columns; desktop: 3. In browsers that support `:has()`, an expanded card spans the full row and focus stays on its summary; otherwise it expands within its column. No content overlaps in either case | BR-02, BR-06 | D-04 §4.2 | PROPOSED |
| DAC-29 *(revised)* | On mobile, buttons, disclosures, navigation links and standalone links are ≥ 48×48 px. Links inside running text are exempt | BR-06, BR-09 | §5.10 | PROPOSED |

### Operational, pre-event (30–39)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-30 *(revised v0.6)* | **Authorized end-to-end test**, done by or with the form owner. Use an account representative of an external applicant (a personal Google account outside the organization's domain), and also no account if the form is meant to allow that. Open the form from the deployed site, complete every required field including any file upload, submit, and reach Google's confirmation. Evidence: screenshots of the form, the confirmation, and the response as received. The test response is handled under the test-response rule in §7.10 (removed from every response destination, or excluded by its marker). Repeat within 24 h before the event and after any change to the form | BR-04, BR-05, BR-08 | FS-3, FS-4, §2.4 | PROPOSED; needs B-5. *Separate from DAC-14: URL validation does not prove access* |
| DAC-31 *(revised)* | At T-24 h, at registration opening, and within the DEC-010 target after closing, the site status matches the form's "Accepting responses" state. Both are checked and recorded | BR-08, BR-10 | FS-1, DP-12 | PROPOSED; needs B-10 |
| DAC-32 | Printed QR codes resolve to the canonical URL with the iOS camera, the Android camera or Lens, and one third-party scanner, at handout and poster sizes | BR-06 | §7.14 | PROPOSED; needs B-4 |
| DAC-33 *(revised)* | In at least two in-app browsers (for example a scanner app and a social app), tapping Register loads the approved form, **or** the help line's short URL opens the site in the system browser and Register loads the form from there | BR-06, BR-08 | FS-7 | PROPOSED |
| DAC-34 *(new v0.3)* | **Closure rehearsal** before the event: the operator and the backup each run the §7.10 closure procedure on a test form and a preview deploy. Pass if each completes all four steps without help, the test form shows as closed within 2 minutes of starting [PROPOSED tolerance, DEC-010], and the preview shows "Registration closed" within the DEC-010 target. Times and screenshots recorded | BR-08, BR-10 | §7.10, DP-12 | PROPOSED; needs B-2, B-10 |
| DAC-35 *(revised v0.5)* | **Live closure evidence** at the closing time set by the DEC-010 rule: a timed screenshot shows the form switched off within the DEC-010 tolerance (proposed ≤ 2 minutes); the live site shows "Registration closed" within the DEC-010 target; the eligibility record (DAC-38) classifies every response, and the set passed on for review contains no submission outside the permitted window; and applicants whose submissions were recorded but not eligible are informed using the DEC-010-approved wording, which says the submission was received but is not eligible and does **not** say the form rejected it. Evidence of all of this is kept as the DEC-010 record states | BR-04, BR-08 | §7.10, FS-1 | PROPOSED; needs B-10 |
| DAC-36 *(revised v0.7)* | The deadline statement on the site and in the form's own description matches the public wording approved in the DEC-010 record. It gives the cutoff with its time zone, at the required resolution q, and states the boundary rule if one applies; it explains that a submission Google Forms records after the cutoff is not eligible for review even if Google shows a confirmation; and it does not promise that the form stops at an exact moment | BR-08, BR-12 | §7.10, StatusBadge | PROPOSED; needs B-10 |
| DAC-37 *(revised v0.7)* | **Timestamp verification**, before release and after any change to the form or to where its responses go. The form owner records the timestamp source named in the DEC-010 record; its **available precision** p as observed in the stored or exported value (not only as displayed); whether it truncates, rounds or is unknown; and its time-zone setting. They then make a test submission, noting the reference time R at the moment of submitting from a clock synchronized to network time with a stated uncertainty u (proposed 1 s), and read the recorded timestamp T. Using T's uncertainty interval I as defined in the DEC-010 comparison rule, converted to the canonical time zone, **pass only if both hold**: (a) **precision**: the width of I is no greater than the required resolution q recorded in DEC-010; (b) **accuracy**: I overlaps the window [R − u, R + 10 s + u], where 10 s is the proposed allowance for submission delay [PROPOSED, DEC-010]. If (a) fails, the source can't support that rule and DAC-37 fails, whatever the boundary rule says; DEC-010 must then choose a coarser q or a different timestamp source. The test response is handled under the test-response rule in §7.10 | BR-08, BR-10 | §7.10 | PROPOSED; needs B-5, B-10 |
| DAC-38 *(revised v0.7)* | **Eligibility record**, produced at closure from a copy of the responses (never the original), taken from the response destination named in the DEC-010 record: each row's timestamp in the canonical time zone, its uncertainty interval, and one status: eligible or not eligible under the DEC-010 comparison rule (noting where the boundary rule decided it); test response (excluded, only as the single row matching a logged marker and values); or unresolved possible test response (kept in the review set and flagged). Pass if every row has exactly one status, the counts add up to the total number of rows, every logged test response is verified absent, excluded by a unique match, or kept and flagged, no row is excluded without a unique match, a second person has checked every response within 10 minutes either side of the cutoff [PROPOSED window, DEC-010], and the set passed on for review contains exactly the eligible responses plus any rows flagged as unresolved possible test responses. The copy is stored, accessed and kept as B-3 decides | BR-08, BR-09 | §7.10, §7.13 | PROPOSED; needs B-3, B-10 |

### Accessibility (40–49)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-40 *(revised)* | axe-core reports 0 serious or critical violations on: the index with status open (with a role both expanded and collapsed), upcoming, and closed; and the 404 page | BR-09 | §5.10 | PROPOSED |
| DAC-41 | Keyboard only: the skip link works; focus order is logical; focus is visible; disclosures toggle with Enter and Space; there are no keyboard traps | BR-08, BR-09 | AF-5 | PROPOSED |
| DAC-42 *(revised)* | With VoiceOver + iOS Safari, NVDA + Firefox or Chrome, and TalkBack + Android Chrome: one H1; no skipped heading levels; landmarks announced; disclosures announce their expanded state; CTAs announce their destination | BR-08, BR-09 | AF-5 | PROPOSED |
| DAC-43 | Text contrast ≥ 4.5:1 (≥ 3:1 for large text, UI boundaries and the focus indicator); status is never shown by colour alone; re-run after any brand change | BR-07, BR-09 | §5.2 | PROPOSED |
| DAC-44 | Content and functions remain usable at 200% text size | BR-09 | §5.3 | PROPOSED |
| DAC-45 | With `prefers-reduced-motion: reduce`, there are no transitions and no smooth scrolling | BR-09 | §5.10 | PROPOSED |
| DAC-46 | Informative images have meaningful alt text; decorative images have `alt=""` | BR-09 | §5.9 | PROPOSED |
| DAC-47 | `<html lang>` matches the content language | BR-09 | §5.10 | PROPOSED; OD-12 |
| DAC-48 *(new)* | A manual WCAG 2.2 Level AA audit of the index (all three statuses) and the 404 page, by someone other than the implementer, records 0 failures | BR-09 | G-4 | PROPOSED |
| DAC-49 *(new)* | With the sticky bar shown, tabbing forward and backward through every focusable element leaves each focused element at least partly visible, not covered by the bar (WCAG 2.2 SC 2.4.11), in portrait and landscape | BR-09 | §2.5, §5.10 | PROPOSED; **conditional on DP-03 (DEC-009)** |

### Performance, security and static output (50–59)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-50 *(revised)* | Lighthouse mobile (default Slow 4G throttling), median of 5 runs on the deployed preview: Performance ≥ 90, FCP ≤ 1.8 s, LCP ≤ 2.5 s, CLS < 0.1, TBT ≤ 200 ms | BR-06, BR-09 | §7.9 | PROPOSED; conditional on DP-01 (DEC-002) |
| DAC-51 *(revised)* | Initial page weight ≤ 150 KB, of which JS ≤ 10 KB, measured exactly as defined in §7.9; 0 third-party requests | BR-09, BR-11 | §7.9 | PROPOSED; conditional on DP-01 (DEC-002) |
| DAC-52 *(revised v0.4)* | Production responses for `/` and for an unknown path (the 404 route) carry **every header that the recorded DEC-013 header policy marks mandatory, with exactly the recorded value**. Headers the policy marks recommended are reported but don't affect the result. If a CSP is mandatory, the browser console shows 0 violations of it on both routes. Evidence: the raw response headers of both routes (for example `curl -I` output), attached to the release record with the DEC-013 policy reference | BR-09 | §7.8 | PROPOSED; **conditional on DP-14 (DEC-013)**: tests the recorded policy, not the §7.8 proposal; needs B-4 |
| DAC-53 | A change to `site.json` cannot be merged without an approving review from a CODEOWNER. Verified by attempting an unapproved merge | BR-10 | §7.8 | PROPOSED; needs B-2 |
| DAC-54 *(new)* | The deployed output consists only of static files (HTML, CSS, JS, images, fonts, and the host's header and redirect configuration). No server functions, API routes, databases or auth providers are configured | BR-11 | §7.1, §7.2 | PROPOSED |

### Governance, privacy, brand and maintenance (60–69)
| ID | Pass/fail condition | Traces | Design ref | Status / depends on |
|---|---|---|---|---|
| DAC-60 *(new)* | The privacy notice shows the controller, processor, purpose, retention and contact, and its text matches the version referenced by `privacy.approvalRef`, which the privacy owner approved | BR-09 | PrivacyNotice, §7.13 | PROPOSED; needs B-3 |
| DAC-61 *(new)* | Logo, colours and typeface match brand assets approved by the brand owner. If none are approved, the site uses the text wordmark and provisional tokens, and the brand owner has recorded acceptance. No logo or brand mark that the organization did not supply appears | BR-07 | D-05, §5.9 | PROPOSED; OD-05 |
| DAC-62 *(new)* | `docs/runbook.md` and `docs/content-guide.md` exist. Someone other than their author follows them on a preview deploy to (a) change the form URL, (b) close registration, (c) add a role, and (d) unpublish a role, and each task succeeds without help | BR-10 | §7.10, §7.12 | PROPOSED; needs B-2 |
| DAC-63 *(new)* | Before release, promoting the previous deployment restores it in production within 5 minutes [PROPOSED target, DEC-002]. Demonstrated once and recorded | BR-10 | §7.10 | PROPOSED; needs B-4 |
| DAC-64 *(new)* | The time from merging a status change to it being live is within the DEC-010 target (proposed ≤ 15 min). Demonstrated once before release | BR-08, BR-10 | §7.10, DP-12 | PROPOSED; needs B-10 |
| DAC-65 *(revised v0.3)* | The build fails when `status = open` and `closesAt` (or `graceEndsAt`, if DEC-010 adopts a grace window) is in the past (fixture test). This only stops a stale page being redeployed; closing the live site is tested by DAC-35 | BR-08, BR-10 | §7.4, DP-12 | PROPOSED; conditional on DEC-010 |
| DAC-66 *(revised v0.4)* | An approved inventory exists, referenced by `privacy.fieldInventoryRef` and carrying the privacy owner / legal reviewer's recorded approval. **Fields:** for every field on the live form, its label, whether it is required, its purpose and why it is necessary. **Settings:** for each form setting that affects who can submit or what is collected, its recorded value or "not applicable", plus the role who verified it and the date. At minimum: whether sign-in is required; any restriction to an organization's domain; whether respondents' email addresses are collected; whether respondents can edit after submitting; any one-response limit; file upload (enabled or not, allowed types and size); and whether respondents can see a summary of other responses. Setting names follow the form owner's version of Google Forms and are confirmed by the form owner | BR-09 | §7.13 | PROPOSED; needs B-3 |
| DAC-67 *(revised v0.4)* | At every run of DAC-30, and before any changed form is used, the form owner compares the live form with the approved inventory: every field, and every setting recorded as applicable. Pass only if all match the recorded values. Any mismatch fails, and the changed form is not used until the privacy owner re-approves it. The comparison and its result are recorded | BR-09 | §7.13 | PROPOSED; needs B-3, B-5 |
| DAC-68 *(new v0.3)* | The website notice and the form's own notice each describe collection, use, recipients and retention consistently with each other and with the approved inventory, and the privacy owner / legal reviewer signs off both together | BR-09 | §7.13, PrivacyNotice | PROPOSED; needs B-3 |

---

# D-09 — Open Decisions and Risks

### 9.1 Blockers

Every blocker blocks the gate shown. "Critical" means the decision needs business authority. "Conditional" means it blocks only the gate named. **None is non-blocking.**

| ID | Blocker | Decision | Gate | Owner (role) | Class |
|---|---|---|---|---|---|
| B-1 | Approved internship content: organization identity, program, roles and their number, eligibility, dates, benefits | DEC-003 | BUILD start | Program lead / HR content owner | Critical |
| B-2 | Content owner, approver, maintainer and event-day operator assigned | DEC-004 | BUILD start | Project sponsor | Critical |
| B-3 | Data controller and processor roles; applicable law; **an approved inventory of every form field with its purpose and necessity, and of the form's access and collection settings**; website and form notices that accurately describe collection, use, recipients and retention, approved together; consent-banner decision; whether host logs are mentioned; the change-triggered revalidation rule (§7.13); storage, access and retention of the eligibility-record copy (DAC-38) | DEC-005 | BUILD start | Organization privacy officer / legal (field inventory supplied by the form owner) | Critical |
| B-4 | Hosting platform and permanent domain: custom headers, plan terms for organizational use, IT policy | DEC-006 | Release and QR printing (BUILD may start on a preview host) | IT / technical lead | Conditional |
| B-5 | Form access verified by the authorized end-to-end test (DAC-30): accepting responses, not restricted to the organization's domain, sign-in and upload behaviour known | DEC-007 | Release and QR printing | Google Form owner | Conditional |
| B-6 | THINK baseline published, or the DESIGN brief formally adopted as THINK | DEC-001 | BUILD start | Project sponsor | Critical |
| B-7 | Approval or rejection, under DEC-002, of: BR-01 – BR-12; the proposals assigned to DEC-002 (DP-01, DP-02, DP-04, DP-06, DP-15); and the D-08 criteria. Every other proposal is decided under its own decision: DP-03 (DEC-009), DP-05 (DEC-011), DP-07 (OD-05), DP-08 (OD-10), DP-09 (OD-09), DP-10 (OD-08), DP-11 (DEC-012), DP-12 (DEC-010), DP-13 (DEC-008), DP-14 (DEC-013) | DEC-002 | BUILD start | Project sponsor + program lead | Critical |
| B-8 | Technology stack ADR completed (§7.1) | DEC-008 | BUILD start (kickoff) | Technical lead / maintainer | Conditional |
| B-9 | Exact approved form ID recorded | DEC-012 | BUILD start (schema validation, §7.11 step 4) | Google Form owner | Conditional |
| B-10 | **Deadline business rule** (hard cutoff enforced at eligibility review, grace window, or verified automatic close) **and an enforcement mechanism that matches it**: canonical time zone and comparison rule; verified timestamp source, its precision and the boundary rule, its recording method and the required resolution (DAC-37); test-response handling (§7.10); eligibility-record procedure (DAC-38); how applicants whose submissions were recorded but not eligible are informed; public wording that distinguishes a submission recorded by Google Forms from one eligible for review; plus the closure procedure: operator and backup, sequence, target time and tolerance, failure response, evidence (§7.10). Release stays blocked until rule and mechanism agree | DEC-010 | Release | Program lead (business rule) + maintainer (procedure) | Conditional |
| B-11 | Security response-header policy (DP-14): which §7.8 headers are mandatory or essential, and whether a host without custom headers is acceptable. Must be decided before B-4 | DEC-013 | Release and QR printing; before B-4 | IT / security owner | Conditional |
| B-12 | Only if DEC-010 selects a verified automatic close: an IT / security review of that specific mechanism, covering what it is, the permissions it needs, which account owns and runs it, its access to response data, what happens if it fails, and how it is removed afterwards (added in v0.5, V04-02) | DEC-014 | Release, only if an automatic close is selected | IT / security owner | Conditional |

### 9.2 Noncritical open decisions

| ID | Decision | Proposed default | Owner (role) | Status |
|---|---|---|---|---|
| DEC-009 | Keep, modify or drop the sticky bar (DP-03) | Decide using the evidence defined in §2.5; until then, not approved | UX owner + program lead | UNRESOLVED |
| DEC-011 | Role-count thresholds for filters and search (DP-05) | 1 / 2–8 / filters above 8 / search above 20, confirmed against DEC-003 | UX owner | UNRESOLVED |
| OD-04 | Which verified form facts to show (sign-in, time to complete, uploads) | Only facts verified by DAC-30; depends on DEC-007 | Form owner | UNRESOLVED |
| OD-05 | Official branding: logo, colours, type, photos | Provisional system in D-05 (DP-07); text wordmark | Brand owner | UNRESOLVED |
| OD-06 | *Superseded in v0.2 by DEC-006 (blocker B-4). Kept so the ID keeps its meaning* | — | — | Superseded |
| OD-07 | *Superseded in v0.2 by DEC-008 (blocker B-8). Kept so the ID keeps its meaning* | — | — | Superseded |
| OD-08 | Analytics (DP-10) | None. If approved: cookieless, intent-only events, `?src=qr` | Program lead + privacy owner | UNRESOLVED |
| OD-09 | Role prefill in form links (DP-09) | Off (same URL for all CTAs) | Form owner | UNRESOLVED |
| OD-10 | Booth kiosk / desktop QR panel (DP-08) | Off; QR panel optional on desktop | Program lead | UNRESOLVED |
| OD-11 | Messaging for borderline applicants | "If you meet most requirements, we encourage you to register". **A policy decision, not a default to ship without approval** | Program lead | UNRESOLVED |
| OD-12 | Language(s) | Single language (English), `lang="en"` | Program lead | UNRESOLVED |
| OD-13 | *Superseded in v0.5 by DEC-010 (blocker B-10): the canonical time zone for every registration date is now part of the deadline decision. Kept so the ID keeps its meaning* | — | — | Superseded |
| OD-14 | Content update path for people who don't use GitHub | Content sheet → maintainer pull request | Project sponsor | UNRESOLVED |
| OD-15 | Post-event behaviour | Keep the site live with `status=closed` | Program lead | UNRESOLVED |

The first three OD numbers (01 to 03) were never assigned in v0.1. They stay unused so existing IDs keep their meaning.

### 9.3 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | No approved content by the fair date | Medium | High | Content sheet with a deadline; a minimal launch needs only the fields marked required in §7.4 (B-1) |
| R-02 | Form restricted to the organization's domain, or sign-in blocks applicants | Medium | **High**: blocks registration | B-5; DAC-30 with an external account |
| R-03 | Form stops accepting responses while the site still shows "open" | Medium | Medium | B-10 procedure (form closed first); DAC-31, DAC-34, DAC-35; help line with contact |
| R-04 | QR codes printed before the final URL | Medium | High | Printing gated on DEC-006 (B-4); QR points to the site, not the form |
| R-05 | Venue Wi-Fi or cellular congestion | High | Medium | Page-weight budget (§7.9); printed short URL; students can register later because the site stays up |
| R-06 | In-app browsers mishandle Google sign-in | Medium | Medium | Same-tab link; "open in browser" help line; DAC-33 |
| R-07 | Content goes stale after the fair | High | Low–medium | `lastUpdated` in the footer; OD-15 closure procedure |
| R-08 | Click analytics reported as registrations | Medium | Medium | §7.13 rule; use the Forms response count |
| R-09 | Provisional brand shipped as if official | Low | Medium | OD-05; DAC-61 |
| R-10 | Registration URL tampered with in the repo | Low | High | Exact form-ID validation and required review (DAC-14, DAC-53) |
| R-11 | Scope creep toward reference features (map, chatbot, lead capture) | Medium | Medium | D-01 §1.5 exclusions; VALIDATE checks for architectural drift |
| R-12 | A wrong but valid Google Form link ships (VALIDATE RSK-01) | Low | High | DP-11; DAC-14; DAC-16 |
| R-13 | The chosen host can't set security headers (RSK-02) | Medium | Medium | DEC-013 decided before DEC-006; DAC-52 |
| R-14 | No one available to redeploy at the deadline or on event day (RSK-03) | Medium | Medium | B-10; DAC-64 |
| R-15 | The sticky bar hides focused content (RSK-04) | Medium | Medium | DEC-009 evidence; DAC-49 |
| R-16 | Self-validation misses errors (RSK-05) | Medium | Medium | Every version is validated by a reviewer who did not write it (done for v0.2 – v0.6; required for v0.7) |
| R-17 | Late submissions disputed because the deadline rule is unclear (IV-02) | Medium | Medium | DEC-010 rule including time zone, comparison rule and switch-off-interval handling; DAC-35 – DAC-38 |
| R-18 | Form fields or settings change after privacy approval (IV-07) | Medium | High | §7.13 change-triggered review; DAC-67 |
| R-19 | An automatic-close tool gains access to applicant data on the strength of the header decision alone (V04-02) | Low | High | DEC-014 review; B-12 |
| R-20 | A test response stays in a linked destination and distorts the eligibility count (V05-02) | Low | Medium | §7.10 test-response rule (verified marker, unique match, flagged fallback); DAC-38 |
| R-21 | The timestamp source is too coarse for the chosen deadline rule (V06-01) | Medium | Medium | DAC-37 precision condition; DEC-010 chooses a coarser q or another source |

### 9.4 Design assumptions (to confirm)
- A-1: The number of opportunities is between 1 and 8 (the design adapts if not; DEC-011).
- A-2: Students have mobile data or Wi-Fi at some point (Google Forms needs a connection).
- A-3: One registration form serves all roles.
- A-4: The audience reads English (OD-12).
- A-5: The organizer owns, or can obtain, a domain or an approved hosting account (DEC-006).

---

# D-10 — Traceability Matrix (new in v0.2)

Every requirement below has status **PROPOSED** (source: DESIGN brief) until DEC-001 and DEC-002. The "Acceptance criteria" column lists every criterion whose Traces column in D-08 names that requirement; the consistency audit checks that the two match.

| Req | Design elements | Design proposals | Acceptance criteria | Blockers / decisions |
|---|---|---|---|---|
| BR-01 | Hero, KeyFacts, ProgramOverview | DP-01, DP-06 | DAC-01, 08 | B-1, B-6, B-7 |
| BR-02 | RoleList, RoleCard, §3.1 | DP-05 | DAC-03, 04, 05, 28 | B-1, DEC-011 |
| BR-03 | RoleDetails, EligibilitySection | — | DAC-03, 09 | B-1 |
| BR-04 | RegisterLink, §2.4, SiteHeader | DP-03, DP-04, DP-09, DP-11, DP-15 | DAC-02, 10, 11, 12, 14, 16, 18, 27, 30, 35 | B-5, B-9, B-10, DEC-009 |
| BR-05 | §2.5, §7.2 | — | DAC-15, 30 | B-5 |
| BR-06 | D-04, §5.5, §7.14 | DP-01, DP-03, DP-04, DP-08, DP-15 | DAC-01, 11, 18, 26, 27, 28, 29, 32, 33, 50 | B-4, DEC-009 |
| BR-07 | D-05, §5.9 | DP-07 | DAC-43, 61 | OD-05 |
| BR-08 | AF-1–6, FS-1–9, RegisterHelp, ContactPanel | DP-02, DP-12 | DAC-05, 09, 13, 17, 19, 20, 21, 24, 30, 31, 33, 34, 35, 36, 37, 38, 41, 42, 64, 65 | B-5, B-10, B-12 |
| BR-09 | §5.10, §7.8, §7.9, §7.13, PrivacyNotice | DP-01, DP-03, DP-14 | DAC-12, 15, 22, 23, 26, 29, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 60, 66, 67, 68 | B-3, B-4, B-11 |
| BR-10 | §7.3, §7.4, §7.10, §7.12 | DP-01, DP-11, DP-12, DP-13 | DAC-10, 14, 25, 31, 34, 37, 53, 62, 63, 64, 65 | B-2, B-4, B-8, B-10 |
| BR-11 | §7.1, §7.2 | DP-13 | DAC-51, 54 | B-8 |
| BR-12 | Principle 4, §7.12 | — | DAC-05, 06, 07, 08, 36 | B-1, B-2, B-10 |

---

## Design Approval Gate (brief §13)

| Check | Result | Notes |
|---|---|---|
| Every brief-derived requirement maps to a design element and at least one criterion | ✅ | D-10. No requirement lacks a criterion (v0.1's BR-07 gap closed by DAC-61) |
| Requirements approved through THINK | ❌ | No THINK baseline (B-6); requirements not approved (B-7) |
| No proposal presented as approved | ✅ | All items PROPOSED or UNRESOLVED; no item is CONFIRMED |
| Every major journey specified | ✅ | D-02: primary journey, 6 alternatives, 9 failure states |
| Mobile prioritizes discovery and registration | ✅ (proposed) | DAC-01, DAC-02, DAC-18; the sticky bar is conditional (DEC-009) |
| Information architecture justified by the actual opportunity model | ⚠️ | Adaptive design; actual role count unknown (B-1, DEC-011) |
| Google Forms remains the registration system | ✅ | BR-05, DAC-10, DAC-15 |
| Registration buttons tied to the exact approved destination | ✅ (design) | DP-11, DAC-10, DAC-14; the form ID itself awaits B-9 |
| Access testing kept separate from URL validation | ✅ | §2.4, DAC-14 vs DAC-30 |
| Security, accessibility and performance consistent | ✅ (design) / ⚠️ policy unapproved | External CSS/JS is compatible with the proposed CSP; the header policy itself is DP-14, pending DEC-013 (B-11); page-weight measurement defined |
| Privacy and data ownership assigned to the right decision-makers | ✅ (assigned) / ❌ (unresolved) | B-3 owned by the privacy officer / legal; now includes the form-field inventory, notice alignment and change-triggered review (DAC-66 – DAC-68) |
| Deadline business rule explicit | ❌ unresolved, correctly blocked | DEC-010 (B-10): hard cutoff enforced at eligibility review, grace window, or verified automatic close; canonical time zone, interval-based comparison rule at a required resolution the timestamp source is verified to support, a stated boundary rule, uniquely identifiable test responses with a safe fallback, and an eligibility record required (DAC-37, DAC-38); public wording separates "recorded" from "eligible" (DAC-36); an automatic close needs its own security review (DEC-014, B-12); release blocked until rule and mechanism agree; the build rule is not presented as a runtime guarantee |
| Technical design within scope | ✅ | No backend, database, auth, paid API or CMS (DAC-54) |
| Critical decisions resolved or explicitly blocked | ✅ explicitly blocked | B-1 – B-12 |
| Acceptance criteria objective and traceable | ✅ (self-assessed) | 62 criteria with pass/fail conditions and BR traces; needs independent confirmation |

## Final status: **NOT APPROVED FOR BUILD**

BUILD stays blocked until **B-1, B-2, B-3, B-6, B-7, B-8 and B-9** are resolved and recorded. Release and QR printing also need **B-4, B-5, B-10 and B-11** (B-11 before B-4), plus **B-12** if an automatic close is chosen. The author does not approve this document. v0.7 needs a **fresh independent VALIDATE pass** that checks each IV, V03, V04, V05 and V06 finding's disposition against the revised wording and criteria, not just the presence of new IDs or a passing consistency script.

---

## Change log (v0.6 → v0.7)

Each entry answers one finding from the independent VALIDATE review of v0.6. No feature was added and the design concept is unchanged. v0.6 is preserved unchanged.

| CL | Finding | Disposition | Sections changed | Correction |
|---|---|---|---|---|
| CL-46 | V06-01 Precision vs tolerance | Accepted (high) | §7.10 DEC-010 record (comparison rule, timestamp source, worked examples); B-10; DAC-36, DAC-37, DAC-38; R-21; gate | Each timestamp now stands for an uncertainty interval set by its precision and recording method (truncate, round, unknown). Eligibility is decided on that interval against a cutoff stated at a required resolution q; boundary responses go to the boundary rule. DAC-37 has two separate conditions: precision (interval width ≤ q) and accuracy (interval overlaps [R − u, R + 10 s + u]). If precision fails, the test fails whatever the boundary rule says. Worked examples cover second, minute and unknown-method sources |
| CL-47 | V06-02 Marker reliability | Accepted | §7.10 test-response rule; DAC-38; R-20 | The marker must be verified to appear in every destination before testing; a timestamp alone is not a marker. Tests run before the form is first shared where possible. A test row is excluded only on a unique match to its marker and logged values. Otherwise the destination isn't used until resolved, and any still-unresolved rows stay in the review set, flagged, with the program lead recording how they're treated |
| CL-48 | — | Wording fix (author's own v0.6 regression) | §7.10 DEC-010 record, timestamp-source bullet | Restored a comma lost in v0.6 ("spreadsheet) its available precision" → "spreadsheet), its available precision"). No change in meaning |
| CL-49 | — | Bookkeeping | D-08 count statement; consistency audit | Count unchanged at 62; audit re-run on v0.7 |

## Change log (v0.5 → v0.6)

Each entry answers one finding from the independent VALIDATE review of v0.5. No feature was added and the design concept is unchanged. v0.5 is preserved unchanged.

| CL | Finding | Disposition | Sections changed | Correction |
|---|---|---|---|---|
| CL-43 | V05-01 Timestamp precision | Accepted (high) | §7.10 DEC-010 record (comparison rule, timestamp source); B-10; DAC-36, DAC-37; gate | The form owner records the source's available precision as stored or exported. The comparison rule never compares more finely than that, and a stated boundary rule covers times the source can't distinguish near the cutoff; the public wording carries the same rule. DAC-37 now passes only if the test timestamp falls within a stated tolerance at the recorded precision **and** the comparison rule is supportable at that precision. The "to the minute" pass condition is removed |
| CL-44 | V05-02 Test-response cleanup | Accepted | §7.10 new test-response rule; B-10; DAC-30, DAC-37, DAC-38; R-20 | Every test submission is logged with a marker and removed from the form and from every response destination, or, if it can't be removed reliably, excluded by its marker in the eligibility record. Genuine submissions are never edited. DAC-30 had the same gap (it also deleted its test response without checking linked destinations) and now follows the same rule |
| CL-45 | — | Bookkeeping | D-08 count statement; consistency audit | Count unchanged at 62; audit re-run on v0.6 |

## Change log (v0.4 → v0.5)

Each entry answers one finding from the independent VALIDATE review of v0.4. No feature was added and the design concept is unchanged. v0.4 is preserved unchanged.

| CL | Finding | Disposition | Sections changed | Correction |
|---|---|---|---|---|
| CL-39 | V04-01 Deadline comparison | Accepted (high) | §7.10 deadline options and DEC-010 record; §7.4 dates; §7.13; B-3; B-10; OD-13 superseded; new DAC-37, DAC-38; DAC-35; R-17; gate | DEC-010 must now record the canonical time zone, the cutoff with UTC offset, the comparison rule (inclusive, precision, boundary cases), the timestamp source and its verified interpretation, and the eligibility-record procedure, for the grace window as well as the hard cutoff. The time-zone question moved from noncritical OD-13 into blocking DEC-010. The eligibility-record copy is personal data handled under B-3 |
| CL-40 | V04-02 Automatic-close approval | Accepted | §7.8 status note; §7.10 automatic close; new B-12 / DEC-014; R-19 | An automatic close now needs its own IT / security review (DEC-014) of the mechanism, its permissions, owning account, data access, failure behaviour and removal, plus privacy approval and a rehearsal. DEC-013 is stated to cover response headers only |
| CL-41 | V04-03 Recorded vs eligible | Accepted | §7.10 hard-cutoff text, example wording, DEC-010 record; DAC-35, DAC-36 | Submissions Google Forms records during the switch-off interval are "recorded but not eligible for review". Nothing may say Google Forms rejected them. Public wording and applicant notices must make the distinction |
| CL-42 | — | Bookkeeping | D-08 count and numbering; consistency audit | Count 62; reserved IDs updated; audit re-run on v0.5 |

## Change log (v0.3 → v0.4)

Each entry answers one finding from the independent VALIDATE review of v0.3. No feature was added and the design concept is unchanged. v0.3 is preserved unchanged.

| CL | Finding | Disposition | Sections changed | Correction |
|---|---|---|---|---|
| CL-34 | V03-01 Proposal scope | Accepted | D-09 B-7 | B-7 now names exactly the five proposals assigned to DEC-002 (DP-01, 02, 04, 06, 15) and the decision for every other proposal, instead of a numbered range that stopped at DP-13 |
| CL-35 | V03-02 Security test | Accepted | §7.8 status note; DAC-52 | DEC-013 produces a recorded header policy (mandatory / recommended / not required, exact values). DAC-52 tests that record on both routes, with raw header evidence attached; recommended headers don't affect the result |
| CL-36 | V03-03 Privacy inventory | Accepted | §7.13; B-3; DAC-66, DAC-67 | The inventory now records the applicable access and collection settings (minimum list in DAC-66), who verified each and when. DAC-67 compares every field and every applicable setting |
| CL-37 | V03-04 Deadline enforcement | Accepted (high) | §7.10 deadline options; FS-1; B-10; DAC-35; new DAC-36; R-17; gate | The hard cutoff is enforced at acceptance using Google's timestamp, and is offered only if the form owner confirms the timestamp is reliable. Handling of responses received during the switch-off interval, and how affected applicants are told, must be recorded. A verified automatic close is allowed only with security and privacy approval and rehearsal evidence. Public wording must match the rule as enforced (DAC-36). Release stays blocked until rule and mechanism agree. Also removed the FS-1 sentence claiming that closing the form first "makes the deadline enforceable" (the same overclaim, found while making this correction) |
| CL-38 | — | Bookkeeping | D-08 count and numbering; consistency audit | Count 60; reserved IDs updated; audit re-run on v0.4 |

## Change log (v0.2 → v0.3)

Each entry answers one finding from the independent VALIDATE review of v0.2. No feature was added and the design concept is unchanged. v0.2 is preserved unchanged.

| CL | Finding | Disposition | Sections changed | Correction |
|---|---|---|---|---|
| CL-26 | IV-01 Hosting and security | Accepted | DP-14; §7.8 status note and host row; §7.10 hosting; B-11 / DEC-013; DAC-52; R-13; gate | The header policy is now a proposal approved by the IT / security owner (DEC-013), decided before the host (DEC-006). GitHub Pages is excluded only if DEC-013 makes the headers mandatory |
| CL-27 | IV-02 Registration closure | Accepted (release risk) | FS-1; §7.4 `closesAt`; §7.10 deadline rule, closure procedure, failure responses; B-10; new DAC-34, DAC-35; DAC-65; R-03, R-17; gate | Business rule (hard cutoff or grace window) left to the program lead, with no default. Form switched off first; operator and backup; evidence at the live deadline. The build rule is stated as not closing a deployed site |
| CL-28 | IV-03 Sticky-bar evaluation | Accepted (improvement) | §2.5 | Task, within-subjects design, measures, a numeric "no worse" rule, and its limits (formative evidence, not accessibility conformance) |
| CL-29 | IV-04 Privacy and form fields | Accepted (critical) | §7.4 privacy fields; §7.13; B-3; new DAC-66, DAC-68 | Field inventory with purpose and necessity; website and form notices aligned and approved together, before BUILD |
| CL-30 | IV-05 Empty-state promise | Accepted | D-06 RoleList; DAC-05; D-10 BR-12 | Neutral copy; forward-looking wording only if its exact text is approved |
| CL-31 | IV-06 Desktop header CTA | Accepted | DP-15; §3.4; §4.4; D-06 SiteHeader; DAC-18 | Every CTA placement beyond the hero is now a proposal (DEC-002); DAC-18 made conditional |
| CL-32 | IV-07 Privacy change control | Accepted | §7.13; new DAC-67; R-18 | Material form changes trigger privacy re-approval before the changed form is used; the live form is re-checked against the inventory at every pre-event test |
| CL-33 | — | Bookkeeping | D-08 count and numbering; consistency audit | Count 59; reserved IDs updated; audit re-run on v0.3 |

## Change log (v0.1 → v0.2)

Each entry corrects a defect from the VALIDATE report. No feature was added and the design concept is unchanged. v0.1 is preserved unchanged.

| CL | Defect | Sections changed | Correction |
|---|---|---|---|
| CL-01 | DEF-001 | Legend; §0.2 P-1, P-4, P-7; BR table; §7.12 | `[APPROVED]` replaced by `[BRIEF-STATED]`. A status vocabulary (CONFIRMED / PROPOSED / UNRESOLVED / OUT OF SCOPE) was added. BR table gained Source, Status and Design reference columns. P-1 now blocks BUILD until B-6 |
| CL-02 | DEF-002 | New DP table; §1.2; FS-2; §2.5; §3.1; D-04; D-06; D-08 | 13 design-originated proposals (DP-01 – DP-13) now have IDs and owning decisions. Goals, the `upcoming` state, the sticky bar and thresholds are tagged PROPOSED. Criteria that enforce them are marked conditional |
| CL-03 | DEF-003 | D-08 DAC-16, DAC-30 | Authorized end-to-end external-applicant test with evidence and removal of the test response. DAC-16 checks the form ID and the expected title |
| CL-04 | DEF-004 | §2.4; §7.4; §7.5 (unchanged, now consistent); §7.8; DAC-10, DAC-14 | New `registration.approvedFormId`; the URL must match the exact `viewform` URL; `forms.gle` rejected. States explicitly that URL validation does not prove access |
| CL-05 | DEF-005 | §7.1; §7.8; §7.9; §7.10; DAC-52 | One external stylesheet and no inline CSS or JS, compatible with the strict CSP. The host must support custom headers; GitHub Pages excluded unless DEC-006 accepts the downgrade. DAC-52 lists the required headers instead of a third-party grade |
| CL-06 | DEF-006 | §5.10; D-06 RoleCard, RegisterLink | Accessible names now begin with the visible label; role CTAs append the role title as visually hidden text |
| CL-07 | DEF-007 | DAC-12 | Uniqueness required only for role CTAs |
| CL-08 | DEF-008 | DAC-33 | Pass condition added |
| CL-09 | DEF-009 | G-3; §7.9; DAC-51 | Page weight defined: what is measured, what is included and excluded, fonts counted inside the 150 KB |
| CL-10 | DEF-010 | §2.5; §2.1; §3.2; §4.2; §4.4; §5.10; D-06; DAC-27; new DAC-49 | Sticky bar made conditional on DEC-009 with defined evidence. Height ≥ 500 px rule, `scroll-padding-bottom` for focus, "near footer" defined, no-JS behaviour reconciled |
| CL-11 | DEF-011 | FS-1; §7.4 `closesAt`; §7.10; new DAC-64, DAC-65; B-10 | Deadline behaviour, event-day operator, ≤ 15 min target [PROPOSED], build rule; closure covers both the site and the form |
| CL-12 | DEF-012 | §7.1; §7.6; executive summary | Stack marked UNRESOLVED (DEC-008, B-8). "Team familiarity" inference and the unverified React size removed. ADR stub added. Tailwind recommendation withdrawn |
| CL-13 | DEF-013 | D-08 new DAC-09, 17, 18, 19, 48, 54, 60, 61, 62, 63 | Criteria added for eligibility, conditional help copy, desktop header CTA, contact, full WCAG audit, static-only output, privacy notice, brand, runbook and content guide, rollback |
| CL-14 | DEF-014 | Executive summary; §7.11; P-4; FS-4; §7.13; D-08 numbering note; D-09; crosswalk | B-6 added to the summary. §7.11 lists the actual BUILD-gate blockers. B-5 tied to DEC-007 rather than OD-04. Form consent text placed in B-3. OD-06/07 superseded by DEC-006/008. OD gap and DAC numbering explained. Crosswalk now points Build Instructions to §7.11. The gate heading no longer uses a bare "13." |
| CL-15 | DEF-015 | §7.8; §7.13; §7.4 privacy fields; B-3 | Controller expected to be the organization, with Google as processor; host access logs noted; consent-banner decision assigned to the privacy owner; `privacy.approvalRef` added |
| CL-16 | DEF-016 | §4.2; DAC-28 | Reflow and the fallback without `:has()` defined |
| CL-17 | DEF-017 | §5.10; DAC-29 | Inline-link exemption |
| CL-18 | DEF-018 | D-04 wireframe; DAC-01 | Viewport defined; tagline limit aligned to ≤ 160 characters |
| CL-19 | DEF-019 | §7.9; DAC-50 | Median of 5 runs; FCP added; lab INP replaced with TBT |
| CL-20 | DEF-020 | Executive summary | "One tap from anywhere" narrowed to what the design actually delivers |
| CL-21 | DEF-021 | §0.3; §2.1; §2.4; D-08 wording | Reference commit `b9e9576` recorded; `express` described accurately; Back-button claim qualified; DAC-03, 04, 07, 16, 20, 21, 24, 25, 40, 42 reworded |
| CL-22 | DEF-022 | §7.10; B-4 | Plan terms for organizational use are part of DEC-006 |
| CL-23 | DEF-023 | D-08 count statement | No spec defect. The criteria count is now stated in the document (54; the v0.1 baseline was 41) |
| CL-24 | VALIDATE report, section 6.1 | D-09 §9.3 | RSK-01 – RSK-05 added as R-12 – R-16 |
| CL-25 | VALIDATE report, section 8 | D-09 §9.1, §9.2 | Decisions now use the VALIDATE DEC IDs; each blocker maps to one DEC with a gate and owner role |

---

## Consistency audit (v0.7)

Run by script (`tools/audit_v07.py` in the scratchpad) against this file. These are **self-checks by the author**. They show the document is internally consistent and that each correction from both independent reviews is present in the text. They are not independent validation and do not judge whether a correction is the right one.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Every referenced requirement ID exists | PASS | BR (12), DP (15), FS (9), AF (6), G (5), P (7), A (5), R (21): every reference has a defining row |
| 2 | Every referenced decision ID exists | PASS | DEC (14), OD (12, including 3 superseded), B (12) all defined |
| 3 | Every acceptance criterion is traceable | PASS | 62 DAC rows, no duplicates; each traces to ≥ 1 BR; the D-10 matrix matches the D-08 Traces column for all 12 BRs; unused IDs equal the documented reserved set (39, 55–59, 69) |
| 4 | No proposed feature labelled approved | PASS | No `[APPROVED]` label outside the change logs; no item is CONFIRMED; B-7 names exactly the proposals assigned to DEC-002, and the decision for every other proposal matches the DP table |
| 5 | No critical blocker classed as non-blocking | PASS | DEC-001 – 005 are Critical blockers; DEC-006, 007, 008, 010, 012, 013, 014 are Conditional blockers; none appears in §9.2 |
| 6 | Privacy and data ownership assigned correctly | PASS | B-3 owned by the privacy officer / legal; requires the field and settings inventory |
| 7 | All Register buttons tied to the exact approved destination | PASS | Exact form-ID rule; `forms.gle` appears only as rejected |
| 8 | Security, accessibility and performance don't contradict | PASS | Earlier contradictions still absent; DAC-52 tests the recorded DEC-013 policy; DEC-013 is limited to headers |
| 9 | Executive summary agrees with the detail | PASS | The summary names exactly B-1 – B-12; the §7.11 BUILD-gate list equals the D-09 blockers whose gate is BUILD start |
| 10 | BUILD stated as blocked | PASS | "Final status: NOT APPROVED FOR BUILD" with the gating blockers listed |
| + | Section references resolve | PASS | Every `§x.y` reference matches a heading |
| IV | Each finding from the review of v0.2 (IV-01 – IV-07) still has its correction in the text | PASS | 18 finding-specific checks |
| V03 | Each finding from the review of v0.3 (V03-01 – V03-04) still has its correction in the text | PASS | 15 finding-specific checks: B-7 scope matches the DP table exactly; recorded header policy, DAC-52 evidence; settings in the inventory, B-3, DAC-67; acceptance-based cutoff, switch-off-interval handling, applicant notice, honest wording (DAC-36), automatic-close approvals, FS-1 overclaim removed, B-10 holds until rule and mechanism agree (two checks updated in v0.5 to the revised wording) |
| V04 | Each finding from the review of v0.4 (V04-01 – V04-03) still has its correction in the text | PASS | 12 finding-specific checks: DEC-010 record requires canonical time zone, UTC offset, comparison rule, timestamp source and eligibility procedure; grace window uses the same rule; DAC-37 and DAC-38; B-10 and B-3 updated; OD-13 superseded; B-12 / DEC-014 scope; DEC-013 limited to headers; recorded-vs-eligible wording in the text, DAC-35 and DAC-36 |
| V05 | Each finding from the review of v0.5 (V05-01 – V05-02) still has its correction in the text | PASS | 10 finding-specific checks: DAC-37 records precision as stored or exported and requires the comparison rule to be supportable at it; "to the minute" removed; boundary rule in the DEC-010 record, DAC-36 and B-10; shared test-response rule; DAC-30 and DAC-37 follow it; no criterion simply deletes a test response; DAC-38 classifies logged test responses (four checks updated in v0.7 to the revised wording) |
| V06 | Each finding from the review of v0.6 (V06-01 – V06-02) has its correction in the text | PASS | 13 finding-specific checks: uncertainty intervals for truncate, round and unknown; eligibility defined on the interval; worked examples; separate precision and accuracy conditions in DAC-37; precision failure fails regardless of the boundary rule; old tolerance wording removed; B-10 and DAC-36 use the required resolution; marker verified in every destination; timestamp alone not a marker; exclusion only on a unique match; unresolved rows kept and flagged; tests before first sharing; DAC-38 review set includes flagged rows |

**Not checked by script:** whether each correction is the *right* correction, whether the wording is clear, and whether anything that neither review caught is still wrong. Those need the fresh independent pass.
