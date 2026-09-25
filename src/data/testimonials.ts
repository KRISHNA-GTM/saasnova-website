// APPROVED TESTIMONIALS. DO NOT EDIT QUOTE TEXT.
// Every quote below was already approved and published on the saasnova.ai site (legacy homepage
// carousel, case studies, storefront page and press releases) or approved by SaaSNova leadership
// (Simplesense, GuardDog, Sept 2026). Wording and punctuation are verbatim.
//
// RULE: each quote appears on exactly ONE page. `page` decides where:
//   'home'        → the interactive testimonial wall on the homepage
//   'arctic-wolf' → /case-studies/arctic-wolf
//   'dataminr'    → /case-studies/dataminr
//   'storefront'  → /storefront
// To add a new testimonial: copy one block, change the fields, pick a page. Add the logo file to
// src/assets/images/ and import it at the top.
import simplesenseLogo from '../assets/images/simplesense-logo-trim.png';
import guarddogLogo from '../assets/images/guarddog-logo-trim.png';
import safeLogo from '../assets/images/Safe one Light-logo.svg';
import saasifyLogo from '../assets/images/saasify-logo.png';
import arcticLogo from '../assets/images/arcticwolf-trim.png';
import awsLogo from '../assets/images/aws-logo.png';
import freshworksLogo from '../assets/images/freshworks-logo-png.png';
import pharmaLogo from '../assets/images/pharmocoevidence-logo.png';
import dataminrLogo from '../assets/images/dataminr-logo-trim.png';
import workspanLogo from '../assets/images/workspan-logo.jpeg';
import nexlaLogo from '../assets/images/nexla-logo.png';

export type Page = 'home' | 'arctic-wolf' | 'dataminr' | 'storefront';

export interface Quote {
  id: string;
  quote: string;
  name: string;
  title: string;
  page: Page;
}

export interface Voice {
  id: string;
  company: string;
  logo: ImageMetadata;
  /** One-line outcome shown as a highlight chip next to the quotes (homepage). */
  highlight?: string;
  quotes: Quote[];
}

