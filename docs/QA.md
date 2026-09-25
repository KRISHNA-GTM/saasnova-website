# QA results (2026-09-25)

All run against the production build (`astro preview`) unless noted.

| Check | Tool | Result |
|---|---|---|
| Type check | `astro check` (75 files) | 0 errors, 0 warnings |
| Build | `npm run build` | 55 routes (50 HTML pages) |
| Internal links, assets, srcsets, redirect targets | `scripts/check-links.mjs` | 3,864 references, 0 broken; 39/39 redirect targets exist; no `.html` links |
| Edge redirects and clean URLs | `npm run test:edge` | 21/21 cases |
| Accessibility (WCAG 2.0/2.1/2.2 A and AA rules) | axe-core on every sitemap page | 46 pages, 0 violations |
| Forms and assistant, end to end | `scripts/test-forms.mjs` (HubSpot intercepted) | 22/22: validation and focus, enum mapping, message composition, honeypot, HubSpot error surfaced, consent, checkbox groups, FQ Source enums, assistant answers, Escape closes |
| Chat API request handling | `api/test-handler.mjs` | 9/9: CORS preflight, method, origin allowlist, JSON, role injection, turn order, length, rate limit |
| Horizontal overflow at 390px | `scripts/shots.mjs` | 21 pages, none |
| Console errors | `scripts/shots.mjs` | none (only the intentional 404 test) |
| Keyboard navigation | manual script | dropdowns open on Enter, close on Escape with focus returned; mobile menu and tabs keyboard-operable |
| Visual review | screenshots at 1440 and 390 | home, programs, Ignite, services, customers, about, contact, FQ Source, articles |

Homepage weight: 52 KB HTML, 34 KB CSS, 11 KB JS, 88 KB images (uncompressed), plus the font
subsets the page uses. The legacy homepage HTML alone was 113 KB plus a 72 KB shared script.

## Not verified here (needs your accounts)
- A live submission reaching HubSpot (tests intercept the request; property names and option
  values were checked against the live HubSpot schema).
- A live Bedrock answer from the chat API.
- CloudFront Function behavior on the real distribution (logic unit-tested in Node).
- Lighthouse / Core Web Vitals on the production domain (run after deploy).

## Re-running
```bash
npm run build
npx astro preview --port 4400            # in a second terminal
BASE=http://localhost:4400 node scripts/a11y.mjs
BASE=http://localhost:4400 node scripts/test-forms.mjs
npm run test
node api/test-handler.mjs                # after: cd api/chat && npm install
```
