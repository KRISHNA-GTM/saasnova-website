// Progressive-enhancement handler for every <form data-hs-form="<form guid>">.
// Submits to HubSpot Forms API v3 (unauthenticated submit endpoint — portal ID and
// form GUID are public identifiers). Field `name` attributes must match HubSpot
// internal property names (email, firstname, company, …).
//
// Behaviour:
//  - native constraint validation, with inline messages tied via aria-describedby
//  - honeypot field (name="website_url") silently drops bot submissions
//  - sends hutk cookie (if HubSpot tracking is enabled), pageUri and pageName
//  - optional GDPR consent block when the form contains [data-consent]
//  - success message or redirect (data-redirect), GA4 `generate_lead` event

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

const PORTAL_ID = document.documentElement.dataset.hsPortal || '';
const SKIP = new Set(['website_url']);

const getCookie = (name: string) =>
  document.cookie.split('; ').find((c) => c.startsWith(name + '='))?.split('=')[1];

function messageFor(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
  const v = el.validity;
  const label = el.dataset.label || 'This field';
  if (v.valueMissing) return el.type === 'checkbox' ? 'Please confirm to continue.' : `${label} is required.`;
  if (v.typeMismatch && el.type === 'email') return 'Enter an email address in the format name@company.com.';
  if (v.typeMismatch && el.type === 'url') return 'Enter a full web address, starting with https://';
  if (v.customError) return el.validationMessage;
  if (v.patternMismatch) return el.dataset.patternMessage || `${label} is not in the expected format.`;
  if (v.tooShort) return `${label} needs at least ${(el as HTMLInputElement).minLength} characters.`;
  return `${label} is not valid.`;
}

function showError(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, msg: string) {
  const id = `${el.id}-error`;
  let err = document.getElementById(id);
  if (!err) {
    err = document.createElement('p');
    err.id = id;
    err.className = 'error';
    (el.closest('.field') || el.parentElement)!.appendChild(err);
  }
  err.textContent = msg;
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  const described = new Set((el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  if (msg) described.add(id); else described.delete(id);
  el.setAttribute('aria-describedby', Array.from(described).join(' '));
}

function validate(form: HTMLFormElement): boolean {
  let firstBad: HTMLElement | null = null;
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select').forEach((el) => {
    if (SKIP.has(el.name) || el.type === 'hidden' || !el.id) return;
    // Trim text before checking so whitespace-only answers fail "required".
    if ((el instanceof HTMLInputElement && ['text', 'email', 'url', 'tel'].includes(el.type)) || el instanceof HTMLTextAreaElement) {
      el.value = el.value.trimStart();
    }
    const ok = el.checkValidity();
    showError(el, ok ? '' : messageFor(el));
    if (!ok && !firstBad) firstBad = el;
  });
  if (firstBad) (firstBad as HTMLElement).focus();
  return !firstBad;
}

function collectFields(form: HTMLFormElement) {
  const fields: { objectTypeId: string; name: string; value: string }[] = [];
  const data = new FormData(form);
  const multi = new Map<string, string[]>();
  for (const [name, value] of data.entries()) {
    if (SKIP.has(name) || name.startsWith('_')) continue;
    const v = String(value).trim();
    if (!v) continue;
    multi.set(name, [...(multi.get(name) || []), v]);
  }
  // Forms without dedicated HubSpot properties can fold labelled answers into one field:
  // <form data-compose="message"> + inputs with data-compose-label="Division".
  const composeInto = form.dataset.compose;
  const composed: string[] = [];
  if (composeInto) {
    form.querySelectorAll<HTMLElement>('[data-compose-label]').forEach((el) => {
      const name = (el as HTMLInputElement).name;
      const vals = multi.get(name);
      if (vals) composed.push(`${el.dataset.composeLabel}: ${vals.join(', ')}`);
      multi.delete(name);
    });
  }
  for (const [name, values] of multi) {
    // HubSpot multi-checkbox properties take semicolon-separated values.
    let value = values.join(';');
    if (name === composeInto && composed.length) value = `${composed.join('\n')}\n\n${value}`;
    fields.push({ objectTypeId: '0-1', name, value });
  }
  if (composeInto && composed.length && !multi.has(composeInto)) {
    fields.push({ objectTypeId: '0-1', name: composeInto, value: composed.join('\n') });
  }
  return fields;
}