export const voices: Voice[] = [
  {
    id: 'simplesense',
    company: 'Simplesense',
    logo: simplesenseLogo,
    highlight: '$40K+ in AWS credits and funding unlocked',
    quotes: [
      {
        id: 'simplesense-eric',
        page: 'home',
        quote:
          'For a small business with limited capacity, success with a large channel partner like AWS can be a challenge. SaaSNova has been a force multiplier in accelerating our AWS strategy, helping us launch more listings on AWS Marketplace, unlock over $40K in credits and funding, and bring clarity to how we engage AWS through their Ignite GTM program. Their guidance enabled us to move faster with clarity. I would recommend SaaSNova’s GTM services to any startup looking to accelerate their AWS strategy and implementation.',
        name: 'Eric',
        title: 'CEO, Simplesense',
      },
    ],
  },
  {
    id: 'guarddog',
    company: 'GuardDog',
    logo: guarddogLogo,
    highlight: 'Listed on AWS Marketplace in one week, after two years of trying',
    quotes: [
      {
        id: 'guarddog-kelly',
        page: 'home',
        quote:
          'SaaSNova helped us launch our first SaaS listing on AWS Marketplace in just one week, after nearly two years of trying to navigate the process on our own. Their expertise, clarity, and hands-on guidance made an otherwise complex transition to the new AWS Partner Central experience feel simple. SaaSNova didn’t just help us get listed; they helped us finally establish our presence on AWS and move our product to market with confidence.',
        name: 'Kelly Ryan',
        title: 'CCO, GuardDog',
      },
    ],
  },
  {
    id: 'safe',
    company: 'SAFE Security',
    logo: safeLogo,
    highlight: 'Months of internal effort compressed into weeks',
    quotes: [
      {
        id: 'safe-nicola',
        page: 'home',
        quote:
          'SaaSNova was instrumental in accelerating SAFE’s AWS Marketplace strategy. They helped us compress months of internal effort into weeks, sharpen our enterprise positioning, and launch TPRM with a procurement-ready workflow.',
        name: 'Nicola Sanna',
        title: 'President, SAFE Security',
      },
      {
        id: 'safe-michael',
        page: 'home',
        quote:
          'SaaSNova helped us move through AWS programs, Marketplace requirements, and internal alignment in a fraction of the time it normally takes, compressing months of work into weeks.',
        name: 'Michael Nagao',
        title: 'SVP Worldwide Channel, SAFE Security',
      },
      {
        id: 'safe-gary',
        page: 'home',
        quote:
          'SaaSNova isn’t a platform, they’re the operator behind our AWS Marketplace success. They bring the GTM clarity, commercial alignment, and end-to-end ownership that no tool can provide.',
        name: 'Gary Cronk',
        title: 'Director, Strategic Partners, SAFE Security',
      },
      {
        id: 'safe-jagdish',
        page: 'home',
        quote:
          'The joint AWS partnership page is a critical proof point for SAFE, and Jen’s wireframe was thorough, thoughtfully structured, and partner-ready from day one.',
        name: 'Jagdish Upadhyay',
        title: 'VP of Marketing, SAFE Security',
      },
    ],
  },
  {
    id: 'pharmacoevidence',
    company: 'PharmacoEvidence',
    logo: pharmaLogo,
    highlight: 'Months of cloud GTM delivered in a few weeks',
    quotes: [
      {
        id: 'pharma-rajdeep',
        page: 'home',
        quote:
          'SaaSNova brought a level of clarity and execution we had never experienced before. Jen helped us navigate AWS Marketplace listings, modernize our architecture, and build a precise, end-to-end path toward the AWS GenAI Competency. What sets SaaSNova apart is the operator-led partnership, fast, structured, and relentlessly outcome-driven. They accelerated end-to-end cloud GTM and Marketplace execution that would have taken us months into just a few weeks, elevating Pharmacoevidence’s global credibility.',
        name: 'Rajdeep Kaur',
        title: 'Associate Director & Lead, AI Sciences, PharmacoEvidence',
      },
      {
        id: 'pharma-barinder',
        page: 'storefront',
        quote:
          'As a global ISV organization, having a partner like SaaSNova gives us a strategic advantage in how we continue to grow our customer reach through new features such as the AWS Marketplace Storefront. Their operator-level understanding of cloud GTM helped us move faster, simplify Marketplace operations, and unlock new revenue pathways with AWS.',
        name: 'Barinder Singh',
        title: 'CEO, PharmacoEvidence',
      },
    ],
  },
  {
    id: 'nexla',
    company: 'Nexla',
    logo: nexlaLogo,
    highlight: 'Hidden co-sell blockers found and cleared',
    quotes: [
      {
        id: 'nexla-jayashree',
        page: 'home',
        quote:
          'SaaSNova didn’t just clarify our AWS GTM motion, they exposed issues we didn’t even know were blocking us. Their operator-level mastery of Marketplace, ACE, co-sell, and partner programs is unmatched.',
        name: 'Jayashree Rajan',
        title: 'CMO, Nexla',
      },
    ],
  },
  {
    id: 'freshworks',
    company: 'Freshworks',
    logo: freshworksLogo,
    highlight: 'Three-year strategic collaboration with AWS',
    quotes: [
      {
        id: 'freshworks-abhishek',
        page: 'home',
        quote:
          'Jen is one of the most dynamic and driven leaders I’ve worked with Freshworks. She built the alignment and relationships needed to secure a three-year strategic collaboration with AWS and set the foundation for a scalable co-sell motion. She consistently turns challenges into opportunities.',
        name: 'Abhishek GP',
        title: 'VP of Growth at Atlan (and former Head of Growth at Freshworks)',
      },
    ],
  },
  {
    id: 'workspan',
    company: 'WorkSpan',
    logo: workspanLogo,
    highlight: 'Freshworks, Postman and WorkSpan partner motions moved forward',
    quotes: [
      {
        id: 'workspan-amit',
        page: 'home',
        quote:
          'Jen is one of the most effective GTM operators I’ve worked with. Across Freshworks, Postman, and Workspan, she brought a level of clarity, structure, and execution discipline that consistently moved our AWS partner motions forward. She has a rare ability to turn complex, ambiguous GTM challenges into aligned, high-velocity execution. Her impact is immediate, repeatable, and deeply felt across every team she works with.',
        name: 'Amit Sinha',
        title: 'President, WorkSpan',
      },
    ],
  },
  {
    id: 'saasify',
    company: 'SaaSify',
    logo: saasifyLogo,
    highlight: 'The GTM activation layer on top of the listing',
    quotes: [
      {
        id: 'saasify-manesh',
        page: 'home',
        quote:
          'A listing creates visibility. Automation and GTM precision create momentum. SaaSNova brings the GTM activation layer to turn cloud visibility into real cloud momentum.',
        name: 'Manesh Raveendran',
        title: 'CEO and Founder, SaaSify',
      },
      {
        id: 'saasify-kevin',
        page: 'home',
        quote:
          'Winning on AWS, Azure, and GCP takes more than just getting listed. The partners that are actually building pipeline are the ones who’ve figured out how to align their story with what sellers care about inside those clouds. That’s the GTM layer most partners are missing, and exactly what SaaSNova helps unlock and why we are so excited about this partnership.',
        name: 'Kevin Flitcroft',
        title: 'Head of Sales, SaaSify',
      },
    ],
  },
  {
    id: 'aws',
    company: 'AWS field teams',
    logo: awsLogo,
    highlight: 'What AWS partner teams say',
    quotes: [
      {
        id: 'aws-megha',
        page: 'home',
        quote:
          'SaaSNova delivers the kind of GTM and partnership content the industry actually needs, practical, insightful, and grounded in real operator experience. Jen has built something truly differentiated for the cloud and SaaS ecosystem.',
        name: 'Megha Malhotra',
        title: 'AWS Technical Manager',
      },
      {
        id: 'aws-john',
        page: 'arctic-wolf',
        quote:
          'Jen’s GTM architecture fundamentally changed how Arctic Wolf engaged with AWS. The structure, clarity, and discipline she brought created a level of alignment we rarely see with security partners.',
        name: 'John McElhone',
        title: 'Partner Development Manager, AWS',
      },
      {
        id: 'aws-gunjan',
        page: 'dataminr',
        quote:
          'Jen’s GTM architecture elevated Dataminr’s entire AWS motion. The structure and discipline she brought created the kind of alignment and seller confidence we rarely see from ISVs.',
        name: 'Gunjan Ramketa',
        title: 'Partner Development Manager, AWS',
      },
    ],
  },
  {
    id: 'arctic-wolf',
    company: 'Arctic Wolf',
    logo: arcticLogo,
    quotes: [
      {
        id: 'arctic-megan',
        page: 'arctic-wolf',
        quote:
          'The structure of the pilot program exceeded all expectations. The data-driven full funnel planning model challenged us to think in ways we haven’t thought of before.',
        name: 'Megan Flanagan',
        title: 'VP Marketing, Arctic Wolf Networks',
      },
      {
        id: 'arctic-odin',
        page: 'arctic-wolf',
        quote:
          'It was great to hear what has been done well with an AWS best ISV. The co-sell scoring discussion was eye-opening to us.',
        name: 'Odin Olson',
        title: 'VP Partnerships & Alliances, Arctic Wolf Networks',
      },
    ],
  },
  {
    id: 'dataminr',
    company: 'Dataminr',
    logo: dataminrLogo,
    quotes: [
      {
        id: 'dataminr-fraser',
        page: 'dataminr',
        quote: 'The architecture gave Dataminr the credibility sellers and AWS senior leaders needed to lean in.',
        name: 'Fraser Charles',
        title: 'Senior Director, Partner Ecosystems, Dataminr',
      },
    ],
  },
];

/** Companies with at least one quote on the given page, keeping only that page's quotes. */
export const voicesFor = (page: Page) =>
  voices
    .map((v) => ({ ...v, quotes: v.quotes.filter((q) => q.page === page) }))
    .filter((v) => v.quotes.length > 0);

/** Flat list of quotes for a page, each with its company. */
export const quotesFor = (page: Page) =>
  voicesFor(page).flatMap((v) => v.quotes.map((q) => ({ ...q, company: v.company, logo: v.logo })));

/** AWS Marketplace Storefront launch quote (from the published AWS press release). */
export const storefrontLaunchQuote = {
  quote:
    'We’re excited to have SaaSNova as a launch partner for AWS Marketplace Storefront. Their hands-on experience supporting ISVs and channel partners, combined with their ability to operationalize cloud GTM motions, makes them a strong partner for helping organizations adopt Storefront quickly and effectively.',
  name: 'Hussein Khazaal',
  title: 'Sr. Manager of Product, AWS Marketplace Storefront, Amazon Web Services',
};

export const g2ReviewUrl =
  'https://www.g2.com/contributor/saasnova-review-collection-c1949174-3065-46cc-b21d-210e40a34670';
