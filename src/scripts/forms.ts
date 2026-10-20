// Formulaires CarSitting : parcours conditionnel, validation en français, envoi.
//
// Envoi : si PUBLIC_FORM_ENDPOINT est défini (Formspree, Getform, une route API…), la demande y est
// postée en JSON. Sinon, repli sur l'ouverture de la messagerie du visiteur (mailto), faute de backend.

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;
const CONTACT = 'contact@carsitting.fr';

// Messages affichés au visiteur, dans la langue de la page. Les demandes reçues restent en français.
const MSG = {
  fr: {
    required: 'Ce champ est requis.', choose: 'Veuillez choisir une option.',
    email: 'Indiquez une adresse email valide (ex. vous@maison.fr).', tel: 'Indiquez un numéro de téléphone valide (10 chiffres minimum).',
    dateMin: (d: string) => `Choisissez une date à partir du ${d}.`, min: (n: string) => `La valeur doit être au moins ${n}.`,
    max: (n: string) => `La valeur doit être au plus ${n}.`, integer: 'Indiquez un nombre entier.',
    pending: 'Envoi en cours…', sent: 'Demande transmise',
    fix: (n: number) => `Merci de compléter ${n > 1 ? `les ${n} champs signalés` : 'le champ signalé'}.`,
    thanks: 'Merci, votre demande a bien été transmise.', thanksLong: 'Merci, votre demande a bien été transmise. Nous vous répondons sous 48 heures ouvrées.',
    failed: `L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez-nous à ${CONTACT}.`,
    mailto: `Votre messagerie s'ouvre avec la demande pré-remplie : il ne reste qu'à l'envoyer. Si rien ne s'ouvre, écrivez-nous à ${CONTACT}.`,
  },
  en: {
    required: 'This field is required.', choose: 'Please choose an option.',
    email: 'Please enter a valid email address (e.g. you@house.com).', tel: 'Please enter a valid phone number (at least 10 digits).',
    dateMin: (d: string) => `Please choose a date from ${d}.`, min: (n: string) => `The value must be at least ${n}.`,
    max: (n: string) => `The value must be at most ${n}.`, integer: 'Please enter a whole number.',
    pending: 'Sending…', sent: 'Request sent',
    fix: (n: number) => `Please complete ${n > 1 ? `the ${n} highlighted fields` : 'the highlighted field'}.`,
    thanks: 'Thank you, your request has been sent.', thanksLong: 'Thank you, your request has been sent. We will reply within two working days.',
    failed: `Your request could not be sent. Please try again shortly or write to us at ${CONTACT}.`,
    mailto: `Your email app is opening with the request pre-filled: just send it. If nothing opens, write to us at ${CONTACT}.`,
  },
};
const msg = () => MSG[document.documentElement.lang === 'en' ? 'en' : 'fr'];

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Téléphone : chiffres, espaces, points, tirets, parenthèses et « + » ; 10 à 15 chiffres.
function checkTel(el: Control) {
  if (el.type !== 'tel') return;
  const v = el.value.trim();
  const digits = v.replace(/\D/g, '').length;
  el.setCustomValidity(v && (/[^0-9+ .()-]/.test(v) || digits < 10 || digits > 15) ? 'tel' : '');
}

const frDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
};

