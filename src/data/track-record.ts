// Case studies (Arctic Wolf, Dataminr). Figures come from the published saasnova.ai case-study pages.
// Quotes for each case study live in src/data/testimonials.ts (page: 'arctic-wolf' | 'dataminr').
import arcticLogo from '../assets/images/arcticwolf-trim.png';
import dataminrLogo from '../assets/images/dataminr-logo-trim.png';

export const trackRecord = [
  {
    slug: 'arctic-wolf',
    company: 'Arctic Wolf',
    logo: arcticLogo,
    title: 'Arctic Wolf: from unmanaged ISV to fully managed status in AWS Security Demand Generation',
    summary:
      'A six-month GTM sprint that gave Arctic Wolf an AWS operating model: a joint GTM plan, Marketplace private offers, field enablement and an ACE-to-Marketplace workflow.',
    facts: [
      { k: 'Industry', v: 'Cybersecurity (managed detection and response)' },
      { k: 'Target verticals', v: 'CPG and retail, banking, insurance, healthcare' },
      { k: 'AWS programs', v: 'AWS Marketplace (MPO and CPPO), ACE co-sell' },
    ],
    results: [
      { n: '2K+', l: 'Partner Sales Qualified Leads (PSQLs) generated' },
      { n: '300%+', l: 'of pipeline goal met' },
      { n: '9X', l: 'ROI, validated by AWS' },
      { n: '90 days', l: 'to fully operational MPO and CPPO' },
    ],
    challenge: [
      'Arctic Wolf entered the AWS ecosystem with strong product-market fit and a high-velocity direct sales motion, but without the AWS-specific go-to-market structure the ecosystem runs on. AWS sellers could not easily engage the company, route deals to AWS Marketplace or position the solution in enterprise security conversations.',
      'It needed a unified AWS GTM plan with joint messaging, funnel definitions mapped to Partner Sales Qualified Leads, a forecasting model aligned to AWS progression metrics, operational Marketplace listings for key products, and talk tracks and reference architectures for AWS sellers.',
    ],
    approach: [
      'The engagement began with a four-hour live GTM sprint at Arctic Wolf’s Minnesota office, with AWS Partner Development Managers and Arctic Wolf’s alliances, field marketing, channel, demand generation, creative and product marketing teams. The resulting GTM plan became the operating contract: target segments, pipeline targets, ownership and a bi-monthly QBR cadence.',
      'Marketplace readiness was treated as a structural requirement, with Managed Private Offers and Channel Partner Private Offers fully operational within 90 days. Field enablement was rebuilt with AWS-aligned value propositions and reference architectures showing how Arctic Wolf integrates with Amazon EC2, Amazon S3, Amazon EKS and AWS Lambda, and an ACE-to-Marketplace workflow removed procurement friction for joint customers.',
    ],
    outcome: [
      'Arctic Wolf moved from an unmanaged ISV to fully managed status inside AWS Security Demand Generation, a shift achieved by fewer than 5% of security ISVs at the time.',
      'The motion generated more than 2,000 PSQLs and 168 SQLs directly from AWS-aligned campaigns, including 3,300 MQLs from the Big Business of Cybercrime series. The program validated a 9X ROI, and Arctic Wolf exceeded its pipeline goals by more than 300%.',
    ],
  },
  {
    slug: 'dataminr',
    company: 'Dataminr',
    logo: dataminrLogo,
    title: 'Dataminr: AWS Rising Star graduation in under 12 months',
    summary:
      'A six-month GTM sprint that built Dataminr’s AWS operating model: co-build priorities across AWS security services, a PSQL scoring model and an ACE-to-Marketplace workflow.',
    facts: [
      { k: 'Industry', v: 'AI and real-time threat detection' },
      { k: 'Focus', v: 'Cybersecurity and physical security' },
      { k: 'AWS programs', v: 'AWS Marketplace private offers, ACE co-sell, ISV Rising Star' },
    ],
    results: [
      { n: '<12 months', l: 'to AWS Rising Star graduation' },
      { n: '$300K', l: 'in Market Development Funds secured' },
      { n: 'Public sector', l: 'Marketplace wins closed' },
    ],
    challenge: [
      'Dataminr had a differentiated product and strong enterprise traction, but not the AWS-specific structure needed to activate co-sell, accelerate Marketplace velocity and align internal teams. AWS sellers lacked the clarity and routing logic to position Dataminr in security conversations or advance opportunities through ACE.',
      'It needed a unified AWS GTM plan with defined segments and targets, clear co-build priorities across AWS security services and a PSQL strategy aligned to ACE mechanics.',
    ],
    approach: [
      'The engagement opened with a live GTM workshop at AWS’s Los Altos office, bringing alliances, product, marketing and sales leaders together to set a baseline and a six-month accountability structure.',
      'A co-build prioritization framework mapped integration opportunities across AWS security services, with a focus on Amazon Security Lake and Amazon GuardDuty, giving AWS sellers a clear Better Together narrative. A PSQL scoring model defined the co-sell workflow from origination to ACE submission, AE talk tracks and qualification guides equipped sellers, and a marketplace platform integration enabled Partner-to-Buyer scoring, Salesforce widget enablement and an ACE-to-Marketplace workflow.',
    ],
    outcome: [
      'Dataminr graduated from the AWS Rising Star program in under 12 months and, with an AWS-reviewed GTM plan, secured $300,000 in MDF.',
      'It exceeded its PSQL targets, scaled Marketplace private offer adoption and closed significant public sector wins.',
    ],
  },
] as const;

export const getTrackRecord = (slug: string) => trackRecord.find((t) => t.slug === slug)!;
