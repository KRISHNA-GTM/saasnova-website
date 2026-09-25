// Batch QA: node scripts/shots.mjs <outDir> <width> <path...>
import { chromium } from 'playwright';
const [out, width, ...paths] = process.argv.slice(2);
const base = process.env.BASE || 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`${page.url()}: ${e}`));
for (const p of paths) {
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    await Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }); }));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  const name = (p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/, '')) + `-${width}.png`;
  await page.screenshot({ path: `${out}/${name}`, fullPage: true });
  console.log(name, overflow ? 'HORIZONTAL OVERFLOW' : '');
}
if (errors.length) console.log('CONSOLE ERRORS:\n' + [...new Set(errors)].join('\n'));
await browser.close();
