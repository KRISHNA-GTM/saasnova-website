// Single source of truth for SaaSNova's AWS Marketplace professional-services listings.
// Source: Ref-SN/*.md (AWS Marketplace listing captures). Every offer is priced by private offer.
// Keep copy factual to the listings; do not add durations, outcomes or claims not in the source.

export type CategoryId = 'programs' | 'marketplace' | 'cosell' | 'programs-funding' | 'readiness';

export interface Offering {
  slug: string;                // URL segment under /programs or /services
  kind: 'program' | 'service';
  category: CategoryId;
  name: string;                // Display name on site
  short: string;               // Short name used in nav and lists
  listingTitle: string;        // Exact AWS Marketplace listing title
  prodview: string;            // AWS Marketplace product page id
  productId: string;           // Procurement product id (for private offer requests)
  noCost?: boolean;            // Delivered at no cost for eligible partners
  duration?: string;           // Only when stated in the listing
  stage?: string;              // Program stage label
  summary: string;             // One or two sentences, used in cards and meta descriptions
  forWho: string;              // Who it is for
  problem: string;             // The situation that brings buyers here
  includes: { title: string; body: string }[];
  outcomes: string[];          // What the buyer has at the end (from the listing)
  support: string;             // Support model from the listing
  notIncluded?: string;        // Scope boundaries stated in the listing
  related: string[];           // slugs
  faq?: { q: string; a: string }[];
  /** Flagship program card content (Ignite, SuperNova, NovaX). */
  flagship?: {
    tagline: string;           // e.g. "Cloud GTM Activation"
    whatYouGet: string[];
    impact: string[];
    idealStage: string;
    stageRange: string;        // e.g. "Pre-Series A → Series A"
    clouds: string;
  };
}

const MP = 'https://aws.amazon.com/marketplace';
export const sellerProfileUrl = `${MP}/seller-profile?id=seller-spip3v3ebghaq`;
export const listingUrl = (o: Pick<Offering, 'prodview'>) => `${MP}/pp/${o.prodview}`;
export const privateOfferUrl = (o: Pick<Offering, 'prodview' | 'productId'>) =>
  `${MP}/professionalservices/procurement?productId=${o.productId}&redirectUrl=${encodeURIComponent(`${MP}/pp/${o.prodview}`)}`;
export const offeringPath = (o: Pick<Offering, 'kind' | 'slug'>) =>
  o.kind === 'program' ? `/programs/${o.slug}` : `/solutions/${o.slug}`;

export const categories: { id: CategoryId; title: string; blurb: string }[] = [
  {
    id: 'programs',
    title: 'Programs',
    blurb: 'Ignite, SuperNova and NovaX: custom programs that take an ISV from first listing to repeatable multi-cloud revenue.',
  },
  {
    id: 'marketplace',
    title: 'Marketplace launch and storefronts',
    blurb: 'Get the listing built, approved and positioned, and put Marketplace buying inside your own website.',
  },
  {
    id: 'cosell',
    title: 'Co-sell and partner execution',
    blurb: 'The partner development, alliance and partner marketing roles, run by our operators instead of new hires.',
  },
  {
    id: 'programs-funding',
    title: 'AWS programs and funding',
    blurb: 'Structured readiness for AWS programs that unlock funding, incentives and field priority.',
  },
  {
    id: 'readiness',
    title: 'AWS partner compliance',
    blurb: 'Time-bound engagements that keep you eligible as AWS changes how partners are measured and managed.',
  },
];