async function submit(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const formId = form.dataset.hsForm;
  if (!formId || !PORTAL_ID) return;

  // Honeypot: pretend success so bots get no signal.
  const hp = form.querySelector<HTMLInputElement>('input[name="website_url"]');
  if (hp && hp.value) { form.reset(); return; }

  if (!validate(form)) {
    if (status) { status.dataset.state = 'error'; status.textContent = 'Some answers need attention. Check the highlighted fields.'; }
    return;
  }

  // <select data-map-to="hs_property"> with <option data-hs="Valid HubSpot value">: the visible
  // choice can be richer than the HubSpot enumeration; the mapped value goes to the property.
  form.querySelectorAll<HTMLSelectElement>('select[data-map-to]').forEach((sel) => {
    const prop = sel.dataset.mapTo!;
    let hidden = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${prop}"]`);
    if (!hidden) { hidden = document.createElement('input'); hidden.type = 'hidden'; hidden.name = prop; form.appendChild(hidden); }
    hidden.value = sel.selectedOptions[0]?.dataset.hs || '';
  });

  const context: Record<string, string> = {
    pageUri: window.location.href,
    pageName: document.title,
  };
  const hutk = getCookie('hubspotutk');
  if (hutk) context.hutk = hutk;

  const body: Record<string, unknown> = { fields: collectFields(form), context };

  const consent = form.querySelector<HTMLInputElement>('[data-consent]');
  if (consent) {
    body.legalConsentOptions = {
      consent: {
        consentToProcess: consent.checked,
        text: consent.closest('label')?.textContent?.trim() || 'I agree to allow SaaSNova to store and process my personal data.',
        communications: [],
      },
    };
  }

  const original = button?.textContent || '';
  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); button.textContent = form.dataset.busyLabel || 'Sending…'; }
  if (status) { status.textContent = ''; delete status.dataset.state; }

  try {
    const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      const invalidEmail = JSON.stringify(detail).includes('INVALID_EMAIL');
      throw new Error(invalidEmail ? 'email' : 'server');
    }
    window.gtag?.('event', 'generate_lead', { form_name: form.dataset.formName || formId });
    if (form.dataset.event) window.gtag?.('event', form.dataset.event);
    if (form.dataset.redirect) { window.location.assign(form.dataset.redirect); return; }
    form.reset();
    if (status) {
      status.dataset.state = 'ok';
      status.textContent = form.dataset.success || 'Thanks. Your message is with our team and we will reply within one business day.';
      status.focus();
    }
  } catch (e) {
    if (status) {
      status.dataset.state = 'error';
      status.textContent = (e as Error).message === 'email'
        ? 'HubSpot rejected that email address. Use your work email and try again.'
        : `The form could not be sent. Try again, or email ${form.dataset.fallbackEmail || 'operations@saasnova.ai'} directly.`;
      status.focus();
    }
  } finally {
    if (button) { button.disabled = false; button.removeAttribute('aria-busy'); button.textContent = original; }
  }
}

document.querySelectorAll<HTMLFormElement>('form[data-hs-form]').forEach((form) => {
  form.noValidate = true; // we render our own accessible messages
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(form); });
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select').forEach((el) => {
    el.addEventListener('blur', () => { if (el.getAttribute('aria-invalid') === 'true' || el.value) { if (el.id && !SKIP.has(el.name)) showError(el, el.checkValidity() ? '' : messageFor(el)); } });
  });
});

export {};
