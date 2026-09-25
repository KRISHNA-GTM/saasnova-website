# saasnova.ai (v2)

The SaaSNova website: an operator-led Cloud GTM execution partner for ISVs and channel partners
scaling revenue through AWS. Static site built with [Astro](https://astro.build), hosted on
Amazon S3 + CloudFront, with HubSpot forms, Calendly booking, GA4, and an AI assistant that is
ready to switch from guided mode to live Claude-on-Bedrock answers.

This folder replaces the legacy hand-written HTML site in the parent directory. The legacy files
are untouched and kept only as reference; nothing in this folder depends on them.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/, plus edge function + link check
npm run test       # edge redirect tests + link check (after build)
```

Node 22.12+ is required (tested on Node 24).

## What is where

| Path | Purpose |
|---|---|
| `src/data/offerings.ts` | **Single source of truth** for the 3 programs and 9 services (all 12 AWS Marketplace listings, with listing and private-offer IDs). Pages, nav, footer, JSON-LD, llms.txt and the assistant all read from it. |
| `src/data/testimonials.ts` | Approved customer quotes, verbatim. Do not edit the quote text. |
| `src/data/site.ts` | Contact details and integration IDs (HubSpot portal and form GUIDs, Calendly, GA4). |
| `src/data/redirects.mjs` | Legacy URL → new URL map (drives the CloudFront Function and link rewriting). |
| `src/data/knowledge.ts` | Assistant knowledge base, generated from the data files. |
| `src/content/insights`, `src/content/news` | Articles (Markdown). Migrated from the legacy site. |
| `src/content/campaigns` | Campaign, microsite, co-branded, event and syndication pages (YAML). See `_examples/`. |
| `src/pages/` | Routes. Dynamic routes generate program, service, partner, community and article pages. |
| `src/components/` | Header, Footer, MotionMap (hero), Testimonial, OfferingPage, CampaignPage, Assistant, etc. |
| `src/scripts/hubspot-forms.ts` | One accessible, validated HubSpot Forms API handler for every form. |
| `src/scripts/assistant.ts` | Assistant client (guided mode + streaming live mode). |
| `api/` | Chat API for the live assistant: Lambda (Node 22, streaming) + SAM template + WAF rule. |
| `deploy/` | S3/CloudFront deploy scripts, generated CloudFront Function, security headers policy. |
| `scripts/` | Migration, link checker, edge-function tests, accessibility and form E2E tests, screenshots. |
| `docs/` | Strategy, architecture, URL migration, hosting, assistant, campaigns, SEO, open items. |

## Common tasks

- **Change a program or service description**: edit `src/data/offerings.ts`. Every page that
  mentions it updates on the next build.
- **Publish an article**: add `src/content/insights/<slug>.md` with the frontmatter used by the
  existing files. It appears on /insights, the RSS feed, the sitemap and the homepage.
- **Launch a campaign, event or co-branded page**: copy a template from
  `src/content/campaigns/_examples/`, see [docs/CAMPAIGNS.md](docs/CAMPAIGNS.md).
- **Deploy**: `npm run deploy -- -Bucket <bucket> -DistributionId <id> -Profile <aws-profile>`
  (PowerShell) or `deploy/deploy.sh`. See [docs/HOSTING-AND-DEPLOYMENT.md](docs/HOSTING-AND-DEPLOYMENT.md).

## Documentation

1. [Strategy, positioning and personas](docs/STRATEGY.md)
2. [Architecture and technical decisions](docs/ARCHITECTURE.md)
3. [URL migration and redirects](docs/URL-MIGRATION.md)
4. [Hosting and deployment (S3, CloudFront, GoDaddy DNS)](docs/HOSTING-AND-DEPLOYMENT.md)
5. [Forms and integrations](docs/FORMS-AND-INTEGRATIONS.md)
6. [AI assistant: current state and live rollout](docs/AI-ASSISTANT.md)
7. [Campaign pages](docs/CAMPAIGNS.md)
8. [SEO, AEO and AI search](docs/SEO-AND-AI-SEARCH.md)
9. [Design system and content rules](docs/DESIGN-AND-CONTENT.md)
10. [QA results](docs/QA.md)
11. [Open items that need a decision or confirmation](docs/OPEN-ITEMS.md)