export const offerings: Offering[] = [
  // ─── Programs ────────────────────────────────────────────────
  {
    slug: 'ignite',
    kind: 'program',
    category: 'programs',
    name: 'SaaSNova Ignite',
    short: 'Ignite',
    listingTitle: 'SaaSNova Ignite: AWS Marketplace GTM Activation Program',
    prodview: 'prodview-tt24ttcbu2wh2',
    productId: 'prod-6d3ntp6qmppcg',
    duration: '1 month',
    stage: 'Activate',
    flagship: {
      tagline: 'Cloud GTM Activation',
      whatYouGet: [
        'Optimized Marketplace listing',
        'Cloud-aligned Better Together messaging',
        'Partner portal readiness',
        'Marketplace score & hygiene review',
        'Early co-sell activation',
        'Next-stage scaling roadmap',
      ],
      impact: ['Baseline alignment', 'Foundational GTM messaging', 'Early co-sell activation', 'Marketplace GTM foundation'],
      idealStage: 'For ISVs needing a cloud marketplace listing, or those already listed with little to no traction.',
      stageRange: 'Pre-Series A → Series A',
      clouds: 'AWS, Microsoft Azure or Google Cloud',
    },
    summary:
      'A one-month activation program for ISVs that need a cloud marketplace listing, or are listed with little to no traction. We optimize the listing, align partner portal workflows and start early co-sell motions on AWS, Microsoft Azure or Google Cloud.',
    forWho: 'Pre-Series A to Series A ISVs that need a cloud marketplace listing, or are listed with little to no traction.',
    problem:
      'The listing is live, but it is not producing subscribers, AWS sellers are not engaging, and nobody inside the company owns the Partner Central workflows AWS expects.',
    includes: [
      {
        title: 'Listing validation and cleanup',
        body: 'We validate the listing, correct configuration issues and fix the Marketplace hygiene that stops buyers and AWS reviewers from taking it seriously.',
      },
      {
        title: 'Partner Central alignment',
        body: 'Required Partner Central workflows set up and owned, with the right operational and GTM owners identified on your side.',
      },
      {
        title: 'Early co-sell activation',
        body: 'Working sessions, opportunity structure cleanup and foundational Better Together messaging so you can engage AWS field teams with confidence.',
      },
      {
        title: 'ISV Accelerate groundwork',
        body: 'Correct ISVA mapping, clean opportunity structure and the baseline alignment AWS expects before an ISV progresses toward ISV Accelerate.',
      },
    ],
    outcomes: [
      'A validated, corrected Marketplace listing',
      'Partner Central workflows aligned and owned',
      'Initial AWS field engagement under way',
      'Early co-sell signals in place for future ISV Accelerate eligibility',
    ],
    support:
      'Founder-led support for the full sprint. Standard support includes phone access with a 24-hour response time on business days; Priority support adds scheduled working sessions and real-time guidance during early co-sell motions.',
    related: ['supernova', 'aws-marketplace-listing', 'co-sell-execution'],
    faq: [
      {
        q: 'Do we need to be listed on a cloud marketplace before Ignite?',
        a: 'No. Ignite covers ISVs that still need a listing on AWS, Microsoft Azure or Google Cloud Marketplace, as well as those already listed with little or no traction.',
      },
    ],
  },
  {
    slug: 'supernova',
    kind: 'program',
    category: 'programs',
    name: 'SaaSNova SuperNova',
    short: 'SuperNova',
    listingTitle: 'SaaSNova SuperNova: AWS Marketplace GTM Expansion Program',
    prodview: 'prodview-tf2hvg57dyfca',
    productId: 'prod-qyepxwnxwmpho',
    duration: '4 months',
    stage: 'Expand',
    flagship: {
      tagline: 'US Market Entry',
      whatYouGet: [
        'Verified US co-sell opportunities',
        'First US cloud-attributable signal',
        'PRM implemented & consumption data',
        'Executive US GTM evidence package',
        'US partner + channel map',
        'ISV Accelerate progression proof',
      ],
      impact: [
        '2–4X stronger US field engagement',
        '40–60% fewer US co-sell rejections',
        '1–2 quarters earlier US visibility',
        'Validated US GTM traction',
      ],
      idealStage: 'Global ISVs expanding in the US with cloud traction.',
      stageRange: 'Series A → Series B',
      clouds: 'AWS, Microsoft Azure and Google Cloud',
    },
    summary:
      'A four-month US market entry program for global ISVs with cloud traction. We deliver verified US co-sell opportunities, the first US cloud-attributable signal, PRM and consumption data, and an executive US GTM evidence package.',
    forWho: 'Series A to Series B global ISVs expanding in the US with cloud traction.',
    problem:
      'You have early traction, but AWS sellers in the U.S. do not yet know your solution, and expansion depends on a plan that AWS partner teams and investors can both follow.',
    includes: [
      {
        title: 'U.S. market entry roadmap',
        body: 'A documented roadmap reviewed with AWS Partner Development Managers and aligned to the steps required in Partner Central, with milestones you can report against.',
      },
      {
        title: 'Better Together messaging',
        body: 'A joint messaging framework finalized with AWS, so field sellers understand where your solution fits alongside AWS services.',
      },
      {
        title: 'AWS field enablement',
        body: 'At least one enablement session delivered to AWS field sellers to build confidence in your solution and your growth plan.',
      },
      {
        title: 'Optional paid media management',
        body: 'Add-on placement of your offers in publications, newsletters and community channels to drive high-intent traffic. Results scale with media investment.',
      },
    ],
    outcomes: [
      'An investor-ready, AWS-aligned GTM expansion plan',
      'Better Together messaging reviewed with AWS partner teams',
      'At least one AWS field seller enablement session delivered',
      'Documented expansion milestones',
    ],
    support:
      'Email and Slack support with a 24-hour response time on business days, and a dedicated GTM strategist. Priority support adds scheduled enablement sessions and roadmap reviews coordinated with AWS Partner Development Managers.',
    related: ['ignite', 'novax', 'co-marketing'],
    faq: [
      {
        q: 'Do we need to complete Ignite first?',
        a: 'SuperNova is designed for ISVs post-Ignite. If you already have comparable Marketplace fundamentals and co-sell signals, we confirm that in the initial session.',
      },
    ],
  },
  {
    slug: 'novax',
    kind: 'program',
    category: 'programs',
    name: 'SaaSNova NovaX',
    short: 'NovaX',
    listingTitle: 'SaaSNova NovaX: AWS Marketplace GTM Premium Program',
    prodview: 'prodview-sadu3ew4pklkk',
    productId: 'prod-s7fyf4ln4hgqy',
    duration: '6 months',
    stage: 'Accelerate',
    flagship: {
      tagline: 'Global Multi-Cloud Scale',
      whatYouGet: [
        'Multi-cloud co-sell (AWS, Azure, GCP)',
        'Scalable attribution model',
        '3-hyperscaler Marketplace hygiene',
        'PRM partner lifecycle automation',
        'GTM report with multi-cloud evidence',
        'SI/GSI engagement & motion map',
      ],
      impact: [
        '3–5X attributable cloud revenue',
        '2–3X stronger SI/GSI alignment',
        '40–60% higher co-sell acceptance',
        '25–40% Marketplace lift',
        'Series B → C scale engine',
      ],
      idealStage: 'Multi-cloud ISVs expanding into repeatable global revenue.',
      stageRange: 'Series A → Series C',
      clouds: 'AWS, Microsoft Azure and Google Cloud',
    },
    summary:
      'Our six-month global multi-cloud program. Co-sell across AWS, Microsoft Azure and Google Cloud, a scalable attribution model, three-hyperscaler Marketplace hygiene and SI/GSI motions, with founder-led onboarding and quarterly executive reviews.',
    forWho: 'Series A to Series C multi-cloud ISVs expanding into repeatable global revenue.',
    problem:
      'Tactical engagements fix one phase at a time. You need one accountable partner running the whole AWS motion, with progress reviewed at the executive level every quarter.',
    includes: [
      {
        title: 'Pipeline acceleration',
        body: 'Structured reviews that progress AWS co-sell opportunities, with KPIs tracked across ACE submissions and WinWires.',
      },
      {
        title: 'Enablement orchestration',
        body: 'Partner readiness activities and AWS field enablement sessions scheduled and run for joint execution.',
      },
      {
        title: 'AWS-aligned GTM assets',
        body: 'Reviewer-ready assets deployed across your AWS Marketplace listing, Partner Central and ACE entries, where AWS teams actually look.',
      },
      {
        title: 'Quarterly executive reviews',
        body: 'Progress benchmarked against AWS KPIs every quarter, with direct collaboration with AWS Partner Development Managers.',
      },
      {
        title: 'Optional sustainable pipeline creation',
        body: 'Add-on paid-demand management: channel selection, placement planning, pacing, publisher coordination and optimization.',
      },
    ],
    outcomes: [
      'A documented lifecycle roadmap',
      'AWS-validated messaging',
      'Structured reviews with AWS Partner Development Managers',
      'Documented adoption metrics and co-sell readiness outcomes',
    ],
    support:
      'Founder-led by CEO Jen Dawson, with a guaranteed 24-hour business-day response time, priority onboarding and real-time orchestration guidance with AWS Partner Development Managers.',
    related: ['supernova', 'alliance-leadership', 'co-sell-execution'],
  },

  // ─── Marketplace launch and storefronts ─────────────────────
  {
    slug: 'aws-marketplace-listing',
    kind: 'service',
    category: 'marketplace',
    name: 'AWS Marketplace Listing and GTM Launch',
    short: 'Listing and GTM Launch',
    listingTitle: 'SaaSNova AWS Marketplace Listing and GTM Launch Services',
    prodview: 'prodview-ideb2o75lc4uy',
    productId: 'prod-ny7k7j7hrjct4',
    summary:
      'We build your AWS Marketplace listing, design your storefront, prepare your team for co-sell and support private offer strategy, with no engineering lift on your side.',
    forWho: 'AWS partners launching on AWS Marketplace for the first time, or relaunching a listing that is not performing.',
    problem:
      'Listing configuration is only the first step. Without positioning, co-sell readiness and a private offer plan, a new listing sits unused.',
    includes: [
      {
        title: 'Full listing lifecycle',
        body: 'Product configuration, pricing strategy, entitlement mapping, documentation, compliance and submission management through to approval.',
      },
      {
        title: 'Storefront design and activation',
        body: 'Messaging, visuals, buyer-ready content and AWS-aligned positioning that improve discoverability once the listing is approved.',
      },
      {
        title: 'GTM foundation',
        body: 'ICP, segmentation, positioning, Better Together messaging and AWS field plays.',
      },
      {
        title: 'Co-sell and private offer readiness',
        body: 'ACE workflows aligned, opportunities created, regional AWS field teams engaged, and private offer packaging and buyer messaging for CPPO and MPPO deals.',
      },
    ],
    outcomes: [
      'An approved, positioned AWS Marketplace listing',
      'An activated storefront',
      'Co-sell workflows and field plays ready to run',
      'A private offer strategy aligned with AWS funding programs where applicable',
    ],
    support:
      'Dedicated onboarding and implementation sessions, a 24-hour business response time for standard requests and an elevated tier with defined escalation paths for enterprise customers.',
    related: ['storefront', 'ignite', 'co-sell-execution'],
  },
  {
    slug: 'storefront',
    kind: 'service',
    category: 'marketplace',
    name: 'Storefront as a Service',
    short: 'Storefront as a Service',
    listingTitle: 'SaaSNova Storefront as a Service for AWS Marketplace (SFAAS)',
    prodview: 'prodview-bjfxrzq7x2yyq',
    productId: 'prod-z5uxvhxmgvpjq',
    summary:
      'We build and operate an AWS Marketplace storefront inside your website, surfacing listings, pricing and private offers, and keep it current with quarterly refresh cycles.',
    forWho: 'ISVs, channel partners and cloud-native SaaS companies that want Marketplace buying inside their own digital properties.',
    problem:
      'Buyers who want to purchase through AWS Marketplace have to leave your site to find you, and AWS sellers have no clean asset to share in customer conversations.',
    includes: [
      {
        title: 'Embedded Marketplace experience',
        body: 'Listings, pricing and private offers surfaced on your website so customers can browse, compare and start a purchase without leaving.',
      },
      {
        title: 'End-to-end build',
        body: 'Storefront design, listing and private offer integration, and workflows aligned with AWS Marketplace operations.',
      },
      {
        title: 'Continuous management',
        body: 'Quarterly refresh cycles, listing updates, pricing alignment and private offer workflows maintained for you.',
      },
      {
        title: 'Co-sell asset',
        body: 'A field-ready storefront AWS sellers can use in customer conversations across regions and industries.',
      },
    ],
    outcomes: [
      'A live storefront on your website, launched in weeks rather than months',
      'Lower procurement friction for buyers using AWS Marketplace',
      'A maintained, accurate asset for AWS co-sell conversations',
    ],
    support:
      'Structured operational support, a 99.5% uptime SLA for shared workspaces, a 24-hour business response time for storefront updates, listing changes and private offer workflows, and an elevated enterprise tier.',
    related: ['aws-marketplace-listing', 'co-marketing', 'ignite'],
  },

  // ─── Co-sell and partner execution ──────────────────────────
  {
    slug: 'co-sell-execution',
    kind: 'service',
    category: 'cosell',
    name: 'PDMaaS: AWS Co-Sell Execution',
    short: 'Co-sell execution (PDMaaS)',
    listingTitle: 'SaaSNova PDMaaS for AWS Co-Sell Execution',
    prodview: 'prodview-jyyylhd7krsyy',
    productId: 'prod-5iokalkrsku5o',
    summary:
      'Partner Development Manager as a Service. We run a real AWS co-sell motion without you hiring a PDM: weekly field engagement, ACE pipeline progression, funding workflows and Marketplace readiness.',
    forWho: 'ISVs activating an AWS partnership for the first time, or scaling a co-sell motion that has stalled.',
    problem:
      'Co-sell needs weekly attention: ACE hygiene, field follow-up, funding requests. Without a dedicated PDM it slips, and AWS reads the silence as a weak partner signal.',
    includes: [
      {
        title: 'Dedicated operator-led PDM',
        body: 'Your AWS-facing execution lead, driving weekly field engagement and progressing opportunities through ACE.',
      },
      {
        title: 'ISV Accelerate signals',
        body: 'ACE hygiene, funding readiness and consistent field engagement that build the traction ISV Accelerate participation requires.',
      },
      {
        title: 'FTR preparation',
        body: 'Documentation, architectural clarity and operational readiness for the AWS Foundational Technical Review.',
      },
      {
        title: 'Marketplace and APN readiness',
        body: 'Private offer workflows, Marketplace transaction readiness and the operational steps to keep partner program hygiene as you grow.',
      },
    ],
    outcomes: [
      'A weekly co-sell cadence with AWS field teams',
      'Opportunities progressing through ACE',
      'Stronger readiness for ISV Accelerate and FTR',
    ],
    support:
      'A 99.5% uptime SLA for shared workspaces, dedicated onboarding, a 24-hour business response time and an elevated enterprise tier with defined escalation paths.',
    related: ['alliance-leadership', 'co-marketing', 'novax'],
  },
  {
    slug: 'alliance-leadership',
    kind: 'service',
    category: 'cosell',
    name: 'PALaaS: AWS Alliance Leadership',
    short: 'Alliance leadership (PALaaS)',
    listingTitle: 'SaaSNova PALaaS for AWS Alliance Leadership',
    prodview: 'prodview-ebowtxpoqxwb2',
    productId: 'prod-4zdn2j5fj42uw',
    summary:
      'Partner Alliance Lead as a Service. Senior alliance leadership without a full-time hire: AWS field coordination, program navigation, QBR preparation and executive alignment, with supporting motions across Azure and Google Cloud.',
    forWho: 'ISVs that need consistent, senior alliance leadership with AWS and a coordinated multi-cloud rhythm.',
    problem:
      'Alliances run on cadence and executive follow-through. Fractional or stretched internal coverage leaves gaps that AWS partner teams notice.',
    includes: [
      {
        title: 'AWS alliance leadership',
        body: 'Field relationships, co-sell alignment and weekly engagement rhythms managed by a dedicated operator.',
      },
      {
        title: 'Program and designation management',
        body: 'APN requirements, co-sell program expectations and funding workflows tracked and documented.',
      },
      {
        title: 'QBRs and executive alignment',
        body: 'Your leadership arrives at AWS QBRs and executive reviews with clear narratives, metrics and follow-through.',
      },
      {
        title: 'Azure and Google Cloud coordination',
        body: 'Supporting alliance motions on other hyperscalers, coordinated without diluting an AWS-first strategy.',
      },
    ],
    outcomes: [
      'A consistent alliance rhythm with AWS partner and field teams',
      'Prepared, credible executive and QBR engagement',
      'Documented multi-cloud traction under one engagement',
    ],
    support:
      'Continuous alliance support with a 99.5% uptime SLA for shared workspaces, a 24-hour business response time and an elevated enterprise tier.',
    related: ['co-sell-execution', 'co-marketing', 'novax'],
  },
  {
    slug: 'co-marketing',
    kind: 'service',
    category: 'cosell',
    name: 'PMMaaS: AWS Co-Marketing Execution',
    short: 'Co-marketing (PMMaaS)',
    listingTitle: 'SaaSNova PMMaaS for AWS Co-Marketing Execution',
    prodview: 'prodview-ecfhdfpwyxhho',
    productId: 'prod-6o773jkhk72ny',
    summary:
      'Partner Marketing Manager as a Service. Partner-ready messaging, co-sell content, field enablement kits and demand generation campaigns that AWS teams can actually use.',
    forWho: 'ISVs that need continuous partner marketing for AWS without hiring a Partner Marketing Manager.',
    problem:
      'AWS sellers will only position what they understand. Product marketing built for direct sales rarely translates into field-ready, Better Together content.',
    includes: [
      {
        title: 'Cloud-aligned messaging',
        body: 'Product capabilities translated into differentiated, partner-ready positioning aligned to AWS programs and industry narratives.',
      },
      {
        title: 'Co-sell content engine',
        body: 'Pitch decks, solution briefs, one-pagers, talk tracks and co-branded assets calibrated for AWS field conversations.',
      },
      {
        title: 'Field readiness kit',
        body: 'Battlecards, objection handling and talk tracks for AWS sellers and your own team.',
      },
      {
        title: 'Demand generation and Marketplace optimization',
        body: 'Repeatable campaigns across AWS customers, plus listing copy, customer evidence and competitive positioning that improve conversion.',
      },
    ],
    outcomes: [
      'Better Together narratives AWS sellers can repeat',
      'A maintained library of co-sell assets',
      'Running demand generation campaigns tied to pipeline',
    ],
    support:
      'Structured cadences and review cycles, a 24-hour business response time and an elevated enterprise tier.',
    related: ['co-sell-execution', 'storefront', 'supernova'],
  },

  // ─── AWS programs and funding ───────────────────────────────
  {
    slug: 'box-funding-readiness',
    kind: 'service',
    category: 'programs-funding',
    name: 'BOXaaS: AWS BOX Funding Readiness',
    short: 'BOX funding readiness (BOXaaS)',
    listingTitle: 'SaaSNova BOXaaS AWS BOX Funding Readiness as a Service',
    prodview: 'prodview-wcrtjs6xsa7cu',
    productId: 'prod-u5x2fwpaav6eo',
    summary:
      'We run the AWS Business Outcomes Xcelerator (BOX) Milestone 1 and Milestone 2 motion end to end: Feasibility Study, Joint Business Plan, ACE opportunity submission and APFP funding workflows.',
    forWho:
      'AWS partners with an existing joint solution, or preparing to build one within 12 months, that want to unlock BOX milestone incentives.',
    problem:
      'BOX funding is milestone-based and document-heavy. Most teams stall on the Feasibility Study, the Joint Business Plan or the ongoing eligibility requirements.',
    includes: [
      {
        title: 'Milestone 1 and 2 execution',
        body: 'Feasibility Study development, Joint Business Plan creation and ACE opportunity preparation aligned to AWS expectations.',
      },
      {
        title: 'Outcomes, financials and GTM strategy',
        body: 'Business outcomes, partner roles, financial models and GTM plans written in the format BOX reviewers and field teams need.',
      },
      {
        title: 'Eligibility built into the cadence',
        body: 'Bi-weekly ACE hygiene, 72-hour response to AWS-sourced opportunities, Marketplace listing within 12 months of Feasibility Study submission and ongoing AWS collaboration.',
      },
    ],
    outcomes: [
      'BOX Milestone 1 and Milestone 2 deliverables completed',
      'A predictable path to BOX incentives',
      'Ongoing program compliance built into your operating rhythm',
    ],
    support:
      'Dedicated onboarding, milestone-aligned working sessions, weekly coordination touchpoints and a 24-hour business response time.',
    related: ['co-sell-execution', 'genai-competency-readiness', 'aws-marketplace-listing'],
  },
  {
    slug: 'genai-competency-readiness',
    kind: 'service',
    category: 'programs-funding',
    name: 'GenAI Competency Readiness',
    short: 'GenAI Competency readiness',
    listingTitle: 'SaaSNova GenAI Competency Readiness as a Service',
    prodview: 'prodview-u3fylho2ivkyo',
    productId: 'prod-dymomyo5jv6x4',
    summary:
      'Operator-led preparation for the AWS Generative AI Competency (which AWS has expanded into the AWS AI Competency): architecture review of Amazon Bedrock or Amazon SageMaker workloads, responsible AI validation, customer evidence and a competency-ready documentation package.',
    forWho: 'ISVs building on Amazon Bedrock, Amazon SageMaker or AWS-aligned GenAI architectures.',
    problem:
      'The GenAI Competency asks for production-grade architecture, responsible AI controls and customer evidence. Assembling that alongside product work can take months.',
    includes: [
      {
        title: 'GenAI architecture validation',
        body: 'Model orchestration, inference patterns, data flows, security posture and responsible AI controls assessed against AWS best practices, with remediation guidance.',
      },
      {
        title: 'Customer evidence development',
        body: 'Customer references identified and packaged with narratives, outcomes and validation criteria aligned to competency requirements.',
      },
      {
        title: 'Competency-ready documentation',
        body: 'Architecture diagrams, solution brief, validation checklist and customer evidence in one readiness package.',
      },
      {
        title: 'Program and field alignment',
        body: 'Structured cadences and coordination with AWS Partner Development Managers and Solutions Architects.',
      },
    ],
    outcomes: [
      'A complete readiness package for AWS GenAI Competency submission',
      'A readiness timeline measured in weeks rather than months',
    ],
    support:
      'A 99.5% uptime SLA for shared workspaces, dedicated readiness sessions, a 24-hour business response time and an elevated enterprise tier.',
    related: ['box-funding-readiness', 'co-sell-execution', 'co-marketing'],
  },

  // ─── AWS partner compliance (no cost for eligible partners) ─
  {
    slug: 'partner-revenue-measurement',
    kind: 'service',
    category: 'readiness',
    name: 'PRMaaS: AWS Partner Revenue Measurement',
    short: 'Partner Revenue Measurement (PRMaaS)',
    listingTitle: 'SaaSNova PRMaaS Free AWS Partner Revenue Measurement Service',
    prodview: 'prodview-4xnnpwg7ok4he',
    productId: 'prod-g6myzix2u2oja',
    noCost: true,
    summary:
      'A no-cost, end-to-end AWS Partner Revenue Measurement (PRM) implementation for eligible partners: resource tagging, IaC integration, attribution validation and compliance automation.',
    forWho: 'Eligible AWS partners and ISVs operating on AWS Marketplace and co-sell that must meet AWS PRM requirements.',
    problem:
      'AWS uses PRM to attribute the AWS consumption your product drives, and now uses it to measure partnership success across partner programs and benefits. Gaps in tagging or attribution fail silently and put co-sell visibility and funding eligibility at risk.',
    includes: [
      {
        title: 'Architecture assessment and discovery',
        body: 'Resource discovery across accounts and regions for Partner, Customer and Hybrid deployment patterns.',
      },
      {
        title: 'Tagging strategy and IaC integration',
        body: 'aws-apn-id tagging designed and built into your infrastructure as code, with cross-account IAM coordination.',
      },
      {
        title: 'Attribution validation',
        body: 'Attribution checked against Partner Central reporting so AWS can measure partner-driven revenue reliably.',
      },
      {
        title: 'Continuous compliance',
        body: 'Automation that keeps tagging accurate as your environment changes.',
      },
    ],
    outcomes: [
      'Accurate PRM attribution across accounts and regions',
      'Continued eligibility for AWS partner funding and co-sell benefits tied to PRM',
    ],
    support:
      'A one-time, time-bound implementation engagement with structured readiness support and a 24-hour business response time.',
    notIncluded:
      'Ongoing Partner Central operations, co-sell execution, Marketplace optimization, funding strategy and CRM integration are not included and can be scoped separately.',
    related: ['partner-central-migration', 'co-sell-execution', 'ignite'],
  },
  {
    slug: 'partner-central-migration',
    kind: 'service',
    category: 'readiness',
    name: 'PCMaaS: Partner Central Migration Readiness',
    short: 'Partner Central migration (PCMaaS)',
    listingTitle: 'SaaSNova PCMaaS Free AWS Partner Central Migration Readiness',
    prodview: 'prodview-rkujxyr752dqm',
    productId: 'prod-2ikc6hw7x6rhg',
    noCost: true,
    summary:
      'A no-cost readiness engagement for eligible partners moving to, or newly operating in, AWS Partner Central in the AWS Management Console. We prepare Alliance, Sales, Operations and Leadership teams for IAM-based access, SSO, account linking and the new workflows.',
    forWho: 'Eligible ISVs, services partners and distributors adopting the unified AWS Partner Central experience.',
    problem:
      'Partner Central now runs in the AWS Management Console, with IAM-based access, SSO and account linking. Teams that move without validated account structure and clear ownership risk duplicate registrations and broken co-sell routing, and many that have already moved are still running old workflows.',
    includes: [
      {
        title: 'Status and account validation',
        body: 'Partner status, account structure and organizational alignment validated before migration activities, avoiding duplicate registration errors.',
      },
      {
        title: 'IAM, SSO and account linking readiness',
        body: 'Teams prepared for IAM-based authentication, permission structures, AWS account linking and one-click migration outcomes.',
      },
      {
        title: 'Workflow alignment',
        body: 'Opportunity routing, co-sell initiation, approvals and reporting workflows mapped to the new console.',
      },
      {
        title: 'Role and ownership clarity',
        body: 'Clear ownership of Partner Central workflows across GTM, operations and partner management.',
      },
    ],
    outcomes: [
      'Teams ready to operate in the new Partner Central',
      'Validated account structure with no duplicate registration risk',
      'Defined roles and workflows across functions',
    ],
    support: 'A one-time, time-boxed readiness engagement with dedicated sessions and a 24-hour business response time.',
    notIncluded:
      'This engagement prepares your organization; it does not perform technical execution. Ongoing Partner Central operations, co-sell execution, Marketplace optimization, funding strategy and CRM integration are scoped separately.',
    related: ['partner-revenue-measurement', 'ignite', 'co-sell-execution'],
  },
];

export const getOffering = (slug: string) => {
  const o = offerings.find((x) => x.slug === slug);
  if (!o) throw new Error(`Unknown offering: ${slug}`);
  return o;
};
export const programs = offerings.filter((o) => o.kind === 'program');
export const services = offerings.filter((o) => o.kind === 'service');
export const byCategory = (id: CategoryId) => offerings.filter((o) => o.category === id);