// Date affichée dans un message : « 15/10/2026 » en français, « 15 October 2026 » en anglais (jj/mm ambigu pour un lecteur américain).
const shownDate = (iso: string) => {
  if (document.documentElement.lang !== 'en') return frDate(iso);
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

function messageFor(el: Control): string {
  const v = el.validity;
  const m = msg();
  if (v.valueMissing) return el instanceof HTMLSelectElement ? m.choose : m.required;
  if (v.typeMismatch && el.type === 'email') return m.email;
  if (v.customError && el.type === 'tel') return m.tel;
  if (v.rangeUnderflow && el.type === 'date') return m.dateMin(shownDate((el as HTMLInputElement).min));
  if (v.rangeUnderflow) return m.min((el as HTMLInputElement).min);
  if (v.rangeOverflow) return m.max((el as HTMLInputElement).max);
  if (v.stepMismatch || v.badInput) return m.integer;
  return el.validationMessage;
}

function controls(form: HTMLFormElement) {
  return [...form.querySelectorAll<Control>('.f-input')];
}

function showError(el: Control) {
  checkTel(el);
  const err = document.getElementById(el.getAttribute('aria-describedby') || '');
  const invalid = !el.disabled && !el.checkValidity();
  el.setAttribute('aria-invalid', String(invalid));
  if (err) err.textContent = invalid ? messageFor(el) : '';
  return invalid;
}

// Active un bloc (fieldset) et le rend visible, ou le désactive : un champ désactivé n'est ni validé ni envoyé.
function toggleBlock(block: HTMLFieldSetElement | null, on: boolean) {
  if (!block) return;
  block.disabled = !on;
  block.hidden = !on;
}

function initParcours(form: HTMLFormElement) {
  const radios = form.querySelectorAll<HTMLInputElement>('input[name="Parcours"]');
  if (!radios.length) return;
  const billingSame = form.querySelector<HTMLInputElement>('[data-billing-same]');
  const billingOther = form.querySelector<HTMLFieldSetElement>('[data-billing-other]');
  const syncBilling = () => {
    const regular = form.querySelector<HTMLFieldSetElement>('[data-branch="Service régulier"]');
    toggleBlock(billingOther, !!billingSame && !billingSame.checked && !regular?.disabled);
  };
  const sync = () => {
    const current = form.querySelector<HTMLInputElement>('input[name="Parcours"]:checked')?.value;
    form.querySelectorAll<HTMLFieldSetElement>('[data-branch]').forEach((b) => toggleBlock(b, b.dataset.branch === current));
    syncBilling();
    // Les erreurs du parcours quitté n'ont plus lieu d'être.
    form.querySelectorAll<HTMLElement>('fieldset:disabled .f-error').forEach((e) => (e.textContent = ''));
  };
  radios.forEach((r) => r.addEventListener('change', sync));
  billingSame?.addEventListener('change', syncBilling);
  sync();
}

// Champs actifs, dans l'ordre du formulaire ; ceux d'un fieldset désactivé (parcours non choisi) sont exclus.
function payload(form: HTMLFormElement) {
  const out: Record<string, string> = {};
  for (const el of [...form.elements] as Control[]) {
    if (!el.name || el.name === '_gotcha' || el.disabled || el.closest('fieldset:disabled')) continue;
    if (el instanceof HTMLInputElement && el.type === 'radio' && !el.checked) continue;
    let v = el instanceof HTMLInputElement && el.type === 'checkbox' ? (el.checked ? 'Oui' : 'Non') : el.value.trim();
    if (el.type === 'date') v = frDate(v);
    if (v) out[el.name] = v;
  }
  return out;
}

function setState(form: HTMLFormElement, state: 'idle' | 'pending' | 'success' | 'error', message = '') {
  const btn = form.querySelector<HTMLButtonElement>('.f-submit');
  const text = btn?.querySelector<HTMLElement>('[data-submit-text]');
  const status = form.querySelector<HTMLElement>('[data-status]');
  form.dataset.state = state;
  if (btn && text) {
    btn.disabled = state === 'pending' || state === 'success';
    btn.setAttribute('aria-busy', String(state === 'pending'));
    text.textContent = state === 'pending' ? msg().pending : state === 'success' ? msg().sent : btn.dataset.label || '';
  }
  if (status) status.textContent = message;
}

async function submit(form: HTMLFormElement) {
  const fields = controls(form);
  const invalid = fields.filter((el) => showError(el));
  if (invalid.length) {
    invalid[0].focus({ preventScroll: false });
    setState(form, 'error', msg().fix(invalid.length));
    return;
  }
  // Pot de miel anti-spam : un robot remplit ce champ invisible.
  if ((form.querySelector<HTMLInputElement>('[name="_gotcha"]')?.value || '').trim()) {
    setState(form, 'success', msg().thanks);
    return;
  }

  const data = payload(form);
  // Demande envoyée depuis la version anglaise : on le signale pour répondre dans la bonne langue.
  const english = document.documentElement.lang === 'en';
  if (english) data['Langue du visiteur'] = 'Anglais — répondre en anglais';
  const subject = [form.dataset.subject, english && 'EN', data['Parcours'], data['Nom et prénom'] || data['Établissement']].filter(Boolean).join(' — ');
  setState(form, 'pending');

  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: subject, ...data }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState(form, 'success', msg().thanksLong);
      form.reset();
      form.querySelectorAll<HTMLInputElement>('input[name="Parcours"]')[0]?.dispatchEvent(new Event('change'));
    } catch {
      setState(form, 'error', msg().failed);
    }
    return;
  }

  const body = Object.entries(data).map(([k, v]) => `${k} : ${v}`).join('\n');
  window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setState(form, 'idle', msg().mailto);
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    form.noValidate = true; // validation prise en charge ici, avec des messages en français sous chaque champ

    // Pas de date passée pour un événement.
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    form.querySelectorAll<HTMLInputElement>('input[type="date"]').forEach((d) => (d.min = today));

    initParcours(form);

    // Après une première tentative, l'erreur se met à jour au fil de la saisie.
    controls(form).forEach((el) => {
      const revalidate = () => el.getAttribute('aria-invalid') === 'true' && showError(el);
      el.addEventListener('input', revalidate);
      el.addEventListener('change', revalidate);
      el.addEventListener('blur', () => el.value && showError(el));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (form.dataset.state !== 'pending') submit(form);
    });
  });
}
