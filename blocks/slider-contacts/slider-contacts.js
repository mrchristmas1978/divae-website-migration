/**
 * slider-contacts — diva-e SliderContacts (management page): a coverflow rail of contact cards
 * (portrait, name, position, social icon links); only the centred card shows its info panel.
 * Decode tier: template-slotted repeat group. Authored shape (any row/cell split):
 *   head row     — optional headline / text (rows before the first portrait)
 *   contact rows — [image] [<p>name</p> <p>position</p> <p><a href>label</a></p>…]
 * Classified by content, never by row index: every picture opens a contact; in a contact the
 * first text-only <p> is the name, the next the position; a <p> holding only a link is a
 * social link (its text becomes the icon button's aria-label; LinkedIn or mail icon by href).
 * Variants: `dark-blue` (navy band), `no-top` / `no-bottom` (source module without margins).
 * Capture state (replica): >= 768px the source repeats its list (doubling while it has fewer
 * than 10 cards) and centres card floor(n / 2) — the repeats are presentational clones (EW4,
 * aria-hidden, added here); below 768px a plain one-card slider with bullets, first card active.
 */

const ARROW = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" '
  + 'width="38" height="31" fill="none" viewBox="0 0 38 31"><path d="M17.764 3.048 5.128 '
  + '15.632l-.832-1.404h33.072v3.224H4.348l.78-1.404 12.636 12.584-2.132 2.132L.708 15.84 '
  + '15.632.916l2.132 2.132Z"/></svg>';

const LINKEDIN = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" '
  + 'width="17" height="16" fill="none" viewBox="0 0 17 16"><path d="M16.445 9.728v5.915h-3.429v-5.519c0-1.386-.496-2.332-1.737-2.332-.948 '
  + '0-1.512.637-1.76 1.254-.09.22-.114.528-.114.836v5.761h-3.43s.046-9.347 0-10.316h3.43V6.79l-.023.033h.023V6.79c.456-.702 '
  + '1.27-1.705 3.091-1.705 2.257 0 3.95 1.474 3.95 4.643ZM2.386.354c-1.173 0-1.94.77-1.94 1.783 0 .99.745 1.783 1.895 '
  + '1.783h.023c1.196 0 1.94-.793 1.94-1.783C4.282 1.124 3.56.354 2.386.354ZM.65 15.644h3.43V5.326H.648v10.316Z"/></svg>';

const MAIL = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" '
  + 'width="16" height="17" fill="none" viewBox="0 0 16 17"><path fill-rule="evenodd" '
  + 'd="M1.129 4.54v9.642h13.742V4.54L8 11.21 1.129 4.54ZM16 3.44V15.31H0v-13h16.001v1.13Zm-1.615 '
  + '0H1.615L8 9.647l6.385-6.207Z" clip-rule="evenodd"/></svg>';

const DESKTOP = window.matchMedia('(width >= 768px)');
const SPACE = 24;
// source Swiper coverflow (rotate 0, stretch 200px, depth 80, modifier 1, perspective 1200px)
const STRETCH = 200;
const DEPTH = 80;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

// a cell's authored elements; expands the runtime's wrapTextNodes <p> around media (#104)
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')
    && kids[0].children.length > 1) {
    kids = [...kids[0].children];
  }
  if (!kids.length && cell.textContent.trim()) {
    // HARNESS-ONLY fallback (EW5): DA cells always carry a <p>
    const p = el('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

const mediaOf = (n) => {
  if (n.matches('picture, img')) return n;
  if (n.tagName === 'P' && !n.textContent.trim()) return n.querySelector('picture') || n.querySelector('img');
  return null;
};

function linkOnly(n) {
  if (n.tagName !== 'P') return null;
  const a = n.querySelector('a[href]');
  if (!a || n.textContent.trim() !== a.textContent.trim()) return null;
  return a;
}

function segment(block) {
  const head = [];
  const contacts = [];
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    [...row.children].flatMap(cellNodes).forEach((n) => {
      if (mediaOf(n)) contacts.push([n]);
      else if (contacts.length) contacts[contacts.length - 1].push(n);
      else head.push(n);
    });
  });
  return { head, contacts };
}

