// Staging only: GitHub Pages serves a project site under /<repo-name>/ (for example
// https://your-org.github.io/saasnova-website/). The site's links are root-relative ("/programs"),
// so this script prefixes them with BASE_PATH after the build. Production (S3 + CloudFront) never
// runs it. If you connect a custom staging domain (for example test.saasnova.ai), BASE_PATH is empty
// and nothing is rewritten.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const base = (process.env.BASE_PATH || '').replace(/\/$/, '');
if (!base) {
  console.log('rebase-for-pages: BASE_PATH empty, nothing to do.');
  process.exit(0);
}

const walk = async (dir) =>
  (await Promise.all((await readdir(dir, { withFileTypes: true })).map((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]))).flat();

const files = (await walk('dist')).filter((f) => ['.html', '.css', '.js', '.json', '.xml', '.webmanifest'].includes(extname(f)));
let changed = 0;
for (const f of files) {
  const src = await readFile(f, 'utf8');
  let out = src;
  if (f.endsWith('.html')) {
    // href="/x", src="/x", action="/x", poster="/x", data-* URLs (never protocol-relative "//")
    out = out.replace(/(\s(?:href|src|action|poster|data-href|data-src)=["'])\/(?!\/)/g, `$1${base}/`);
    // srcset="/a.webp 1x, /b.webp 2x"
    out = out.replace(/(\ssrcset=["'])([^"']+)/g, (_m, a, list) => a + list.replace(/(^|,\s*)\/(?!\/)/g, `$1${base}/`));
  }
  // CSS and inline styles: url(/_assets/...)
  out = out.replace(/url\((["']?)\/(?!\/)/g, `url($1${base}/`);
  // JS: fetches of root-relative JSON (assistant knowledge base)
  if (f.endsWith('.js')) out = out.replace(/(["'`])\/assistant-kb\.json/g, `$1${base}/assistant-kb.json`);
  if (out !== src) { await writeFile(f, out); changed++; }
}
console.log(`rebase-for-pages: prefixed root-relative URLs with ${base} in ${changed} files.`);
