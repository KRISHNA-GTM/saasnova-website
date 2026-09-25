# Open items: decisions and confirmations needed

## Decided (Sept 2026, Brand Compliance)
- Customer logos (legacy "Trusted by 100+" wall) and storefront logos: shown.
- All legacy testimonials: shown, each on one page only (src/data/testimonials.ts).
- Arctic Wolf and Dataminr: shown as SaaSNova case studies at /case-studies/*.
- Program durations and impact claims (Ignite 1 month, SuperNova 4 months, NovaX 6 months, "3–5X attributable cloud revenue"): restored from the legacy site.
- Positioning: "The first operator-led GTM execution engine" (not "world's first").
- "Services" renamed "Solutions" (/solutions/*).
- AI crawlers: all allowed for GEO/AEO. Terms of Use still restrict AI training, so ask counsel to align them.
- DNS: stay on GoDaddy + S3 + CloudFront; move to Route 53 when the GoDaddy subscription ends (UPDATE-PLAYBOOK.md, Part 7).
- Commit drawdown claim: still removed. Reinstate only after AWS confirms it.

The items below are left over from the first rebuild.

Ordered by impact. Nothing here blocks deployment except item 1.

## Before launch
1. **Attach the CloudFront Function with the first deploy** (HOSTING-AND-DEPLOYMENT.md). Without it,
   every legacy `.html` URL returns 404 once `--delete` removes the old files.
2. **Check whether legacy contact submissions reached HubSpot.** The old contact, FQ Source and
   Azure forms sent dropdown values that are not valid options on the HubSpot properties
   (FORMS-AND-INTEGRATIONS.md). Compare submissions against traffic.
3. **Confirm the AWS logo approval for FQ Source** (`cobrand.awsApprovalRef` in
   `src/content/campaigns/fq-source.yaml`).

## Content and claims to confirm
4. **Customer logos.** The legacy homepage showed 15 logos under "Trusted by 100+ SaaS ISVs"
   (New Relic, Druva, Freshworks, Postman, HashiCorp, Arctic Wolf, Kore.ai, Fastly, BeyondTrust,
   Jamf, ClickHouse, ZoomInfo, Denodo, Safe Security, PharmacoEvidence), and the storefront page showed
   30 more with no stated relationship. None are on the new site. If some are SaaSNova customers
   with permission to show their logo, add them (a logo strip can go under the credentials row).
5. **Other testimonials.** 16 carousel quotes (Safe, SaaSify, Arctic Wolf, AWS staff, Freshworks,
   PharmacoEvidence, Dataminr, WorkSpan, Nexla) and quotes from AWS PDMs on the case studies were not
   carried over. Quotes from AWS employees usually need AWS PR approval. The storefront page keeps the
   AWS Marketplace Storefront product lead's quote from the published press release.
6. **Founder track record.** Arctic Wolf and Dataminr results were delivered during Jen's AWS
   tenure, so they are presented as founder track record at `/track-record/*`, not as SaaSNova
   client results. Confirm this framing (and permission to name both companies).
7. **Program durations.** The site uses the AWS listing durations (Ignite 3–4 weeks, SuperNova 8–10
   weeks, NovaX 6 months). The legacy site said SuperNova was 4 months, and HubSpot options still say
   "1-Month" and "4-Month".
8. **Commit drawdown.** The legacy storefront page said buyers can "draw down against your existing
   commit". Since May 1, 2025 only SaaS listings "Deployed on AWS" count toward commitments, and
   SaaSNova's professional-services listings show "Deployed on AWS: No". The claim was removed;
   confirm with your AWS contacts before reinstating it.
9. **Team page.** The team is listed by first name and role, as on the legacy site. Headshots and
   surnames would read more credibly to enterprise buyers.
10. **Hydrolix guest post** is written in Hydrolix's voice by Kaitlyn Bany. Confirm republication
    rights; it is now labelled as a guest perspective.
11. **Carahsoft announcement date.** The legacy post had no date; the new site uses 2026-08-26 (the
    file's last-modified date). Correct it in `src/content/news/carahsoft-saasnova-aws-marketplace-gtm.md`.
12. **Pronix website URL** was not in the legacy site, so the Pronix page has no "Visit" link.
13. **SaaSify bundle page.** The legacy site linked to `/aws-partner-starter-bundle-with-saasify-saasnova/`,
    which never existed. The new SaaSify page links to the EIN Presswire release instead.
14. **Legal pages** were migrated verbatim ("Last updated: March 2026"). They describe SaaSNova as an
    "independent advisory firm", which conflicts with the execution positioning, and the privacy policy
    should list GA4, HubSpot and YouTube (click-to-load). Ask counsel to review.

## Decisions for you
15. **AI training crawlers**: allowed today (legacy policy) although the Terms restrict AI training
    (SEO-AND-AI-SEARCH.md).
16. **HubSpot tracking script**: off by default; turning it on improves attribution and sets
    marketing cookies (FORMS-AND-INTEGRATIONS.md).
17. **HubSpot property options** to add, and a dedicated Google Cloud community form.
18. **DNS**: move to Route 53 or keep GoDaddy with forwarding for the bare domain.
19. **Live assistant**: Bedrock model access (Opus 5 access criteria vary by account), region, and a
    spend budget (AI-ASSISTANT.md).
20. **Scheduled rebuilds** so expired events and campaigns drop off automatically.

## Housekeeping in the legacy folder (after launch)
- `fq-source - Copy.html` contains internal draft notes ("TKTK — confirm with Jen…"). It is not in the
  new build, and the deploy's `--delete` removes it from S3. Delete it from the repository too.
- `_redirects`, `.nojekyll`, the legacy 404.html script, `chatbot.js`, `shared.js`, `popup.js` are
  superseded by the new site.
- `images/thefemalequotient-screencapture-…png` is 27 MB and unused by the new site.
