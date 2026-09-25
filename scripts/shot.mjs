// QA screenshots: node scripts/shot.mjs <path> [width] [out] [fullPage=1] [clipY] [clipH]
import { chromium } from 'playwright';
const [path = '/', width = '1440', out = 'shot.png', full = '1', clipY, clipH = '900'] = process.argv.slice(2);
const base = process.env.BASE || 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(base + path, { waitUntil: 'networkidle' });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await page.evaluate(async () => { await Promise.all([...document.images].map(i => { i.loading = "eager"; return i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }); })); });
await page.waitForTimeout(1800);
const opts = { path: out, fullPage: full === '1' };
if (clipY !== undefined) Object.assign(opts, { fullPage: true, clip: { x: 0, y: Number(clipY), width: Number(width), height: Number(clipH) } });
await page.screenshot(opts);
if (errors.length) console.log('CONSOLE ERRORS:\n' + errors.join('\n'));
await browser.close();
console.log('saved', out);