function buildCard(nodes) {
  const slide = el('div', 'slider-contacts-slide', { role: 'group' });
  const card = el('div', 'slider-contacts-card');
  const imgBox = el('div', 'slider-contacts-img');
  const info = el('div', 'slider-contacts-info');
  const name = el('div', 'slider-contacts-name');
  const position = el('div', 'slider-contacts-position');
  const social = el('div', 'slider-contacts-social');
  nodes.forEach((n) => {
    const m = mediaOf(n);
    const a = linkOnly(n);
    if (m && !imgBox.children.length) {
      imgBox.append(m);
      if (n !== m && !n.children.length) n.remove();
    } else if (a) {
      // the authored <p> and link text stay (EW); the text is visually hidden beside the icon
      const mail = a.getAttribute('href').startsWith('mailto:');
      a.setAttribute('aria-label', a.textContent.trim());
      a.setAttribute('target', '_blank');
      const label = el('span', 'slider-contacts-label');
      label.append(...a.childNodes);
      a.innerHTML = mail ? MAIL : LINKEDIN;
      a.append(label);
      if (mail) n.classList.add('mobile-social');
      social.append(n);
    } else if (!name.children.length) {
      name.append(n);
    } else {
      position.append(n);
    }
  });
  info.append(name, position);
  if (social.children.length) info.append(social);
  card.append(imgBox, info);
  slide.append(card);
  return slide;
}

function clone(slide) {
  const c = slide.cloneNode(true);
  c.setAttribute('aria-hidden', 'true');
  c.classList.add('is-clone');
  c.querySelectorAll('[data-prose-index], [data-image-index]').forEach((x) => {
    x.removeAttribute('data-prose-index');
    x.removeAttribute('data-image-index');
  });
  c.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
  c.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
  return c;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .slider-contacts-swiper')) return; // EW9
  const { head, contacts } = segment(block);
  const originals = contacts.map(buildCard);
  const n = originals.length;

  const header = el('div', 'slider-contacts-header');
  const headline = el('div', 'slider-contacts-headline');
  headline.append(...head);
  if (!head.length) header.classList.add('has-no-text');
  else header.append(headline);
  const nav = el('div', 'slider-contacts-nav');
  const prev = el('button', 'slider-contacts-arrow', { type: 'button', 'aria-label': 'Go to previous slide' });
  prev.innerHTML = ARROW;
  const next = el('button', 'slider-contacts-arrow slider-contacts-arrow-next', { type: 'button', 'aria-label': 'Go to next slide' });
  next.innerHTML = ARROW;
  nav.append(prev, next);
  header.append(nav);

  const swiper = el('div', 'slider-contacts-swiper', { 'aria-label': 'Contacts Slider' });
  const track = el('div', 'slider-contacts-track');
  swiper.append(track);
  const pagination = el('div', 'slider-contacts-pagination');

  block.replaceChildren(header, swiper, pagination);

  // desktop repeat set: the authored cards, then clones while the rail holds fewer than 10
  const repeated = [...originals];
  if (n) {
    while (repeated.length < 10) {
      const len = repeated.length;
      for (let i = 0; i < len; i += 1) repeated.push(clone(repeated[i]));
    }
  }

  let slides = [];
  let active = 0;
  let coverflow = false;

  const layout = () => {
    // the slide width is the track's (the swiper's content box); 0 while the section is hidden
    const w = track.clientWidth;
    track.style.transform = `translateX(calc(${-active} * (100% + ${SPACE}px)))`;
    slides.forEach((s, i) => {
      const d = coverflow && w ? ((active - i) * (w + SPACE)) / w : 0;
      s.style.transform = coverflow
        ? `translate3d(${STRETCH * d}px, 0, ${-DEPTH * Math.abs(d)}px)` : '';
      s.style.zIndex = coverflow ? String(-Math.abs(active - i) + 1) : '';
      s.classList.toggle('is-active', i === active);
      s.classList.toggle('is-prev', i === active - 1);
      s.classList.toggle('is-next', i === active + 1);
      s.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
    });
    [...pagination.children].forEach((b, i) => b.classList.toggle('is-active', i === active));
  };

  const go = (to) => {
    active = Math.max(0, Math.min(slides.length - 1, to));
    layout();
  };

  const mount = () => {
    coverflow = DESKTOP.matches;
    slides = coverflow ? repeated : originals;
    track.replaceChildren(...slides);
    pagination.replaceChildren(...slides.map((s, i) => {
      const b = el('button', 'slider-contacts-bullet', { type: 'button', 'aria-label': `Go to slide ${i + 1}` });
      b.addEventListener('click', () => go(i));
      return b;
    }));
    block.classList.toggle('is-coverflow', coverflow);
    go(coverflow ? Math.floor(slides.length / 2) : 0);
  };

  prev.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  DESKTOP.addEventListener('change', mount);
  // re-layout once the section is shown (decorate runs while it is hidden) and on resize
  new ResizeObserver(() => layout()).observe(track);
  mount();
}
