# Architecture and technical decisions

## Decision: static Astro site on S3 + CloudFront, with an API behind the same distribution

```
                    ┌──────────────────── CloudFront (www.saasnova.ai) ────────────────────┐
 Browser ──HTTPS──► │ viewer-request: CloudFront Function (301s, clean URLs, apex→www)     │
                    │ response headers policy (HSTS, CSP, frame, referrer)                 │
                    │   /*        → S3 bucket (OAC)       static HTML, assets, feeds        │
                    │   /api/*    → Lambda function URL (OAC, IAM auth, streaming)  [later] │
                    │ AWS WAF: rate-based rule on /api/*                              [later] │
                    └──────────────────────────────────────────────────────────────────────┘
 Browser ──HTTPS──► api.hsforms.com (HubSpot Forms API v3, public submit endpoint)
 Browser ──HTTPS──► calendly.com (booking), googletagmanager.com (GA4)
 Lambda  ──SigV4──► bedrock-mantle.{region}.api.aws (Claude on Amazon Bedrock)            [later]
```

Why this over the alternatives:

| Option | Verdict |
|---|---|
| Keep hand-written HTML (legacy) | Rejected. 49 pages of duplicated nav, footer, forms and inline styles; programs described differently on each page; no build checks. |
| Next.js / SSR on a server | Not needed. The site is content, not an app. SSR adds hosting cost, patching and cold starts, and does not fit the existing S3 + CloudFront setup. |
| **Astro static build** | **Chosen.** Components and data files remove duplication; zero JS by default (11 KB total on the homepage); image optimization at build; output is plain files for S3. |
| AI chatbot inside the site | The chat needs server-side secrets/IAM, rate limiting and logging. It lives in `api/` as a Lambda behind the same CloudFront distribution at `/api/chat`, so the site stays static and same-origin. |

The static build does not limit the future: the chat API, a HubSpot server-side proxy or any
other endpoint attaches as another CloudFront behavior (`/api/*`) without changing hosting.

## Content model

- `src/data/offerings.ts`: the 12 AWS Marketplace listings (program/service, category, summary,
  scope, outcomes, support, listing + private-offer IDs, FAQs). Program and service pages are
  generated from it (`src/pages/programs/[slug].astro`, `src/pages/services/[slug].astro`).
- Content collections (`src/content.config.ts`): `insights` and `news` (Markdown), `campaigns`
  (YAML with typed sections and a form definition). Schemas are validated at build time.
- `src/data/testimonials.ts`, `track-record.ts`, `partners.ts`, `videos.ts`, `nav.ts`: other
  structured content.
- Derived outputs: `/llms.txt`, `/llms-full.txt`, `/assistant-kb.json`, `/insights/rss.xml`,
  `/sitemap-index.xml`, JSON-LD on every page.

## Front end

- Design tokens in `src/styles/global.css` (see DESIGN-AND-CONTENT.md). Scoped component styles.
- Fonts self-hosted via Fontsource (Newsreader, Public Sans variable): no Google Fonts requests.
- Images: brand/person images through `astro:assets` (WebP, responsive `srcset`); article and
  campaign images pre-optimized to WebP in `public/media` and `public/campaigns`.
- JavaScript: header disclosure nav, HubSpot form handler, assistant, YouTube click-to-load,
  contact tabs. No framework runtime.
- Accessibility: skip link, visible focus, semantic landmarks, labelled forms with inline errors
  tied by `aria-describedby`, `aria-live` status, reduced-motion respected. axe: 0 violations.

## Forms

One handler (`src/scripts/hubspot-forms.ts`) for every `<form data-hs-form>`. See
FORMS-AND-INTEGRATIONS.md for the property mapping and the problems found in the legacy forms.

## Security

- No secrets in the front end. HubSpot portal ID and form GUIDs are public identifiers by design.
- The chat API authenticates to Bedrock with its IAM execution role; the function URL requires
  IAM auth and is reachable only through CloudFront (Origin Access Control).
- Abuse controls: WAF rate-based rule, per-instance limiter, reserved concurrency (spend ceiling),
  input validation (roles, lengths, count), origin allowlist, no tools exposed to the model.
- Security headers via a CloudFront response headers policy (`deploy/response-headers-policy.json`).
- Honeypot on every form; HubSpot's own spam checks still apply. If spam grows, add AWS WAF Bot
  Control or move submissions behind `/api/forms` with a CAPTCHA (e.g. AWS WAF CAPTCHA).

## Build pipeline

`npm run build` → Astro build → `postbuild`: generate `deploy/cloudfront-function.js` from
`redirects.mjs` and run `scripts/check-links.mjs` (fails the build on any broken internal link,
asset or redirect target).
