/**
 * form-block — diva-e contact band ("Get in touch"): a heading, the HubSpot contact form
 * rendered natively (source-faithful layout) and submitted to the owner's HubSpot portal
 * (Forms API v3, dynamic-features row 3), the legal copy and consent checkboxes.
 * Schema: stardust/eds-schema/en-services-crm.json (section form-block).
 * Decode tier: template-slotted (fixed composition). Authored shape (key-value + head):
 *   Heading | <h2>…   — heading, optional <p> lede (a one-cell row works the same)
 *   Portal | <id>     — HubSpot portal id
 *   Form | <guid>     — HubSpot form id
 *   Anchor | form     — optional id for in-page links (default "form")
 *   Legal | <p>…      — privacy copy (links allowed)
 *   Consent (required) | <p>…  /  Consent | <p>…  — one row per consent checkbox, in order
 *   Legal (after) | <p>…  — privacy copy rendered after the consent checkboxes
 *   Note | <p>…       — the required-fields note
 *   Submit | <label>  — optional submit label (default "Send form")
 * Authored copy (heading, lede, legal, consents, note) is MOVED into the layout (EW1); key
 * cells and config values move into a hidden config holder (never displayed, never dropped).
 *
 * @ew-exempt key cells (Heading, Portal, Form, Anchor, Legal, Consent, Note, Submit) — metadata
 * @ew-exempt <p> Portal, Form, Anchor, Submit values — config (submit label = input value)
 * @ew-exempt all form field labels and options — code-owned HubSpot form definition
 * Block classes: regular (blue card) | dark-blue (default: light card on a navy band)
 */

