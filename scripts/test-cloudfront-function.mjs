// Unit test for deploy/cloudfront-function.js (runs the handler in Node with simulated events).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const code = readFileSync(fileURLToPath(new URL('../deploy/cloudfront-function.js', import.meta.url)), 'utf8');
const handler = new Function(code + '\nreturn handler;')();
const ev = (uri, host = 'www.saasnova.ai', querystring = {}) => ({ request: { uri, headers: { host: { value: host } }, querystring } });
const cases = [
  ['/', { uri: '/index.html' }],
  ['/index.html', { loc: '/' }],
  ['/ignite.html', { loc: '/programs/ignite' }],
  ['/ignite', { loc: '/programs/ignite' }],
  ['/IGNITE.HTML', { loc: '/programs/ignite' }],
  ['/pdmaas.html', { loc: '/solutions/co-sell-execution' }],
  ['/blog-aws-prm-deadline', { loc: '/insights/aws-prm-deadline' }],
  ['/press&media.html', { loc: '/news' }],
  ['/press%26media.html', { loc: '/news' }],
  ['/case-study-arcticwolf.html', { loc: '/case-studies/arctic-wolf' }],
  ['/partner-gcp-gtm', { loc: '/community/gcp' }],
  ['/fq-source.html', { loc: '/fq-source' }],
  ['/about.html', { loc: '/about' }],
  ['/about/', { loc: '/about' }],
  ['/about', { uri: '/about/index.html' }],
  ['/programs/ignite', { uri: '/programs/ignite/index.html' }],
  ['/llms.txt', { uri: '/llms.txt' }],
  ['/_assets/x.css', { uri: '/_assets/x.css' }],
  ['/api/chat', { uri: '/api/chat' }],
];
let fail = 0;
for (const [uri, want] of cases) {
  const r = handler(ev(uri));
  const got = r.statusCode ? { loc: r.headers.location.value } : { uri: r.uri };
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${uri} -> ${JSON.stringify(got)}${ok ? '' : ' expected ' + JSON.stringify(want)}`);
}
const apex = handler(ev('/ignite.html', 'saasnova.ai', { utm_source: { value: 'li' } }));
const apexOk = apex.headers.location.value === 'https://www.saasnova.ai/ignite.html?utm_source=li';
console.log(`${apexOk ? 'ok  ' : 'FAIL'} apex host -> ${apex.headers.location.value}`);
const q = handler(ev('/ignite.html', 'www.saasnova.ai', { utm_campaign: { value: 'x' } }));
const qOk = q.headers.location.value === '/programs/ignite?utm_campaign=x';
console.log(`${qOk ? 'ok  ' : 'FAIL'} query preserved -> ${q.headers.location.value}`);
if (fail || !apexOk || !qOk) process.exit(1);
