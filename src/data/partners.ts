// Ecosystem partners. Scope of each partnership taken from the legacy partner pages.
import carahsoft from '../assets/images/carahsoft.svg';
import saasify from '../assets/images/saasify-logo.png';
import workspan from '../assets/images/workspan-logo.jpeg';
import pronix from '../assets/images/pronix_inc_logo.jpeg';
import { integrations } from './site';

export const partners = [
  {
    slug: 'carahsoft',
    name: 'Carahsoft',
    type: 'Distribution and public sector',
    logo: carahsoft,
    url: 'https://www.carahsoft.com' as string | undefined,
    headline: 'Channel and public sector reach, with Marketplace execution behind every deal.',
    summary:
      'Carahsoft brings its public sector and technology distribution ecosystem. SaaSNova brings hands-on AWS Marketplace execution, so ISVs can sell through the channel with clean operations.',
    points: [
      { t: 'Public sector access', b: 'Carahsoft’s role as a government aggregator helps move ISV solutions into regulated and public sector accounts.' },
      { t: 'Channel Partner Private Offers', b: 'Carahsoft handles the CPPO transaction while SaaSNova keeps listing, offer and co-sell operations clean.' },
      { t: 'Co-sell alignment', b: 'Channel deals connected to the workflows AWS field teams use, so they are tagged correctly and visible.' },
      { t: 'AWS Marketplace Storefront', b: 'Multi-partner solution bundles, campaign-led GTM and channel lead routing built on AWS Marketplace Storefront.' },
    ],
    cta: { label: 'Book a storefront strategy meeting', href: integrations.calendly.storefront },
    video: undefined as string | undefined,
    news: '/news/carahsoft-saasnova-aws-marketplace-gtm',
  },
  {
    slug: 'saasify',
    name: 'SaaSify',
    type: 'Marketplace infrastructure',
    logo: saasify,
    url: 'https://saasify.ai',
    headline: 'Listing infrastructure and GTM execution, running in parallel.',
    summary:
      'SaaSify runs marketplace operations and automation. SaaSNova runs GTM strategy and AWS field alignment. Together they launched the SaaSNova × SaaSify AWS Partner Starter Bundle in May 2026.',
    points: [
      { t: 'Parallel execution', b: 'GTM, Partner Central readiness and Marketplace activation at the same time, instead of one waiting on the other.' },
      { t: 'AWS Partner Starter Bundle', b: 'A joint offer to help ISVs become Marketplace-ready and co-sell ready in weeks.' },
      { t: 'Partner Revenue Measurement', b: 'SaaSNova and SaaSify have worked together on PRM activation for ISVs, including a joint PRM webinar.' },
      { t: 'In the field together', b: 'Joint presence at RSA Conference 2026 in San Francisco.' },
    ],
    cta: { label: 'Book a strategy session', href: integrations.calendly.strategy },
    video: undefined as string | undefined,
    news: 'https://www.einpresswire.com/article/908400568/saasify-and-saasnova-launch-the-first-aws-partner-starter-bundle-to-help-isvs-go-marketplace-co-sell-ready-in-weeks',
  },
  {
    slug: 'workspan',
    name: 'WorkSpan',
    type: 'Co-sell platform',
    logo: workspan,
    url: 'https://workspan.com',
    headline: 'Co-sell tracking, paired with the people who run the motion.',
    summary:
      'WorkSpan gives alliance teams visibility and tracking across hyperscaler co-sell. SaaSNova provides the execution that fills that pipeline and keeps it accurate.',
    points: [
      { t: 'Synchronized motions', b: 'GTM operations kept aligned with the data in your co-sell platform.' },
      { t: 'Field reality in the CRM', b: 'Closing the gap between what happens with AWS sellers and what your systems record.' },
      { t: 'Leadership visibility', b: 'Partnership activity structured so it reports clearly to executives.' },
    ],
    cta: { label: 'Book a strategy session', href: integrations.calendly.strategy },
    video: 'JUNjzyUfLO0',
    news: undefined as string | undefined,
  },
  {
    slug: 'pronix',
    name: 'Pronix',
    type: 'Systems integrator',
    logo: pronix,
    url: undefined as string | undefined,
    headline: 'SI delivery and cloud GTM execution, aligned from day one.',
    summary:
      'Pronix brings systems integration and enterprise deployment. SaaSNova aligns that delivery with the commercial motion on cloud marketplaces, scoped to the ISV’s cloud mix and revenue targets.',
    points: [
      { t: 'Integration integrity', b: 'Technical delivery standards maintained while alliance motions move quickly.' },
      { t: 'Delivery tied to GTM', b: 'Delivery milestones aligned with market positioning and co-sell plans.' },
      { t: 'Multi-cloud scope', b: 'Work scoped across AWS, Microsoft Azure and Google Cloud as the ISV requires.' },
    ],
    cta: { label: 'Book a strategy session', href: integrations.calendly.strategy },
    video: 'omjoyPB7roQ',
    news: undefined as string | undefined,
  },
];

export type Partner = (typeof partners)[number];
