/**
 * slider-cards — diva-e SliderCards "Our stories" rail (canon § 11).
 * Schema: stardust/eds-schema/en.json (section slider-cards, 20 × DIV.story-card).
 * Decode tier: reconstructive (repeat group). Authored shape (container):
 *   head row    — the section <h2> (rows before the first story image)
 *   story rows  — one row per story: [image] [<p> date, <p><a href>title</a></p>]
 * Classified by content, never by row index: every picture opens a story (a flattened single
 * cell segments the same way); in a story the link-only paragraph is the title (card-as-link,
 * EW6: its href is read and the anchor unwrapped, the title text stays in the authored <p>),
 * the other paragraphs are the date line; leftovers join the title.
 * Capture state (replica progress.json): the source's Swiper loop renders the set twice with
 * the LAST story first and the second slide active (track shifted one card left).
 * The first copy holds the authored nodes; the second (presentational clones, EW4) is added on
 * the first prev/next click — at rest it is never in view.
 * The hover cursor's "View More" label is code-owned decoration painted by CSS (::before),
 * so the served HTML and the rendered text stay equal (ai-readability).
 */

const ARROW = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" '
  + 'width="38" height="31" fill="none" viewBox="0 0 38 31"><path fill="#081235" d="M17.764 '
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
  const stories = [];
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    [...row.children].flatMap(cellNodes).forEach((n) => {
      if (mediaOf(n)) stories.push([n]);
      else if (stories.length) stories[stories.length - 1].push(n);
      else head.push(n);
    });
  });
  return { head, stories };
}

function buildStory(nodes) {
  const card = el('div', 'story-card', { role: 'group' });
  const link = el('a', 'story-card-link');
  const imgBox = el('div', 'story-card-img');
  const media = el('div', 'story-card-media');
  const hover = el('div', 'story-card-hover');
  const cursor = el('div', 'story-card-cursor');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.append(el('span'));
  const hoverLink = el('a', 'story-card-hover-link', { 'aria-label': 'link' });
  hover.append(cursor, hoverLink);
  const name = el('div', 'story-card-name dot-blur');
  const date = el('div', 'story-card-date');
  const title = el('div', 'story-card-title h5');
  let href = null;
  const titleNode = nodes.find((n) => linkOnly(n));
  nodes.forEach((n) => {
    const m = mediaOf(n);
    if (m && !media.children.length) {
      const image = m.tagName === 'IMG' ? m : m.querySelector('img');
      if (image) image.loading = 'eager';
      media.append(m);
      if (n !== m && !n.children.length) n.remove();
    } else if (n === titleNode) {
      const a = linkOnly(n);
      href = a.getAttribute('href');
      a.replaceWith(...a.childNodes); // EW6: card-as-link, the title text stays authored
      title.append(n);
    } else if (!titleNode || nodes.indexOf(n) < nodes.indexOf(titleNode)) {
      date.append(n);
    } else {
      title.append(n);
    }
  });
  if (href) {
    link.href = href;
    hoverLink.href = href;
    link.setAttribute('aria-label', `Go to ${title.textContent.trim()}`);
  }
  imgBox.append(media, hover);
  name.append(date);
  card.append(link, imgBox, name, title);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .slider-cards-swiper')) return; // EW9
  const { head, stories } = segment(block);
  const originals = stories.map(buildStory);
  const n = originals.length;

  const header = el('div', 'slider-cards-header');
  const headline = el('div', 'slider-cards-headline');
  headline.append(...head);
  header.append(headline);

  const swiper = el('div', 'slider-cards-swiper');
  const viewport = el('div', 'slider-cards-viewport', { 'aria-label': 'Cards Slider' });
  const track = el('div', 'slider-cards-track');
  // Swiper loop: last story first, then the set. The loop's second copy (presentational
  // clones, EW4) is appended on the first navigation only: at rest it is never in view, and
  // cloned text would double the rendered words a non-rendering crawler cannot see.
  // A set the source repeats three times or more (< 8 stories: 2, 3, 5, 6 measured) rests on
  // the first story instead (gate-all 1440: retail, b2b, security-quiz, services/ai).
  const rotate = n >= 8;
  const order = n && rotate ? [originals[n - 1], ...originals.slice(0, n - 1)] : [...originals];
  const slides = [...order];
  const label = () => slides.forEach((s, i) => s.setAttribute('aria-label', `${i + 1} / ${n * 2}`));
  slides.forEach((s) => track.append(s));
  label();
  let cloned = false;
  const ensureClones = () => {
    if (cloned || !n) return;
    cloned = true;
    order.forEach((s) => {
      const clone = stripInstrumentation(s.cloneNode(true));
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
      slides.push(clone);
      track.append(clone);
    });
    label();
  };
  // a short set: the source Swiper loop repeats it until >= 15 slides fill the rail (2 stories
  // x8, 6 x3), so those copies are in view at rest and appended up front
  if (n && n < 15) {
    const copies = Math.ceil(15 / n);
    ensureClones();
    for (let k = 2; k < copies; k += 1) {
      order.forEach((s) => {
        const clone = stripInstrumentation(s.cloneNode(true));
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        slides.push(clone);
        track.append(clone);
      });
    }
    slides.forEach((s, i) => s.setAttribute('aria-label', `${i + 1} / ${slides.length}`));
  }
  viewport.append(track);
  swiper.append(viewport);

  const nav = el('div', 'slider-cards-nav');
  const navInner = el('div', 'slider-cards-nav-inner');
  const prev = el('button', 'slider-cards-arrow', { type: 'button', 'aria-label': 'Go to previous slide' });
  prev.innerHTML = ARROW;
  const next = el('button', 'slider-cards-arrow slider-cards-arrow-next', { type: 'button', 'aria-label': 'Go to next slide' });
  next.innerHTML = ARROW;
  navInner.append(prev, next);
  nav.append(navInner);

  block.replaceChildren(header, swiper, nav);

  let active = n ? 1 : 0;
  const go = (to) => {
    if (to !== active) ensureClones();
    active = Math.max(1, Math.min(Math.max(slides.length - 1, 1), to));
    track.style.setProperty('--shift', String(active - 1));
    slides.forEach((s, i) => s.classList.toggle('is-active', i === active));
  };
  prev.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  go(active);
}
