import type { APIRoute } from 'astro';
import { site } from '../data/site';

// DECISION (Sept 2026): allow every search, AI answer and AI training crawler. SaaSNova wants to be
// found and cited by ChatGPT, Claude, Perplexity and Google AI answers (GEO/AEO), and models can only
// describe SaaSNova accurately if they have read the site. Ask counsel to align the Terms of Use,
// which currently restrict AI training.
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /thank-you',
      '',
      '# AI search and answer engines',
      'User-agent: OAI-SearchBot', 'Allow: /', '',
      'User-agent: ChatGPT-User', 'Allow: /', '',
      'User-agent: PerplexityBot', 'Allow: /', '',
      'User-agent: Claude-SearchBot', 'Allow: /', '',
      'User-agent: Claude-User', 'Allow: /', '',
      '# AI model crawlers (allowed so assistants describe SaaSNova accurately)',
      'User-agent: GPTBot', 'Allow: /', '',
      'User-agent: ClaudeBot', 'Allow: /', '',
      'User-agent: Google-Extended', 'Allow: /', '',
      'User-agent: CCBot', 'Allow: /', '',
      `Sitemap: ${site.url}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
