// Verifies every internal href/src in dist/ resolves to a built file, every legacy redirect
// target exists, and no page links to a legacy .html URL. Run after `npm run build`.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { legacyRedirects } from '../src/data/redirects.mjs';

import { fileURLToPath } from 'node:url';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); });
walk(dist);

const resolves = (url) => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (clean === '/' ) return existsSync(join(dist, 'index.html'));
  const p = join(dist, clean);
  return existsSync(p) && statSync(p).isFile() || existsSync(join(p, 'index.html'));
};

const problems = [];
let checked = 0;
for (const f of files.filter((x) => x.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  const page = '/' + relative(dist, f).split(sep).join('/').replace(/index\.html$/, '').replace(/\/$/, '');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, '&');
    if (!u.startsWith('/') || u.startsWith('//')) {
      if (/saasnova\.ai\/[^"]*\.html/.test(u)) problems.push(`${page}: absolute legacy .html link ${u}`);
      continue;
    }
    checked++;
    if (/\.html($|[?#])/.test(u)) problems.push(`${page}: legacy .html link ${u}`);
    else if (!resolves(u)) problems.push(`${page}: broken ${u}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; checked++; if (u.startsWith('/') && !resolves(u)) problems.push(`${page}: broken srcset ${u}`); }
  }
}
for (const [from, to] of Object.entries(legacyRedirects)) {
  if (!resolves(to)) problems.push(`redirect ${from} -> ${to}: target missing`);
}
console.log(`Checked ${checked} internal references across ${files.filter((x) => x.endsWith('.html')).length} pages and ${Object.keys(legacyRedirects).length} redirects.`);
if (problems.length) { console.log([...new Set(problems)].join('\n')); process.exit(1); }
console.log('All internal links, assets and redirect targets resolve.');