const FIELDS = {
  default: {
    type: 'Formular Typ',
    rows: [
      [{
        name: 'email_salutation',
        label: 'Salutation',
        kind: 'radio',
        required: true,
        options: ['Mr.', 'Ms.', 'Mx.'],
      }],
      [
        { name: 'firstname', label: 'First name', kind: 'text' },
        {
          name: 'lastname', label: 'Last name', kind: 'text', required: true,
        },
      ],
      [
        {
          name: 'email', label: 'E-Mail', kind: 'email', required: true,
        },
        { name: 'phone', label: 'Phone', kind: 'tel' },
      ],
      [{
        name: 'company', label: 'Company name', kind: 'text', required: true,
      }],
      [{
        name: 'wie_sind_sie_auf_uns_aufmerksam_geworden',
        label: 'How did you find out about us?',
        kind: 'select',
        options: [
          ['Google / KI / Suchmaschine', 'Google / AI / Search engine'],
          ['Social Media', 'Social Media'],
          ['Empfehlung / Partner', 'Recommendation / Partner'],
          ['Newsletter / Email', 'Newsletter / Email'],
          ['Event / Messe', 'Event / Trade Fair'],
          ['sonstiges', 'other'],
        ],
      }],
      [{
        name: 'which_services', label: 'Your message', kind: 'textarea', required: true,
      }],
    ],
    consents: ['8966186', '4607881'],
  },
  // PIM voucher campaign form (en/campaigns/pim-voucher)
  '858dcd92-0f82-4892-800e-6408357edea7': {
    type: 'Kontaktanfrage',
    rows: [
      [{
        name: 'email_salutation_de_informal_1',
        label: 'Salutation',
        kind: 'radio',
        required: true,
        options: ['Dear Mr.', 'Dear Ms.', 'Dear Mx.'],
      }],
      [
        { name: 'firstname', label: 'First Name', kind: 'text' },
        {
          name: 'lastname', label: 'Last Name', kind: 'text', required: true,
        },
      ],
      [
        {
          name: 'email', label: 'Email', kind: 'email', required: true,
        },
        { name: 'jobtitle', label: 'Jobtitle', kind: 'text' },
      ],
      [
        {
          name: 'company', label: 'Company', kind: 'text', required: true,
        },
        {
          name: '0-2/unternehmensgro_e__umsatz_',
          label: 'Company Size',
          kind: 'select',
          options: [
            ['< 1 Mio.', 'under 1 Mio.  EUR revenue'],
            ['1-250 Mio. EUR', '1-250 Mio. EUR revenue'],
            ['250-500 Mio. EUR', '250-500 Mio. EUR revenue'],
            ['500-1.000 Mio EUR', '500-1.000 Mio. EUR revenue'],
            ['> 1 Mrd.', '1-20 Mrd. EUR revenue'],
            ['> 20 Mrd. EUR', 'über 20 Mrd. EUR revenue'],
            ['keine Angabe', 'not specified'],
          ],
        },
      ],
    ],
    consents: ['8966186', '4607881'],
  },
  // Conclusion Connect event registration (en/connect)
  'f867628b-9f28-4383-b5fe-edd19d49cdfd': {
    type: 'Kontakteigenschaft',
    rows: [
      [{
        name: 'email_salutation',
        label: 'Salutation',
        kind: 'radio',
        required: true,
        options: ['Mr.', 'Ms.', 'Mx.'],
      }],
      [
        {
          name: 'firstname', label: 'First Name', kind: 'text', required: true,
        },
        {
          name: 'lastname', label: 'Last name', kind: 'text', required: true,
        },
      ],
      [
        {
          name: 'email', label: 'E-Mail', kind: 'email', required: true,
        },
        { name: 'jobtitle', label: 'Jobtitle', kind: 'text' },
      ],
      [
        {
          name: 'company', label: 'Company name', kind: 'text', required: true,
        },
        {
          name: '0-2/unternehmensgro_e__umsatz_',
          label: 'Size of Company',
          kind: 'select',
          options: [
            ['< 1 Mio.', 'under 1 Mio.  EUR revenue'],
            ['1-250 Mio. EUR', '1 - 250 Mio. EUR revenue'],
            ['250-500 Mio. EUR', '250 - 500 Mio. EUR revnue'],
            ['500-1.000 Mio EUR', '500 - 1.000 Mio. EUR revenue'],
            ['> 1 Mrd.', '1 - 20 billion EUR revenue'],
            ['> 20 Mrd. EUR', 'more than 20 billion EUR revenue'],
            ['keine Angabe', 'no answer'],
          ],
        },
      ],
    ],
    consents: ['8966186', '4607881'],
  },
  // newsletter signup form (en/newsletter)
  '7be38c84-25c4-4518-a4ea-4ad15117dbc4': {
    type: 'Formular Typ',
    typeValue: 'Newsletteranmeldung',
    rows: [
      [{
        name: 'email_salutation_de_informal_1',
        label: 'Anrede',
        kind: 'radio',
        required: true,
        options: ['Dear Mr.', 'Dear Ms.', 'Dear Mx.'],
      }],
      [
        { name: 'firstname', label: 'First Name', kind: 'text' },
        {
          name: 'lastname', label: 'Last Name', kind: 'text', required: true,
        },
      ],
      [
        {
          name: 'email', label: 'E-Mail', kind: 'email', required: true,
        },
        { name: 'company', label: 'Company', kind: 'text' },
      ],
    ],
    consents: ['8966186', '4607881'],
  },
  // German home contact form (/ — form language de)
  '4d6ce1e5-3456-45eb-a5c0-0aa85fa2e635': {
    type: 'Formular Typ',
    placeholder: 'Bitte auswählen',
    rows: [
      [{
        name: 'email_salutation_de_informal_1',
        label: 'Anrede',
        kind: 'radio',
        required: true,
        options: [['Lieber Herr', 'Herr'], ['Liebe Frau', 'Frau'], ['Liebe/r Frau/Herr', 'divers']],
      }],
      [
        { name: 'firstname', label: 'Vorname', kind: 'text' },
        {
          name: 'lastname', label: 'Nachname', kind: 'text', required: true,
        },
      ],
      [
        {
          name: 'email', label: 'E-Mail', kind: 'email', required: true,
        },
        { name: 'phone', label: 'Telefonnummer', kind: 'tel' },
      ],
      [
        {
          name: 'company', label: 'Unternehmensname', kind: 'text', required: true,
        },
        {
          name: '0-2/unternehmensgro_e__umsatz_',
          label: 'Unternehmensgröße',
          kind: 'select',
          options: [
            ['< 1 Mio.', 'unter 1 Mio.  EUR Umsatz'],
            ['1-250 Mio. EUR', '1-250 Mio. EUR Umsatz'],
            ['250-500 Mio. EUR', '250-500 Mio. EUR Umsatz'],
            ['500-1.000 Mio EUR', '500-1.000 Mio. EUR Umsatz'],
            ['> 1 Mrd.', '1-20 Mrd. EUR Umsatz'],
            ['> 20 Mrd. EUR', 'über 20 Mrd. EUR Umsatz'],
            ['keine Angabe', 'keine Angabe'],
          ],
        },
      ],
      [{
        name: 'wie_sind_sie_auf_uns_aufmerksam_geworden',
        label: 'Wie sind Sie auf uns aufmerksam geworden?',
        kind: 'select',
        options: [
          ['Google / KI / Suchmaschine', 'Google / KI / Suchmaschine'],
          ['Social Media', 'Social Media'],
          ['Empfehlung / Partner', 'Empfehlung / Partner'],
          ['Newsletter / Email', 'Newsletter / Email'],
          ['Event / Messe', 'Event / Messe'],
          ['sonstiges', 'sonstiges'],
        ],
      }],
      [{
        name: 'which_services', label: 'Ihre Nachricht an uns', kind: 'textarea', required: true,
      }],
    ],
    consents: ['8966186', '4607881'],
  },
};

