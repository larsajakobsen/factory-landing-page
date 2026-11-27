# Presenter Nova Consulting Group som leverandør av fabrikken: plan

See [desc.md](desc.md) for the request. The factory built from this plan (policy 0.6, 2026-11-27).

The plan comprehensively addresses all five acceptance criteria, identifies repository constraints correctly, and proposes a minimal, complete implementation. The strategy to follow the repo's existing visual style (blue `#1f4fd6` hero, system fonts) rather than the design system is sound for this static site context. The verbatim text handling with curly apostrophes and em dashes is properly specified for test coverage. Test design is thorough and covers both the happy path and error handling. The note about future `staticwebapp.config.json` for Azure deployment is appropriate for uncertainty reporting.

---

## Implementation plan: Issue #4, "Om Nova Consulting Group" page (approved)

### Context (already checked, no need to look again)
- The repo is a **static site with no build step**. It has `index.html` (inline `<style>`, `lang="en"`, no `<script>`), `tests/landing-page.test.mjs` (`node:test`, which reads the HTML and runs regex checks) and `README.md`. The test command is `node --test tests/`. There is no `package.json`, no `memory.md`, no deploy or hosting configuration and no CI workflow.
- `index.html` has **no main menu**. The page has `header.hero#top` (line ~32), then `<main>`, then `<footer>`. A menu has to be added.
- The tests on `index.html` that must keep passing: no `<script>`, `<form>` or `<iframe>`. No literal `hidden` anywhere in the file, including CSS and attributes. No `display:none`, `visibility:hidden`, `<details>`, `login` or `password`. No `http(s)://` URLs. No `width:` of 4 or more digits in px, and no `100vw`. Both "Get in touch" CTAs stay in the header and footer.
- The sketch (`/workspace/.mockup/1-om-nova-consulting-group.html`) has the H1 "Om Nova Consulting Group" and the lead line "Nova Consulting Group leverer fabrikken." Below that is an English block (`lang="en"`) with two intro paragraphs, an H2 "Who we are" with one paragraph, and a `<dl>` of three cards: EXPERTS 600+, SPECIALIZED AGENCIES 10, ANNUAL REVENUE 950MNOK.
- The design system calls for a black header, Poppins, deep cyan and so on. The repo already has its own look (blue `#1f4fd6` hero, system fonts). **Follow the repo's look** and record the difference in the PR's Uncertainty section, as the design-system skill says to do.

### 1. Location
- `index.html`: add a `<nav>` main menu at the top of `<body>`, before `header.hero` (line ~32), and add its CSS to the existing `<style>` block.
- New file `om-nova-consulting-group.html` at the repo root: the about page.
- New file `404.html` at the repo root: the "page could not be opened" message.
- `tests/landing-page.test.mjs`: add a test for the menu.
- New file `tests/about-page.test.mjs`: tests for the about page and the 404 page.
- `README.md`: optionally, one line listing the new pages.

### 2. Change
1. **Main menu in `index.html`.** Add `<nav class="main-nav" aria-label="Hovedmeny"><ul><li><a href="om-nova-consulting-group.html">Om Nova Consulting Group</a></li></ul></nav>`.
   - Also add a link to the front page (for example "Agent Factory" → `index.html`) so the same menu works on both pages.
   - Use a relative `href` so the link works over `file://` and under a GitHub Pages subpath.
   - CSS: a dark bar, white links, underline on hover, a visible `:focus-visible` outline, and `min-height:44px` tap targets.
   - Do not use the word `hidden` anywhere: no `overflow:hidden` and no `visually-hidden` class.
2. **`om-nova-consulting-group.html`.**
   - Use `<!doctype html>`, `<html lang="no">`, `<meta charset="utf-8">` and the same viewport meta as `index.html`.
   - `<title>Om Nova Consulting Group</title>` plus a short meta description.
   - Repeat the same `<nav>` as in `index.html`. Mark the current item with `aria-current="page"`.
   - Copy the visual styles from `index.html`'s inline `<style>` (body, main, h1, h2, p.lead, footer). There is no shared CSS file today. Keeping each page self-contained matches the repo. A shared `styles.css` is an acceptable alternative, but then the `index.html` tests must still pass.
   - Content:
     - `<h1>Om Nova Consulting Group</h1>`
     - `<p class="lead">Nova Consulting Group leverer fabrikken.</p>`. You may add a sentence linking the factory to the front page, for example "…leverer fabrikken Agent Factory."
     - A `<div lang="en">` (or a `<section lang="en">`) containing, **copied verbatim from the sketch, keeping the curly apostrophes ' and the em dash —**:
       - P1: "Excellence is our foundation. We recruit top talent and champion continuous growth, facilitate collaboration and build a whole stronger than the sum of its parts."
       - P2: "By staying humble, focused, and pragmatic, we make digital excellence easy and build lasting client partnerships."
       - `<section aria-labelledby="who"><h2 id="who">Who we are</h2>` followed by P3: "NOVA Consulting Group is a Scandinavian collective of specialized agencies dedicated to helping clients thrive in the digital era. Since launching our first agency, Epinova, in 2007, we've stayed true to our founders' vision: build the company we'd want to work for—putting people first, fostering deep expertise, and encouraging an entrepreneurial spirit. At NOVA, innovation is driven by experts in focused teams, not massive generalists, and employee co-ownership ensures our people are invested and bring their best ideas."
         - Note that "we've" uses a straight apostrophe, while "founders'" and "we'd" use curly ones, exactly as in the sketch.
       - `<dl class="key-figures">` with three `<div class="card"><dt>…</dt><dd><strong>…</strong></dd></div>`:
         - `Experts` / `600+`
         - `Specialized agencies` / `10`
         - `Annual revenue` / `950MNOK`
         - Uppercase the labels with CSS `text-transform:uppercase` to match the sketch.
         - Layout: a responsive grid, `grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))`, white cards with a thin border.
   - Footer: the same as on the front page. It may keep the "Get in touch" mailto link, but no new contact features (out of scope).
   - Constraints: no `<script>`, no external URLs, no `hidden`, no `login`.
