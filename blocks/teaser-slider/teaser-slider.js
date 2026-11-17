/**
 * teaser-slider — diva-e TeaserSlider (canon § 9-10): a heading and a project coverflow.
 * Schema: stardust/eds-schema/en-services-crm.json (section teaser-slider).
 * Decode tier: reconstructive (repeat group). Authored shape (container):
 *   head row    — the section <h2> (rows before the first item heading)
 *   item rows   — one row per project: [image, optional logo image] [<h4> name, <p> text,
 *                 <p><a>Learn more</a></p>]
 * A flattened single cell segments on the most frequent heading tag; pictures before a
 * heading belong to the item that heading opens (first = image, second = logo).
 * Capture state restored (replica progress.json captureState): from 950px the source's Swiper
 * loops the set to >= 15 slides (4 x4 = 16, 5 x3 = 15, 6 x3 = 18, 9 x2 = 18), the middle slide
 * active (9/16, 10/18); below 950px the unique set renders once, first slide active.
 * The authored items sit in the copy holding the active slide; every other copy is a
 * presentational clone with its editor indices stripped (EW4).
 * @variants light (source teaser-slider--bg-light: page-ground band, navy item cards)
 */

const LOOP_MIN = 15;
const ARROW = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" '
  + 'width="38" height="31" fill="none" viewBox="0 0 38 31"><path fill="#EDF0FB" d="M17.764 '
  + '3.048 5.128 15.632l-.832-1.404h33.072v3.224H4.348l.78-1.404 12.636 12.584-2.132 2.132L.708 '
  + '15.84 15.632.916l2.132 2.132Z"/></svg>';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
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

function mediaList(n) {
  if (n.matches('picture, img')) return [n];
  if (n.tagName === 'P' && !n.textContent.trim()) {
    return [...n.querySelectorAll('picture, img')].filter((m) => !m.closest('picture') || m.tagName === 'PICTURE');
  }
  return [];
}

function itemHeadingTag(block) {
  const counts = {};
  block.querySelectorAll('h2, h3, h4, h5, h6').forEach((h) => {
    counts[h.tagName] = (counts[h.tagName] || 0) + 1;
  });
  const tags = Object.keys(counts);
  if (!tags.length) return null;
  return tags.sort((a, b) => counts[b] - counts[a] || b.localeCompare(a))[0];
}

function segment(block) {
  const tag = itemHeadingTag(block);
  const head = [];
  const items = [];
  let pending = [];
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    [...row.children].flatMap(cellNodes).forEach((n) => {
      if (tag && n.tagName === tag) {
        items.push([...pending, n]);
        pending = [];
      } else if (mediaList(n).length) {
        pending.push(n);
      } else if (items.length) {
        items[items.length - 1].push(...pending, n);
        pending = [];
      } else {
        head.push(...pending, n);
        pending = [];
      }
    });
  });
  if (pending.length) (items.length ? items[items.length - 1] : head).push(...pending);
  return { head, items };
}

function buildItem(nodes) {
  const item = el('div', 'teaser-item', { role: 'group' });
  const inner = el('div', 'teaser-item-inner');
  const image = el('div', 'teaser-item-image');
  const photo = el('div', 'teaser-item-photo');
  const icon = el('div', 'teaser-item-icon');
  const text = el('div', 'teaser-item-text');
  const headline = el('div', 'teaser-item-headline');
  const body = el('div', 'teaser-item-body');
  const cta = el('div', 'teaser-item-cta');
  let pics = 0;
  nodes.forEach((n) => {
    const media = mediaList(n);
    if (media.length) {
      media.forEach((m) => {
        const img = m.tagName === 'IMG' ? m : m.querySelector('img');
        if (img) img.loading = 'eager';
        if (pics === 0) photo.append(m);
        else icon.append(m);
        pics += 1;
      });
      if (n !== media[0] && !n.textContent.trim() && !n.querySelector('picture, img')) n.remove();
    } else if (/^H[1-6]$/.test(n.tagName) && !headline.children.length) {
      headline.append(n);
    } else if (n.tagName === 'P' && n.querySelector('a[href]')
      && n.textContent.trim() === n.querySelector('a[href]').textContent.trim()) {
      cta.append(n);
    } else {
      body.append(n);
    }
  });
  image.append(photo);
  if (icon.children.length) image.append(icon);
  text.append(headline);
  if (body.children.length) text.append(body);
  if (cta.children.length) text.append(cta);
  inner.append(image, text);
  item.append(inner);
  return item;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-slider-swiper')) return; // EW9
  const { head, items } = segment(block);
  const originals = items.map(buildItem);
  const n = originals.length;
  const loop = n > 0 && window.matchMedia('(min-width: 950px)').matches;
  const copies = loop ? Math.max(1, Math.ceil(LOOP_MIN / n)) : 1;
  const total = n * copies;
  const active = loop ? Math.floor(total / 2) : 0;
  const home = Math.floor(active / Math.max(n, 1)); // the copy that holds the authored items

  const header = el('div', 'teaser-slider-header');
  header.append(...head);
  const swiper = el('div', 'teaser-slider-swiper', { 'aria-label': 'Teaser Slider' });
  const track = el('div', 'teaser-slider-track');
  const bullets = el('div', 'teaser-slider-bullets');
  const slides = [];
  for (let c = 0; c < copies; c += 1) {
    originals.forEach((orig) => {
      const slide = c === home ? orig : stripInstrumentation(orig.cloneNode(true));
      slides.push(slide);
    });
  }
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-label', `${i + 1} / ${total}`);
    track.append(slide);
    bullets.append(el('span', 'teaser-slider-bullet', {
      role: 'button', tabindex: '0', 'aria-label': `Go to slide ${i + 1}`,
    }));
  });
  swiper.append(track, bullets);

  const nav = el('div', 'teaser-slider-nav');
  const prevWrap = el('div', 'btn-arrow');
  const prev = el('button', '', { type: 'button', 'aria-label': 'Go to previous slide' });
  prev.innerHTML = ARROW;
  prevWrap.append(prev);
  const nextWrap = el('div', 'btn-arrow btn-arrow-next');
  const next = el('button', '', { type: 'button', 'aria-label': 'Go to next slide' });
  next.innerHTML = ARROW;
  nextWrap.append(next);
  nav.append(prevWrap, nextWrap);

  block.replaceChildren(header, swiper, nav);

  let current = active;
  const go = (to) => {
    current = Math.max(0, Math.min(slides.length - 1, to));
    track.style.setProperty('--active', String(current));
    slides.forEach((s, i) => {
      s.style.setProperty('--k', String(i - current));
      s.style.setProperty('--ak', String(Math.abs(i - current)));
      s.classList.toggle('is-active', i === current);
      s.classList.toggle('swiper-slide-active', i === current);
      s.classList.toggle('swiper-slide-prev', i === current - 1);
      s.classList.toggle('swiper-slide-next', i === current + 1);
    });
    [...bullets.children].forEach((b, i) => b.classList.toggle('is-active', i === current));
  };
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  [...bullets.children].forEach((b, i) => {
    b.addEventListener('click', () => go(i));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') go(i);
    });
  });
  go(active);
}
