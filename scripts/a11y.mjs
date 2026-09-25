// Accessibility audit with axe-core across all built pages. BASE defaults to the dev server.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const base = process.env.BASE || 'http://localhost:4321';
const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
const paths = [...xml.matchAll(/<loc>https:\/\/www\.saasnova\.ai([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const summary = {};
for (const p of paths) {
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  for (const v of r.violations) {
    const k = `${v.id} (${v.impact})`;
    summary[k] ??= { help: v.help, pages: new Set(), samples: [] };
    summary[k].pages.add(p);
    if (summary[k].samples.length < 3) summary[k].samples.push(v.nodes[0]?.target?.join(' ') + ' :: ' + (v.nodes[0]?.failureSummary || '').split('\n')[1]);
  }
}
console.log(`Checked ${paths.length} pages`);
for (const [k, v] of Object.entries(summary)) console.log(`\n${k}: ${v.help}\n  pages: ${[...v.pages].slice(0, 8).join(', ')}${v.pages.size > 8 ? ' …' : ''}\n  ${v.samples.join('\n  ')}`);
if (!Object.keys(summary).length) console.log('No violations.');
await browser.close();
