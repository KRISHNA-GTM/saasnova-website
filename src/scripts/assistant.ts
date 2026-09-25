// Client for the "Ask SaaSNova" assistant.
// Live mode contract (api/chat):
//   POST {endpoint}  body: { messages: {role:'user'|'assistant', content:string}[], page: string }
//   200 text/event-stream, events: data: {"type":"delta","text":"..."} | {"type":"done"} | {"type":"error","message":"..."}
// Guided mode: local retrieval over /assistant-kb.json.

interface KbEntry { id: string; title: string; answer: string; url: string; keywords: string[] }
type Msg = { role: 'user' | 'assistant'; content: string };

const SYN: Record<string, string> = {
  cost: 'price', costs: 'price', pricing: 'price', fee: 'price', fees: 'price', quote: 'price', budget: 'price', much: 'price',
  cosell: 'co-sell', 'co-selling': 'co-sell', cosselling: 'co-sell', ace: 'co-sell', pdm: 'pdmaas', pmm: 'pmmaas', pal: 'palaas',
  prm: 'revenue', attribution: 'revenue', tagging: 'revenue', partnercentral: 'partner', migration: 'migration', migrate: 'migration',
  listing: 'listing', list: 'listing', listed: 'listing', storefront: 'storefront', box: 'box', funding: 'funding', mdf: 'funding',
  genai: 'genai', ai: 'genai', competency: 'competency', meeting: 'book', call: 'book', demo: 'book', free: 'no-cost',
};
const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'does', 'you', 'your', 'we', 'our', 'us', 'to', 'for', 'of', 'and', 'or', 'with', 'how', 'what', 'can', 'i', 'my', 'in', 'on', 'it', 'be', 'me', 'about', 'help']);

const tokens = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((t) => t && !STOP.has(t)).map((t) => SYN[t] || t);

function score(q: string[], e: KbEntry) {
  const kw = new Set([...e.keywords.map((k) => SYN[k] || k), ...tokens(e.title)]);
  const body = tokens(e.answer);
  let s = 0;
  for (const t of q) {
    if (kw.has(t)) s += 3;
    else if (body.includes(t)) s += 1;
    else if (t.length > 4 && [...kw].some((k) => k.startsWith(t.slice(0, 5)))) s += 1.5;
  }
  return s;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
function render(text: string) {
  // Escape, then allow [label](url) links to https or same-site paths only.
  return esc(text)
    .replace(/\[([^\]]{1,80})\]\(((?:https:\/\/|\/)[^\s)]{1,300})\)/g, (_m, l, u) => {
      const ext = u.startsWith('https://') && !u.startsWith('https://www.saasnova.ai');
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ''}>${l}</a>`;
    })
    .split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

export function initAssistant() {
  const root = document.querySelector<HTMLElement>('[data-assistant]');
  if (!root) return;
  const endpoint = root.dataset.endpoint || '';
  const book = root.dataset.book || '/contact';
  const openBtn = root.querySelector<HTMLButtonElement>('[data-open]')!;
  const panel = root.querySelector<HTMLElement>('[data-panel]')!;
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-form]')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const history: Msg[] = [];
  let kb: KbEntry[] | null = null;
  let busy = false;

  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    openBtn.setAttribute('aria-expanded', String(open));
    if (open) { input.focus(); window.gtag?.('event', 'assistant_open'); } else openBtn.focus();
  };
  openBtn.addEventListener('click', () => setOpen(Boolean(panel.hidden)));
  root.querySelector('[data-close]')!.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  const add = (role: 'me' | 'bot', html: string) => {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  };

  async function guided(q: string) {
    if (!kb) {
      try { kb = await (await fetch('/assistant-kb.json')).json(); } catch { kb = []; }
    }
    const qt = tokens(q);
    const ranked = (kb || []).map((e) => ({ e, s: score(qt, e) })).filter((r) => r.s >= 3).sort((a, b) => b.s - a.s);
    if (!ranked.length) {
      return `I don't have a confident answer for that one. Our team can help directly: [${'book a strategy session'}](${book}) or [send us a message](/contact).`;
    }
    const top = ranked[0].e;
    let out = `${top.answer}\n\n[${top.url.startsWith('http') ? 'Book a strategy session' : `Read more: ${top.title}`}](${top.url})`;
    const also = ranked.slice(1, 3).filter((r) => r.e.url !== top.url);
    if (also.length) out += `\n\nRelated: ${also.map((r) => `[${r.e.title}](${r.e.url})`).join(', ')}`;
    return out;
  }

  async function live(bubble: HTMLElement) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ messages: history.slice(-12), page: location.pathname }),
    });
    if (res.status === 429) throw new Error('You have sent a lot of questions in a short time. Wait a minute and try again.');
    if (!res.ok || !res.body) throw new Error('The assistant is unavailable right now.');
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '', text = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const events = buf.split('\n\n');
      buf = events.pop() || '';
      for (const ev of events) {
        const line = ev.split('\n').find((l) => l.startsWith('data:'));
        if (!line) continue;
        const data = JSON.parse(line.slice(5).trim());
        if (data.type === 'delta') { text += data.text; bubble.innerHTML = render(text); log.scrollTop = log.scrollHeight; }
        if (data.type === 'error') throw new Error(data.message || 'The assistant hit an error.');
      }
    }
    return text;
  }

  async function ask(q: string) {
    if (busy || !q.trim()) return;
    busy = true;
    root!.querySelector('[data-chips]')?.remove();
    add('me', esc(q));
    history.push({ role: 'user', content: q });
    const bubble = add('bot', '<p class="typing">Thinking…</p>');
    try {
      let answer: string;
      if (endpoint) {
        try { answer = await live(bubble); }
        catch (err) { answer = `${(err as Error).message} Here is what I can tell you from our site:\n\n${await guided(q)}`; }
      } else {
        answer = await guided(q);
      }
      bubble.innerHTML = render(answer);
      history.push({ role: 'assistant', content: answer });
      window.gtag?.('event', 'assistant_question', { mode: endpoint ? 'live' : 'guided' });
    } finally {
      busy = false;
      log.scrollTop = log.scrollHeight;
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value; input.value = ''; ask(q); });
  log.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('.chips button') as HTMLButtonElement | null;
    if (b) ask(b.textContent || '');
  });
}