3. **`404.html`** (the error case).
   - `lang="no"`, title "Siden ble ikke funnet", the same nav and styles.
   - `<h1>Siden kunne ikke åpnes</h1>`
   - `<p>Vi fant ikke siden du lette etter. Den kan være flyttet eller midlertidig utilgjengelig.</p>`
   - `<a class="cta" href="index.html">Tilbake til forsiden</a>`
   - Static hosts such as GitHub Pages and Netlify serve `404.html` automatically when a page is missing.

### 3. Tests
In `tests/landing-page.test.mjs`, add:
- **`has a main menu linking to Om Nova Consulting Group`**: in `index.html`, the `<nav[^>]*>…</nav>` block contains `<a[^>]*href="om-nova-consulting-group.html"[^>]*>Om Nova Consulting Group</a>`. This covers AC1 and AC2.

New `tests/about-page.test.mjs` (read `om-nova-consulting-group.html` and `404.html`):
- **`menu target file exists`**: take the `href` from the `index.html` nav link and check with `existsSync` that the file exists. Covers AC1.
- **`title and heading are Om Nova Consulting Group`**: `<title>Om Nova Consulting Group</title>` and `<h1[^>]*>Om Nova Consulting Group</h1>`. Covers AC1.
- **`page has the same main menu`**: the nav contains the link with `aria-current="page"`. Covers AC2.
- **`is public and ungated`**: the same checks as the existing `no gated or hidden content` test, plus no `<script>`, `<form>` or `http(s)://`. Covers AC2.
- **`states that Nova Consulting Group supplies the factory`**: matches `/Nova Consulting Group leverer fabrikken/`. Covers AC3.
- **`shows the English company description verbatim`**: an `includes` check for each of the three exact paragraph strings above (exact characters, including ' and —), for `Who we are`, and that they sit inside a `lang="en"` element. Covers AC3.
- **`shows three key figures with English labels`**: the `<dl>` has exactly 3 `<dt>` elements. The labels match `/Experts/i`, `/Specialized agencies/i` and `/Annual revenue/i`, and the values `600+`, `>10<` and `950MNOK` are present. Covers AC4.
- **`is mobile-ready`**: viewport meta present, no `100vw`, no 4-digit px widths.
- **`404 page explains the error and links home`**: `404.html` exists, has an `<h1>` containing "Siden kunne ikke åpnes", and has `<a[^>]*href="(index\.html|\.\/|\/)"[^>]*>Tilbake til forsiden</a>`. Covers AC5.

Run `node --test tests/`. All existing tests and the new ones must pass.

### 4. Risk
- **Breaking existing index tests.** Avoid the literal strings `hidden`, `login` and `password`, any `http://` URL, and `100vw`. Keep both CTAs in the header and footer. A nav placed *before* `<header class="hero">` does not affect the header and footer CTA regexes. A `<header>` inside the nav would, so do not use one there.
- **Verbatim text drift.** The typographic apostrophes and the em dash can easily get normalised. Paste them exactly, and the tests will catch drift.
- **Mixed languages.** The front page is English, while the menu label and lead line are Norwegian (required by the ACs). Mark the language with `lang` attributes.
- **Style duplication** across three HTML files means future style changes have to be made in several places. This is acceptable for a site this small.
- **Existing coverage**: the 10 index tests cover structure and constraints. No existing tests cover a second page.

### 5. Infrastructure and configuration
None. These are static files only: no new resources, secrets or settings. The repo has no hosting configuration. Serving `404.html` for missing pages depends on the host. It works automatically on GitHub Pages, Netlify and `python3 -m http.server` (only via a direct link there). If the site is later hosted on Azure Static Web Apps, it will need a `staticwebapp.config.json` with `responseOverrides: {"404": {"rewrite": "/404.html"}}`. Do not add that now; mention it in the PR under Uncertainty.

### Differences from the sketch to report in the PR
- The look follows the repo's existing styles, not the design system's black header and Poppins font.
- Key-figure labels are written in sentence case and uppercased with CSS, so they look the same as the sketch but read naturally to screen readers.
- The sketch has no error screen. The 404 page is added to meet the last acceptance criterion.

---
