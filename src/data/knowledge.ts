// Assistant knowledge base, built from the same data the pages render.
// Consumed by:
//  - the on-site assistant in guided mode (/assistant-kb.json)
//  - the future live assistant backend (api/chat) as grounding context
//  - /llms.txt and /llms-full.txt for AI search engines
import { offerings, offeringPath, categories } from './offerings';
import { voices } from './testimonials';
import { site, integrations } from './site';

export interface KbEntry {
  id: string;
  title: string;
  answer: string;
  url: string;
  keywords: string[];
}

const company: KbEntry[] = [
  {
    id: 'what-is-saasnova',
    title: 'What SaaSNova does',
    answer:
      'SaaSNova is the first operator-led GTM execution engine for cloud marketplaces. We help SaaS ISVs and channel partners turn AWS, Microsoft Azure and Google Cloud marketplaces into a predictable revenue channel: we execute Marketplace GTM, run co-sell with hyperscaler field teams, launch listings and storefronts, and prepare partners for programs such as ISV Accelerate, BOX and the GenAI Competency. Our flagship programs are Ignite, SuperNova and NovaX. SaaSNova was founded by Jen Dawson, its CEO, a former Global GTM Lead at AWS, and is a women-owned business.',
    url: '/about',
    keywords: ['saasnova', 'who', 'what', 'company', 'about', 'overview', 'women', 'owned', 'founder', 'founded', 'jen', 'dawson', 'ceo', 'team'],
  },
  {
    id: 'not-listed',
    title: 'Not on AWS Marketplace yet',
    answer: 'Start with Ignite, our one-month cloud GTM activation program. It covers ISVs that need a cloud marketplace listing as well as those listed with little or no traction. If you only need the listing built, AWS Marketplace Listing and GTM Launch covers that on its own.',
    url: '/solutions/aws-marketplace-listing',
    keywords: ['listed', 'listing', 'new', 'launch', 'first', 'start', 'yet', 'onboard', 'publish'],
  },
  {
    id: 'pricing',
    title: 'Pricing and how to buy',
    answer:
      'Every SaaSNova program is custom. We scope yours on a 30-minute execution strategy session with Jen, then send a proposal with scope, timeline and investment. You can contract directly, or procure through your cloud marketplace. PRMaaS and PCMaaS are delivered at no cost for eligible partners.',
    url: '/programs#how-buying-works',
    keywords: ['price', 'pricing', 'cost', 'costs', 'fee', 'fees', 'quote', 'budget', 'buy', 'purchase', 'private', 'offer', 'procure', 'procurement', 'contract', 'much'],
  },
  {
    id: 'book',
    title: 'Talk to the team',
    answer:
      'The fastest route is a 30-minute execution strategy session with Jen Dawson. You can also send a message through the contact page, or email operations@saasnova.ai.',
    url: integrations.calendly.strategy,
    keywords: ['book', 'meeting', 'call', 'talk', 'demo', 'contact', 'schedule', 'session', 'speak', 'email', 'reach'],
  },
  {
    id: 'which-program',
    title: 'Which program fits',
    answer:
      'Ignite (1 month, cloud GTM activation) is for Pre-Series A to Series A ISVs that need a listing or have one with little traction. SuperNova (4 months, US market entry) is for Series A to Series B global ISVs expanding in the US. NovaX (6 months, global multi-cloud scale) is for Series A to Series C ISVs building repeatable revenue across AWS, Microsoft Azure and Google Cloud.',
    url: '/programs',
    keywords: ['program', 'programs', 'which', 'fit', 'start', 'stage', 'ignite', 'supernova', 'novax', 'difference', 'compare'],
  },
  {
    id: 'aws-tier',
    title: 'AWS partner status',
    answer:
      'SaaSNova is an AWS Advanced Tier Services Partner (announced September 5, 2026) and was selected as a launch partner for AWS Marketplace Storefront (June 16, 2026). All SaaSNova services are listed on AWS Marketplace.',
    url: '/news',
    keywords: ['advanced', 'tier', 'partner', 'status', 'aws', 'certified', 'launch', 'storefront', 'credentials', 'trust'],
  },
  {
    id: 'support',
    title: 'Support for existing customers',
    answer: 'Existing customers can reach support at support@saasnova.ai or through the support page. Standard response time is 24 hours on business days.',
    url: '/support',
    keywords: ['support', 'help', 'issue', 'problem', 'customer', 'existing', 'escalation', 'response'],
  },
  {
    id: 'channel',
    title: 'Channel partners and distributors',
    answer:
      'SaaSNova works with ISVs and with channel partners, SIs and distributors. Our partners include Carahsoft, SaaSify, WorkSpan and Pronix. Storefront as a Service and Partner Central Migration Readiness are also built for channel partners and distributors.',
    url: '/partners',
    keywords: ['channel', 'distributor', 'reseller', 'si', 'gsi', 'partner', 'partners', 'carahsoft', 'saasify', 'workspan', 'pronix', 'cppo'],
  },
];

