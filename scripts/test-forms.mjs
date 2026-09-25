// End-to-end form + assistant tests. HubSpot is intercepted (nothing is sent to the real portal).
// Usage: BASE=http://localhost:4400 node scripts/test-forms.mjs
import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:4400';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
let captured = null;
let hsStatus = 200;
await ctx.route('https://api.hsforms.com/**', async (route) => {
  captured = { url: route.request().url(), body: JSON.parse(route.request().postData() || '{}') };
  await route.fulfill({ status: hsStatus, contentType: 'application/json', body: hsStatus === 200 ? '{"inlineMessage":"ok"}' : '{"status":"error","errors":[{"errorType":"INVALID_EMAIL"}]}' });
});
let fail = 0;
const check = (name, cond, detail = '') => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? ' :: ' + detail : ''}`); if (!cond) fail++; };
const field = (b, n) => b.fields.find((f) => f.name === n)?.value;

// 1. Contact (service): empty submit shows errors and sends nothing
await page.goto(base + '/contact', { waitUntil: 'networkidle' });
captured = null;
await page.click('#form-svc button[type=submit]');
check('contact: empty submit blocked', captured === null);
check('contact: inline errors rendered', (await page.locator('#form-svc .error:not(:empty)').count()) >= 5);
check('contact: first invalid field focused', await page.evaluate(() => document.activeElement?.id === 's-fn'));

// 2. Contact (service): valid submit, enum mapping and composition
await page.fill('#s-fn', 'Ada'); await page.fill('#s-ln', 'Lovelace');
await page.fill('#s-em', 'ada@example.com'); await page.fill('#s-co', 'Analytical Engines');
await page.selectOption('#s-cloud', 'AWS Marketplace');
await page.selectOption('#s-mp', 'Listed on one cloud marketplace');
await page.selectOption('#s-svc', 'SaaSNova Ignite');
await page.fill('#s-msg', 'Listing is live but quiet.');
await page.click('#form-svc button[type=submit]');
await page.waitForSelector('#form-svc [data-status][data-state=ok]');
let b = captured.body;
check('contact: posts to service inquiry form', captured.url.endsWith('/245317385/aa170816-bdf0-44f2-a14c-97dd671d1762'));
check('contact: target cloud valid enum', field(b, 'target_cloud_marketplace_s_') === 'AWS Marketplace');
check('contact: service mapped to HubSpot value', field(b, 'primary_service_of_interest') === 'Ignite (1-Month Sprint)');
check('contact: unmappable status omitted', field(b, 'current_marketplace_status') === undefined);
check('contact: details composed into challenge', /Listing status: Listed on one cloud marketplace/.test(field(b, 'what_is_your_biggest_cloud_gtm_challenge_') || '') && /Interested in: SaaSNova Ignite/.test(field(b, 'what_is_your_biggest_cloud_gtm_challenge_')) && /quiet/.test(field(b, 'what_is_your_biggest_cloud_gtm_challenge_')));
check('contact: helper fields not sent', !b.fields.some((f) => ['marketplace_detail', 'service_detail', 'website_url'].includes(f.name)));
check('contact: page context sent', b.context?.pageUri?.includes('/contact') && !!b.context?.pageName);

// 3. Honeypot: bot fill is dropped silently
await page.goto(base + '/newsletter', { waitUntil: 'networkidle' });
captured = null;
await page.fill('#n-em', 'bot@example.com');
await page.evaluate(() => { document.querySelector('#n-web').value = 'http://spam'; });
await page.click('form[data-hs-form] button[type=submit]');
await page.waitForTimeout(400);
check('newsletter: honeypot submission not sent', captured === null);

// 4. HubSpot error is surfaced, not a false success
await page.goto(base + '/newsletter', { waitUntil: 'networkidle' });
hsStatus = 400;
await page.fill('#n-em', 'someone@example.com');
await page.click('form[data-hs-form] button[type=submit]');
await page.waitForSelector('form[data-hs-form] [data-status][data-state=error]');
check('newsletter: rejection shows error', /rejected that email/.test(await page.textContent('form[data-hs-form] [data-status]')));
hsStatus = 200;

// 5. Community GCP: composed into message, checkbox group required
await page.goto(base + '/community/gcp', { waitUntil: 'networkidle' });
for (const [id, v] of [['#c-fn', 'Grace'], ['#c-ln', 'Hopper'], ['#c-em', 'grace@example.com'], ['#c-jt', 'PDM'], ['#c-dv', 'Partners'], ['#c-of', 'Sunnyvale'], ['#c-ci', 'Sunnyvale'], ['#c-st', 'CA'], ['#c-co', 'USA']]) await page.fill(id, v);
await page.selectOption('#c-src', 'Referral');
await page.check('#c-consent');
captured = null;
await page.click('form[data-hs-form] button[type=submit]');
await page.waitForTimeout(300);
check('community: blocked without an invitation choice', captured === null);
await page.check('#c-inv-0');
await page.click('form[data-hs-form] button[type=submit]');
await page.waitForSelector('[data-status][data-state=ok]');
b = captured.body;
check('community gcp: composed message', /Division: Partners/.test(field(b, 'message') || '') && /Invitations: GTM Speaking Opportunities/.test(field(b, 'message')));
check('community gcp: no unknown gcp_division property', !b.fields.some((f) => f.name === 'gcp_division'));
check('community gcp: consent sent', b.legalConsentOptions?.consent?.consentToProcess === true);

// 6. Community AWS: invitations as semicolon list with valid values
await page.goto(base + '/community/aws', { waitUntil: 'networkidle' });
for (const [id, v] of [['#c-fn', 'A'], ['#c-ln', 'B'], ['#c-em', 'a@example.com'], ['#c-jt', 'PDM'], ['#c-dv', 'WWPS'], ['#c-of', 'Seattle'], ['#c-ci', 'Seattle'], ['#c-st', 'WA'], ['#c-co', 'USA']]) await page.fill(id, v);
await page.selectOption('#c-src', 'AWS Colleague');
await page.check('#c-inv-0'); await page.check('#c-inv-3'); await page.check('#c-consent');
await page.click('form[data-hs-form] button[type=submit]');
await page.waitForSelector('[data-status][data-state=ok]');
b = captured.body;
check('community aws: multi-select joined', field(b, 'i_want_to_receive_invitations_for') === 'GTM Speaking Opportunities;Marketplace Activation Workshops');
check('community aws: division property', field(b, 'aws_division') === 'WWPS');

// 7. FQ Source: valid partner status enum
await page.goto(base + '/fq-source', { waitUntil: 'networkidle' });
const fq = 'form[data-hs-form="23f93682-eb5a-4e14-a2bc-61813dae92ed"]';
await page.fill(`${fq} input[name=firstname]`, 'Jo'); await page.fill(`${fq} input[name=lastname]`, 'Doe');
await page.fill(`${fq} input[name=company]`, 'Acme'); await page.fill(`${fq} input[name=email]`, 'jo@example.com');
await page.selectOption(`${fq} select[name=aws_partner_status]`, 'Validated or Differentiated Tier');
await page.selectOption(`${fq} select[name=aws_marketplace_status]`, 'Listed but Underperforming');
await page.click(`${fq} button[type=submit]`);
await page.waitForSelector(`${fq} [data-status][data-state=ok]`);
check('fq source: valid enums sent', field(captured.body, 'aws_partner_status') === 'Validated or Differentiated Tier');

// 8. Assistant (guided mode)
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.click('[data-open]');
await page.fill('#assistant-input', 'How is pricing handled?');
await page.press('#assistant-input', 'Enter');
await page.waitForFunction(() => document.querySelectorAll('.chat-panel .msg.bot').length >= 2 && !document.querySelector('.chat-panel .typing'));
const answer = await page.locator('.chat-panel .msg.bot').last().textContent();
check('assistant: pricing answer from KB', /private offer/i.test(answer || ''), (answer || '').slice(0, 90));
await page.fill('#assistant-input', 'What is the capital of Peru?');
await page.press('#assistant-input', 'Enter');
await page.waitForTimeout(500);
const fallback = await page.locator('.chat-panel .msg.bot').last().textContent();
check('assistant: off-topic falls back to booking', /strategy session|message/i.test(fallback || ''), (fallback || '').slice(0, 80));
await page.keyboard.press('Escape');
check('assistant: Escape closes panel', await page.locator('#assistant-panel').isHidden());

console.log(fail ? `\n${fail} check(s) failed` : '\nAll form and assistant checks passed.');
await browser.close();
process.exit(fail ? 1 : 0);
