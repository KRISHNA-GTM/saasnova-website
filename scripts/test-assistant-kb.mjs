// Scores sample questions against the guided-mode KB (same logic as src/scripts/assistant.ts).
import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:4400';
const qs = ['Which program fits us?', 'Help with AWS co-sell', 'Is PRM help free?', 'We are not listed yet', 'Partner Central migration', 'Do you do BOX funding?', 'GenAI competency', 'Can you build a storefront on our website?', 'Who founded SaaSNova?', 'Are you an AWS partner?', 'I need help with my existing engagement', 'Do you work with distributors?'];
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.click('[data-open]');
for (const q of qs) {
  const n = await page.locator('.chat-panel .msg.bot').count();
  await page.fill('#assistant-input', q); await page.press('#assistant-input', 'Enter');
  await page.waitForFunction((n) => document.querySelectorAll('.chat-panel .msg.bot').length > n && !document.querySelector('.chat-panel .typing'), n);
  const a = await page.locator('.chat-panel .msg.bot').last().innerText();
  console.log(`Q: ${q}\nA: ${a.replace(/\s+/g, ' ').slice(0, 150)}\n`);
}
await browser.close();
