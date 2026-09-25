// Main navigation. Edit labels and links here; the header and mobile menu update automatically.
import { offerings, offeringPath } from './offerings';

export interface NavLink { label: string; href: string; desc?: string; badge?: string }
export interface NavGroup { title?: string; links: NavLink[]; featured?: boolean }
export interface NavItem { label: string; href: string; groups?: NavGroup[]; wide?: boolean; footer?: NavLink }

const flagship = offerings.filter((o) => o.kind === 'program');
const pick = (slugs: string[]) =>
  slugs.map((s) => offerings.find((o) => o.slug === s)!).map((o) => ({ label: o.short, href: offeringPath(o) }));

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Solutions',
    href: '/solutions',
    wide: true,
    groups: [
      {
        title: 'Programs',
        featured: true,
        links: flagship.map((o) => ({
          label: o.short,
          href: offeringPath(o),
          desc: `${o.flagship?.tagline} · ${o.duration}`,
        })),
      },
      {
        title: 'Execution solutions',
        links: pick(['co-sell-execution', 'co-marketing', 'alliance-leadership', 'aws-marketplace-listing', 'storefront']),
      },
      {
        title: 'Programs, funding and readiness',
        links: [
          ...pick(['box-funding-readiness', 'genai-competency-readiness', 'partner-revenue-measurement', 'partner-central-migration']),
          { label: 'For channel partners', href: '/solutions/channel-partners' },
        ],
      },
    ],
    footer: { label: 'See every solution', href: '/solutions' },
  },
  { label: 'About', href: '/about' },
  {
    label: 'Partners',
    href: '/partners',
    groups: [
      {
        links: [
          { label: 'Our partners', href: '/partners', desc: 'Carahsoft, SaaSify, WorkSpan, Pronix' },
          { label: 'AWS Marketplace Storefront', href: '/storefront', desc: 'Official launch partner' },
          { label: 'FQ Source', href: '/fq-source', desc: 'With AWS and The Female Quotient' },
          { label: 'Hyperscaler community', href: '/community/aws', desc: 'For AWS, Microsoft and Google Cloud teams' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    href: '/insights',
    groups: [
      {
        links: [
          { label: 'Customer stories', href: '/customers', desc: 'Results, case studies and reviews' },
          { label: 'Insights', href: '/insights', desc: 'Marketplace and co-sell playbooks' },
          { label: 'The Jen GTM Show', href: '/show', desc: 'Episodes on cloud GTM execution' },
          { label: 'Events and webinars', href: '/events', desc: 'Where to meet us next' },
          { label: 'News', href: '/news', desc: 'Announcements and press' },
          { label: 'The Nova Brief', href: '/newsletter', desc: 'Our newsletter' },
        ],
      },
    ],
  },
  { label: 'Careers', href: '/careers' },
  {
    label: 'Contact',
    href: '/contact',
    groups: [
      {
        links: [
          { label: 'Talk to us', href: '/contact', desc: 'Send a message to the team' },
          { label: 'Customer support', href: '/support', desc: 'For current customers' },
        ],
      },
    ],
  },
];
