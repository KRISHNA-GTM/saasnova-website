// One-time migration of legacy article pages into Astro content collections.
// Usage: node scripts/migrate-legacy.mjs
// Reads ../*.html (legacy site), writes src/content/{insights,news}/*.md and
// optimized images into public/media/<collection>/.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import { legacyRedirects } from '../src/data/redirects.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const legacy = join(root, '..');

const articles = [
  { file: 'blog-aws-prm-deadline.html', collection: 'insights', slug: 'aws-prm-deadline' },
  { file: 'blog-aws-alignment.html', collection: 'insights', slug: 'aws-alignment' },
  { file: 'blog-cloud-marketplace-listing-silent-fix.html', collection: 'insights', slug: 'cloud-marketplace-listing-silent-fix' },
  { file: 'saasnova-hydrolix-blog-stop-buying-software-like-2015.html', collection: 'insights', slug: 'stop-buying-software-like-2015' },
  { file: 'blog-carahsoft-saasnova-accelerating-aws-marketplace-gtm-execution-to-isvs-and-channel-partners.html', collection: 'news', slug: 'carahsoft-saasnova-aws-marketplace-gtm' },
  { file: 'saasnova-achieves-aws-advanced-tier-partner-status.html', collection: 'news', slug: 'aws-advanced-tier-partner' },
  { file: 'saasnova-feenix-pr-aws-marketplace-storefront.html', collection: 'news', slug: 'feenix-aws-marketplace-storefront' },
];

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';

function rewriteHref(href) {
  if (!href) return href;
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
    const m = href.match(/^https?:\/\/(www\.)?saasnova\.ai(\/[^?#]*)?(.*)$/i);
    if (!m) return href;
    href = (m[2] || '/') + (m[3] || '');
  }
  const [p, rest = ''] = href.split(/(?=[?#])/);
  let path = '/' + p.replace(/^\.?\//, '');
  path = decodeURIComponent(path);
  const target = legacyRedirects[path] ?? legacyRedirects[path.replace(/\.html$/, '')];
  if (target) return target + rest;
  return path.replace(/\.html$/, '') + rest;
}

async function optimizeImage(src, collection, slug, n) {
  const clean = decodeURIComponent(src.replace(/^\.?\//, '').replace(/^https?:\/\/(www\.)?saasnova\.ai\//, ''));
  const input = join(legacy, clean);
  if (!existsSync(input)) { console.warn(`  ! missing image ${clean}`); return null; }
  const outDir = join(root, 'public', 'media', collection);
  mkdirSync(outDir, { recursive: true });
  const name = `${slug}-${n}.webp`;
  const img = sharp(input).rotate();
  const meta = await img.metadata();
  const width = Math.min(meta.width || 1600, 1600);
  const info = await img.resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(outDir, name));
  return { url: `/media/${collection}/${name}`, width: info.width, height: info.height };
}

function textOf(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

for (const a of articles) {
  const html = readFileSync(join(legacy, a.file), 'utf8');
  const doc = parse(html, { comment: false });
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content')?.trim() || '';

  const title = textOf(doc.querySelector('h1')) || meta('meta[property="og:title"]');
  const description = meta('meta[name="description"]') || meta('meta[property="og:description"]');
  const hero = doc.querySelector('section');
  const heroText = textOf(hero);
  const dateMatch = heroText.match(new RegExp(`(${MONTHS})( \\d{1,2},)? 20\\d{2}`));
  const readMatch = heroText.match(/(\d+) min read/);
  const tags = hero ? hero.querySelectorAll('.blog-tag').map(textOf).filter(Boolean) : [];
  const author = hero?.querySelector('img[alt]')?.getAttribute('alt') || 'Jen Dawson';

  const body = doc.querySelector('.blog-body');
  if (!body) { console.warn(`No .blog-body in ${a.file}`); continue; }

  // Strip scripts, forms, iframes-other-than-YouTube, style attrs, classes and ids we don't need.
  body.querySelectorAll('script, style, form, noscript, button').forEach((n) => n.remove());
  body.querySelectorAll('iframe').forEach((f) => {
    const src = f.getAttribute('src') || '';
    const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/);
    if (yt) f.replaceWith(parse(`<div class="video" data-youtube="${yt[1]}"></div>`));
    else f.remove();
  });

  let n = 0;
  const heroImgEl = doc.querySelector('.blog-hero-img img');
  let heroImage = null;
  if (heroImgEl) heroImage = await optimizeImage(heroImgEl.getAttribute('src'), a.collection, a.slug, n++);

  for (const img of body.querySelectorAll('img')) {
    const out = await optimizeImage(img.getAttribute('src') || '', a.collection, a.slug, n++);
    if (!out) { img.remove(); continue; }
    const alt = img.getAttribute('alt') || '';
    img.replaceWith(parse(`<img src="${out.url}" alt="${alt.replace(/"/g, '&quot;')}" width="${out.width}" height="${out.height}" loading="lazy" decoding="async" />`));
  }

  body.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('onclick');
    const cls = el.getAttribute('class') || '';
    // Keep only semantic markers we style.
    const keep = cls.split(/\s+/).filter((c) => ['video', 'blog-lead'].includes(c));
    if (keep.length) el.setAttribute('class', keep.map((c) => (c === 'blog-lead' ? 'lead-para' : c)).join(' '));
    else el.removeAttribute('class');
    if (el.tagName === 'A') {
      const href = el.getAttribute('href');
      el.setAttribute('href', rewriteHref(href));
      if (/^https?:/.test(el.getAttribute('href'))) el.setAttribute('rel', 'noopener');
    }
  });

  // Unwrap purely presentational divs.
  let bodyHtml = body.innerHTML
    .replace(/<div>\s*(<img[^>]+>)\s*<\/div>/g, '<figure>$1</figure>')
    .replace(/<span>([\s\S]*?)<\/span>/g, '$1')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  const fm = {
    title,
    description,
    date: dateMatch ? dateMatch[0] : '',
    author,
    readingTime: readMatch ? Number(readMatch[1]) : undefined,
    tags,
    heroImage: heroImage?.url,
    heroAlt: heroImgEl?.getAttribute('alt') || title,
    legacyPath: '/' + a.file.replace(/\.html$/, ''),
  };
  const yaml = Object.entries(fm)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');

  const outDir = join(root, 'src', 'content', a.collection);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${a.slug}.md`), `---\n${yaml}\n---\n\n${bodyHtml}\n`);
  console.log(`✓ ${a.collection}/${a.slug}  (${fm.date || 'no date'}, ${n} images)`);
}