const offeringEntries: KbEntry[] = offerings.map((o) => ({
  id: o.slug,
  title: o.name,
  answer: `${o.summary} Best for: ${o.forWho}${o.noCost ? ' Delivered at no cost for eligible partners.' : ' Scoped in a strategy session and procured through an AWS Marketplace private offer.'}`,
  url: offeringPath(o),
  keywords: [
    ...o.short.toLowerCase().split(/[^a-z0-9]+/),
    ...o.name.toLowerCase().split(/[^a-z0-9]+/),
    ...o.includes.flatMap((i) => i.title.toLowerCase().split(/[^a-z0-9]+/)),
  ].filter((k) => k.length > 2),
}));

const faqEntries: KbEntry[] = offerings.flatMap((o) =>
  (o.faq ?? []).map((f, i) => ({
    id: `${o.slug}-faq-${i}`,
    title: f.q,
    answer: f.a,
    url: offeringPath(o),
    keywords: f.q.toLowerCase().split(/[^a-z0-9]+/).filter((k) => k.length > 2),
  })),
);

export const knowledge: KbEntry[] = [...company, ...offeringEntries, ...faqEntries];

// Plain-text corpus for LLM grounding (llms-full.txt and the chat backend).
export function knowledgeAsText(): string {
  const lines: string[] = [];
  lines.push(`# ${site.name}`, '', site.description, '');
  lines.push('## Buying', 'Every program is custom and scoped on a 30-minute strategy session, followed by a proposal. Contract directly or procure through a cloud marketplace.', '');
  for (const c of categories) {
    lines.push(`## ${c.title}`, c.blurb, '');
    for (const o of offerings.filter((x) => x.category === c.id)) {
      lines.push(`### ${o.name}`);
      lines.push(`URL: ${site.url}${offeringPath(o)}`);
      lines.push(`AWS Marketplace listing: https://aws.amazon.com/marketplace/pp/${o.prodview}`);
      if (o.duration) lines.push(`Duration: ${o.duration}`);
      if (o.flagship) lines.push(`Focus: ${o.flagship.tagline}`, `Ideal stage: ${o.flagship.stageRange}. ${o.flagship.idealStage}`, 'What you get:', ...o.flagship.whatYouGet.map((x) => `- ${x}`), 'Impact:', ...o.flagship.impact.map((x) => `- ${x}`));
      if (o.noCost) lines.push('Cost: no cost for eligible partners');
      lines.push(o.summary, `For: ${o.forWho}`);
      lines.push('Includes:', ...o.includes.map((i) => `- ${i.title}: ${i.body}`));
      if (o.notIncluded) lines.push(`Not included: ${o.notIncluded}`);
      lines.push('');
    }
  }
  lines.push('## Customer testimonials (verbatim)');
  for (const v of voices) for (const q of v.quotes) lines.push(`"${q.quote}" (${q.name}, ${q.title})`);
  lines.push('', '## Company', ...company.map((c) => `- ${c.title}: ${c.answer}`));
  return lines.join('\n');
}
