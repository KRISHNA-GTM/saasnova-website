# SEO, AEO and AI search

## On every page
- Unique `<title>` ("Page | SaaSNova") and meta description, written per page or taken from the
  offering summary.
- Canonical URL on `https://www.saasnova.ai` without trailing slash, matching the sitemap and the
  CloudFront redirects.
- Open Graph and Twitter card tags; default share image `/og/saasnova-default.png` (1200×630);
  articles use their hero image.
- JSON-LD graph: `ProfessionalService` organization (founder, AWS seller profile in `sameAs`, topics),
  plus per page: `WebSite` and `OfferCatalog` (home), `Service` + `FAQPage` (each program and service,
  with the AWS Marketplace listing as the offer URL), `BreadcrumbList`, `BlogPosting` / `NewsArticle`,
  `Person` (about), `VideoObject` (videos), `Event` (event pages).
- One H1, logical heading order, descriptive link text, `alt` text on content images.

## Crawl and index
- `/sitemap-index.xml` (46 URLs), generated at build; privacy and terms stay `noindex` and out of it.
- `/robots.txt` allows all crawlers, as the legacy site did, and points to the sitemap.
- `/insights/rss.xml` feed.
- No content depends on JavaScript to render. The hero motion map, numbers and FAQs are in the HTML,
  so crawlers and AI engines read them (a competitor's animated counters render as "0+" to crawlers).
- Performance: 11 KB of JavaScript on the homepage, self-hosted fonts, responsive WebP images, lazy
  loading below the fold, dimensions on images to avoid layout shift.

## Answer-engine and AI-search optimization
- **Answer-first pages.** Each program and service page opens with a one or two sentence definition
  (the listing summary), then "The situation", "What we do", "What you have at the end", support
  terms and an FAQ. That is the shape AI search engines quote.
- **Consistent facts.** Durations, scope, pricing model and names come from one data file, so every
  page, the FAQ schema, `llms.txt` and the assistant say the same thing. Inconsistency (the legacy site
  gave Ignite as 1 month and 3 months, SuperNova as 4 months) is what makes AI answers unreliable.
- **`/llms.txt`** (link map) and **`/llms-full.txt`** (full offering text, verbatim testimonials,
  company facts). Adoption by search engines is limited, but agentic tools use them and they cost nothing.
- **AWS Marketplace listings are search surfaces too.** AWS Marketplace agent mode and AI search
  summarize listings. Keep listing copy and site copy aligned; update listing resources to link to the
  matching page on saasnova.ai.

## Decision for you: AI training crawlers
The legacy robots.txt allowed GPTBot, CCBot, Google-Extended and similar crawlers, while the Terms of
Use restrict using site content to train AI. The new robots.txt keeps the legacy behavior. If you want
consistency with the Terms, disallow the training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot)
and keep the search and answer crawlers (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot,
Claude-User) allowed: that keeps SaaSNova citable in AI answers. Edit `src/pages/robots.txt.ts`.

## Content plan that would move rankings (recommended)
- Comparison pages buyers search for: "PDM as a service vs hiring a PDM", "AWS Marketplace listing
  services vs doing it yourself", "Ignite vs SuperNova vs NovaX" (exists on /programs).
- Dated explainers with AWS citations: Partner Central in the console, PRM attribution methods, AWS AI
  Competency, multi-product solutions and the September 2026 professional-services fee change.
- One article per listing answering "what it is, who it's for, what's included, how to buy".
