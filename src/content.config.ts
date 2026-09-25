import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const article = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  author: z.string().default('Jen Dawson'),
  readingTime: z.number().optional(),
  tags: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  legacyPath: z.string().optional(),
  updateNote: z.string().optional(),
  draft: z.boolean().default(false),
});

// ── Campaign pages ─────────────────────────────────────────────
// One YAML file per page in src/content/campaigns/. `kind` controls URL and defaults:
//   campaign | microsite | cobranded | syndication → /campaigns/<slug>
//   event                                      → /events/<slug>
// `path` overrides the URL (used for /fq-source). Drafts are never built.
const field = z.object({
  name: z.string(),                       // HubSpot internal property name
  label: z.string(),
  type: z.enum(['text', 'email', 'tel', 'url', 'select', 'textarea', 'checkboxes']).default('text'),
  required: z.boolean().default(true),
  autocomplete: z.string().optional(),
  half: z.boolean().default(false),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  hint: z.string().optional(),
});
const section = z.discriminatedUnion('type', [
  z.object({ type: z.literal('stats'), items: z.array(z.object({ n: z.string(), l: z.string() })) }),
  z.object({ type: z.literal('text'), heading: z.string(), kicker: z.string().optional(), body: z.array(z.string()), dark: z.boolean().default(false) }),
  z.object({ type: z.literal('points'), heading: z.string(), intro: z.string().optional(), items: z.array(z.object({ title: z.string(), body: z.string(), result: z.string().optional() })), numbered: z.boolean().default(false) }),
  z.object({ type: z.literal('steps'), heading: z.string(), intro: z.string().optional(), items: z.array(z.object({ title: z.string(), body: z.string(), when: z.string().optional() })) }),
  z.object({ type: z.literal('quote'), quote: z.string(), name: z.string(), role: z.string().optional(), dark: z.boolean().default(false) }),
  z.object({ type: z.literal('partners'), heading: z.string(), intro: z.string().optional(), items: z.array(z.object({ name: z.string(), logo: z.string(), body: z.string(), quote: z.string().optional(), quoteBy: z.string().optional() })) }),
  z.object({ type: z.literal('image'), src: z.string(), alt: z.string(), caption: z.string().optional(), width: z.number(), height: z.number() }),
  z.object({ type: z.literal('agenda'), heading: z.string(), items: z.array(z.object({ time: z.string(), title: z.string(), speaker: z.string().optional() })) }),
  z.object({ type: z.literal('speakers'), heading: z.string(), items: z.array(z.object({ name: z.string(), role: z.string(), bio: z.string().optional() })) }),
  z.object({ type: z.literal('faq'), heading: z.string(), items: z.array(z.object({ q: z.string(), a: z.string() })) }),
  z.object({ type: z.literal('cta'), heading: z.string(), body: z.string().optional(), label: z.string(), href: z.string() }),
]);

const campaign = z.object({
  kind: z.enum(['campaign', 'microsite', 'cobranded', 'event', 'syndication']),
  title: z.string(),                      // <title> and H1 fallback
  description: z.string(),
  path: z.string().optional(),
  draft: z.boolean().default(false),
  noindex: z.boolean().default(false),
  campaignId: z.string(),                 // e.g. utm_campaign / HubSpot campaign name; sent as a hidden field
  expires: z.coerce.date().optional(),    // after this date the form closes and the page shows `closedMessage`
  closedMessage: z.string().optional(),
  // AWS co-branding: AWS logos and "Better Together" lockups need written AWS approval.
  // The build fails if awsLogo is true without an approval reference.
  cobrand: z.object({
    logos: z.array(z.object({ src: z.string(), alt: z.string(), height: z.number().default(40) })).default([]),
    awsLogo: z.boolean().default(false),
    awsApprovalRef: z.string().optional(),
  }).optional(),
  hero: z.object({
    kicker: z.string().optional(),
    heading: z.string(),
    body: z.string(),
    badge: z.boolean().default(false),    // SaaSNova AWS Advanced Tier badge
    secondary: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
  event: z.object({
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    location: z.string(),                 // "Online" or venue
    online: z.boolean().default(false),
    url: z.string().optional(),
  }).optional(),
  asset: z.object({ title: z.string(), url: z.string(), format: z.string().default('PDF') }).optional(),
  form: z.object({
    hubspotFormId: z.string(),
    heading: z.string(),
    intro: z.string().optional(),
    submitLabel: z.string(),
    success: z.string(),
    notice: z.string().optional(),
    consent: z.string().optional(),       // renders a required consent checkbox
    gaEvent: z.string().optional(),
    fields: z.array(field),
  }),
  sections: z.array(section).default([]),
  contactEmail: z.string().optional(),
});

export const collections = {
  campaigns: defineCollection({ loader: glob({ pattern: ['**/*.yaml', '!**/_*/**', '!**/_*.yaml'], base: './src/content/campaigns' }), schema: campaign }),
  insights: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/insights' }), schema: article }),
  news: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/news' }), schema: article }),
};
