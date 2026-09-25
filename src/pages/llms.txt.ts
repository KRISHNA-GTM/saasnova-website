import type { APIRoute } from 'astro';
import { offerings, offeringPath, categories } from '../data/offerings';
import { site } from '../data/site';

// llms.txt: a concise, link-first map of the site for AI assistants and agents.
export const GET: APIRoute = () => {
  const u = (p: string) => `${site.url}${p}`;
  const out: string[] = [
    '# SaaSNova',
    '',
    `> ${site.description}`,
    '',
    'SaaSNova is the first operator-led GTM execution engine for cloud marketplaces (AWS, Microsoft Azure, Google Cloud). It was founded by CEO Jen Dawson, former Global GTM Lead at AWS, and is a women-owned business, an AWS Advanced Tier Services Partner, an AWS AI Services Competency Partner and an official launch partner for AWS Marketplace Storefront. Flagship programs: Ignite (1 month), SuperNova (4 months), NovaX (6 months). Every program is custom and scoped on a 30-minute strategy session.',
    '',
  ];
  for (const c of categories) {
    out.push(`## ${c.title}`, '');
    for (const o of offerings.filter((x) => x.category === c.id)) {
      out.push(`- [${o.name}](${u(offeringPath(o))}): ${o.summary}`);
    }
    out.push('');
  }
  out.push(
    '## Company',
    '',
    `- [About SaaSNova](${u('/about')}): founder, team and operating model`,
    `- [Customer stories](${u('/customers')}): results, case studies (Arctic Wolf, Dataminr) and customer logos`,
    `- [Partners](${u('/partners')}): Carahsoft, SaaSify, WorkSpan, Pronix`,
    `- [AWS Marketplace storefront](${u('/storefront')}): SaaSNova's storefront and Storefront as a Service`,
    `- [Contact](${u('/contact')}) and [Support](${u('/support')})`,
    '',
    '## Resources',
    '',
    `- [Insights](${u('/insights')}): analysis on AWS Marketplace, co-sell, PRM and Partner Central`,
    `- [News](${u('/news')}): announcements`,
    `- [Full text for LLMs](${u('/llms-full.txt')})`,
    `- [AWS Marketplace seller profile](${site.awsSellerProfile})`,
    '',
  );
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