let uid = 0;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function required() {
  const s = el('span', 'hs-form-required');
  s.textContent = '*';
  return s;
}

function labelFor(id, text, req) {
  const label = el('label', 'hs-form-label', { for: id });
  label.textContent = text;
  if (req) label.append(required());
  return label;
}

function buildField(f, placeholder = 'Please Select') {
  uid += 1;
  const id = `fb-${f.name}-${uid}`;
  const field = el('div', `hs-form-field${f.kind === 'textarea' ? ' hs-form-field-textarea' : ''}`);
  if (f.kind === 'radio') {
    const lbl = el('span', 'hs-form-label', { id: `${id}-lbl` });
    lbl.textContent = f.label;
    if (f.required) lbl.append(required());
    const list = el('ul', 'hs-form-radios', { role: 'radiogroup', 'aria-labelledby': `${id}-lbl` });
    f.options.forEach((o) => {
      const li = el('li');
      const label = el('label', 'hs-form-radio');
      // an option is a label, or [value, label] when HubSpot's stored value differs
      const [value, text] = Array.isArray(o) ? o : [o, o];
      const input = el('input', '', { type: 'radio', name: f.name, value });
      if (f.required) input.required = true;
      const span = el('span');
      span.textContent = text;
      label.append(input, span);
      li.append(label);
      list.append(li);
    });
    field.append(lbl, list);
    return field;
  }
  field.append(labelFor(id, f.label, f.required));
  let input;
  if (f.kind === 'select') {
    input = el('select', 'hs-form-select', { id, name: f.name });
    const ph = el('option', '', { value: '' });
    ph.textContent = placeholder;
    ph.selected = true;
    ph.disabled = true;
    input.append(ph);
    f.options.forEach(([value, text]) => {
      const o = el('option', '', { value });
      o.textContent = text;
      input.append(o);
    });
  } else if (f.kind === 'textarea') {
    input = el('textarea', 'hs-form-input', { id, name: f.name });
  } else {
    input = el('input', 'hs-form-input', { id, type: f.kind, name: f.name });
  }
  if (f.required) input.required = true;
  field.append(input);
  return field;
}

function readConfig(block) {
  const cfg = {
    head: [], consents: [], legal: [], legalAfter: [], note: [], config: [],
  };
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const valueCell = cells[1];
      const value = valueCell.textContent.trim();
      // key cells and config values stay in the DOM (moved, hidden) — never dropped (EW1)
      cfg.config.push(...cells[0].children);
      if (['portal', 'form', 'anchor', 'submit'].includes(key)) cfg.config.push(...valueCell.children);
      if (key === 'heading') cfg.head.push(...valueCell.children);
      else if (key === 'portal') cfg.portal = value;
      else if (key === 'form') cfg.form = value;
      else if (key === 'anchor') cfg.anchor = value;
      else if (key === 'submit') cfg.submit = value;
      else if (key.startsWith('consent')) {
        cfg.consents.push({ nodes: [...valueCell.children], required: key.includes('required') });
      } else if (key === 'note') cfg.note.push(...valueCell.children);
      else if (key.startsWith('legal') && key.includes('after')) cfg.legalAfter.push(...valueCell.children);
      else cfg.legal.push(...valueCell.children);
    } else if (cells.length === 1) {
      cfg.head.push(...cells[0].children);
    }
  });
  return cfg;
}

