// Legacy URL → new canonical URL (301). Used by:
//  - scripts/migrate-legacy.mjs (rewriting links inside migrated articles)
//  - scripts/build-cloudfront-function.mjs (generates deploy/cloudfront-function.js)
//  - docs/URL-MIGRATION.md
// Keys are legacy paths WITHOUT ".html" and WITHOUT trailing slash; the edge function
// normalizes ".html", "/index.html" and trailing slashes before lookup.

export const legacyRedirects = {
  '/index': '/',

  // Programs
  '/ignite': '/programs/ignite',
  '/supernova': '/programs/supernova',
  '/novax': '/programs/novax',

  // Solutions (legacy services + acronym pages)
  '/services': '/solutions',
  '/pcmaas': '/solutions/partner-central-migration',
  '/pdmaas': '/solutions/co-sell-execution',
  '/pmmaas': '/solutions/co-marketing',
  '/prmaas': '/solutions/partner-revenue-measurement',
  '/palaas': '/solutions/alliance-leadership',
  '/storefront-saasnova': '/storefront',

  // Partners
  '/partner-carahsoft': '/partners/carahsoft',
  '/partner-saasify': '/partners/saasify',
  '/partner-workspan': '/partners/workspan',
  '/partner-pronix': '/partners/pronix',
  '/partner-aws-gtm': '/community/aws',
  '/partner-azure-gtm': '/community/azure',
  '/partner-gcp-gtm': '/community/gcp',

  // Customers
  '/case-study': '/customers',
  '/results': '/customers',
  '/case-study-dataminr': '/case-studies/dataminr',
  '/dataminr': '/case-studies/dataminr',
  '/case-study-arcticwolf': '/case-studies/arctic-wolf',
  '/arctic-wolf': '/case-studies/arctic-wolf',

  // Insights (blog)
  '/blog': '/insights',
  '/blog-aws-prm-deadline': '/insights/aws-prm-deadline',
  '/blog-aws-alignment': '/insights/aws-alignment',
  '/blog-cloud-marketplace-listing-silent-fix': '/insights/cloud-marketplace-listing-silent-fix',
  '/blog-multi-cloud-gtm': '/insights',
  '/saasnova-hydrolix-blog-stop-buying-software-like-2015': '/insights/stop-buying-software-like-2015',

  // News
  '/news-press': '/news',
  '/press&media': '/news',
  '/press%26media': '/news',
  '/blog-carahsoft-saasnova-accelerating-aws-marketplace-gtm-execution-to-isvs-and-channel-partners': '/news/carahsoft-saasnova-aws-marketplace-gtm',
  '/saasnova-achieves-aws-advanced-tier-partner-status': '/news/aws-advanced-tier-partner',
  '/saasnova-feenix-pr-aws-marketplace-storefront': '/news/feenix-aws-marketplace-storefront',

  // Events
  '/webinars': '/events',

  // Utility / retired
  '/chatbot': '/',
  '/fq-source - Copy': '/fq-source',
  '/404': '/',
};
