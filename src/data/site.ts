// Site-wide configuration. Integration IDs below were carried over from the legacy site.
// HubSpot portal ID and form GUIDs are public identifiers by design (the Forms API v3
// "submit" endpoint is unauthenticated); they are not secrets. Never put private app
// tokens or API keys in this file — anything under src/ ships to the browser.

export const site = {
  name: 'SaaSNova',
  url: 'https://www.saasnova.ai',
  tagline: 'The first operator-led GTM execution engine for cloud marketplaces',
  description:
    'SaaSNova helps SaaS ISVs and channel partners turn cloud marketplaces (AWS, Microsoft Azure and Google Cloud) into a predictable revenue channel. We execute Marketplace GTM, co-sell and partner programs alongside your team, through our flagship programs Ignite, SuperNova and NovaX.',
  locale: 'en_US',
  twitter: undefined as string | undefined,
  emails: {
    general: 'operations@saasnova.ai',
    support: 'support@saasnova.ai',
    marketing: 'marketing@saasnova.ai',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/saasnova/',
    youtube: 'https://www.youtube.com/@SaaSNovaGTM',
    founderLinkedin: 'https://www.linkedin.com/in/jenepherdawson/',
  },
  awsSellerProfile: 'https://aws.amazon.com/marketplace/seller-profile?id=seller-spip3v3ebghaq',
  // SaaSNova's own AWS Marketplace Storefront (every listing, on a saasnova.ai address).
  storefront: 'https://solutions.storefront.saasnova.ai/',
  g2Reviews: 'https://www.g2.com/contributor/saasnova-review-collection-c1949174-3065-46cc-b21d-210e40a34670',
  founder: { name: 'Jen Dawson', title: 'Founder and CEO', former: 'former Global GTM Lead at AWS' },
};

export const integrations = {
  // Primary booking link (legacy site: "Founder strategy session").
  calendly: {
    strategy: 'https://calendly.com/jen-saasnova/founder-strategy-session-scale-your-gtm-via-aws',
    storefront: 'https://calendly.com/jen-saasnova/aws-marketplace-storefront-strategy-meeting',
  },
  ga4: 'G-185EJ40PT4',
  hubspot: {
    portalId: '245317385',
    // Load HubSpot tracking (js.hs-scripts.com) so submissions carry the hutk cookie
    // and are attributed to page views. Off by default: enable once cookie policy is confirmed.
    tracking: false,
    forms: {
      // Legacy contact.html — "Service inquiry"
      serviceInquiry: 'aa170816-bdf0-44f2-a14c-97dd671d1762',
      // Legacy contact.html — "Partnership"
      partnership: '3427559f-e65d-4cfd-b29b-26ba43a79822',
      // Legacy shared.js / newsletter.html / popup.js — newsletter signup
      newsletter: '80375307-028c-4c4f-819c-96dc9e0f6727',
      // Legacy support.html
      support: 'd88c0d3b-b8fc-4f69-887b-abf0a72e4d0d',
      // Legacy fq-source.html
      fqSource: '23f93682-eb5a-4e14-a2bc-61813dae92ed',
      // Legacy partner-aws-gtm.html / partner-azure-gtm.html
      partnerAws: 'aece4860-81f1-445e-90de-fb19aa8dd467',
      partnerAzure: '7454a488-0db9-4644-a745-fc9981a034c1',
    },
  },
  // Future AI assistant endpoint. When set at build time (PUBLIC_CHAT_ENDPOINT), the
  // assistant streams answers from the backend in /api. When empty, it runs in guided mode.
  chatEndpoint: import.meta.env.PUBLIC_CHAT_ENDPOINT ?? '',
};

// THE one booking action. Every "book" button on the site uses this label and link.
export const primaryCta = {
  label: 'Book a 30-min execution strategy session',
  short: 'Get started',
  href: integrations.calendly.strategy,
};