async function submit(form, cfg, schema, status) {
  const data = new FormData(form);
  const fields = [];
  data.forEach((value, name) => {
    if (!name.startsWith('LEGAL_CONSENT') && value !== '') fields.push({ name, value: String(value) });
  });
  const communications = schema.consents.map((id, i) => ({
    value: data.has(`LEGAL_CONSENT.subscription_type_${id}`),
    subscriptionTypeId: Number(id),
    text: cfg.consents[i] ? cfg.consents[i].text : '',
  }));
  const body = {
    fields,
    context: { pageUri: window.location.href, pageName: document.title },
    legalConsentOptions: {
      consent: { consentToProcess: true, text: cfg.legalText || '', communications },
    },
  };
  status.textContent = '';
  try {
    const resp = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${cfg.portal}/${cfg.form}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(String(resp.status));
    form.reset();
    status.textContent = 'Thank you for your message.';
  } catch (e) {
    status.textContent = 'Sorry, the form could not be sent. Please try again later.';
  }
}

export default function decorate(block) {
  if (block.querySelector(':scope > .form-block-container')) return; // EW9
  const cfg = readConfig(block);
  const schema = FIELDS[cfg.form] || FIELDS.default;
  if (!block.id) block.id = cfg.anchor || 'form';

  const container = el('div', 'form-block-container');
  const wrap = el('div', 'form-block-form');
  if (cfg.head.length) {
    const heading = el('div', 'form-block-heading');
    heading.append(...cfg.head);
    wrap.append(heading);
  }

  const form = el('form', 'hs-form', { action: '#', method: 'post', novalidate: '' });
  const typeRow = el('fieldset', 'hs-form-row', { hidden: '' });
  const typeField = el('div', 'hs-form-field');
  typeField.append(
    labelFor('fb-type', schema.type),
    el('input', '', {
      id: 'fb-type', type: 'hidden', name: 'formular_typ', ...(schema.typeValue ? { value: schema.typeValue } : {}),
    }),
  );
  typeRow.append(typeField);
  form.append(typeRow);
  schema.rows.forEach((row) => {
    const fs = el('fieldset', `hs-form-row${row.length > 1 ? ' hs-form-row-2' : ''}`);
    row.forEach((f) => fs.append(buildField(f, schema.placeholder)));
    form.append(fs);
  });

  const legalRow = el('fieldset', 'hs-form-row');
  const legal = el('div', 'hs-form-legal');
  if (cfg.legal.length) {
    cfg.legalText = cfg.legal.map((n) => n.textContent).join(' ');
    const rich = el('div', 'hs-form-richtext');
    rich.append(...cfg.legal);
    legal.append(rich);
  }
  cfg.consents.forEach((c, i) => {
    c.text = c.nodes.map((n) => n.textContent).join(' ');
    const id = schema.consents[i] || `extra${i}`;
    const check = el('div', 'hs-form-check');
    const label = el('label', 'hs-form-checkbox');
    const input = el('input', '', { type: 'checkbox', name: `LEGAL_CONSENT.subscription_type_${id}` });
    if (c.required) input.required = true;
    const span = el('span', 'hs-form-check-text');
    span.append(...c.nodes);
    if (c.required) span.append(required());
    label.append(input, span);
    check.append(label);
    legal.append(check);
  });
  if (cfg.legalAfter.length) {
    cfg.legalText = [cfg.legalText, ...cfg.legalAfter.map((n) => n.textContent)].filter(Boolean).join(' ');
    const after = el('div', 'hs-form-richtext');
    after.append(...cfg.legalAfter);
    legal.append(after);
  }
  if (cfg.note.length) {
    const note = el('div', 'hs-form-richtext');
    note.append(...cfg.note);
    legal.append(note);
  }
  legalRow.append(legal);
  form.append(legalRow);

  const actions = el('div', 'hs-form-actions');
  actions.append(el('input', 'hs-form-submit', { type: 'submit', value: cfg.submit || 'Send form' }));
  const status = el('div', 'hs-form-status', { role: 'status', 'aria-live': 'polite' });
  form.append(actions, status);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (cfg.portal && cfg.form) submit(form, cfg, schema, status);
  });

  wrap.append(form);
  container.append(wrap);
  const config = el('div', 'form-block-config', { hidden: '' });
  config.append(...cfg.config);
  block.replaceChildren(container, config);
}
