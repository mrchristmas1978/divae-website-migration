/**
 * cards — diva-e CardsBlock (canon § 8): an optional tagline and N cards in a 1 / 2 / 3-up grid.
 * Schema: stardust/eds-schema/en-services-crm.json (section cards-block, 6 × card).
 * Decode tier: reconstructive (repeat group). Authored shape (container):
 *   head rows   — rows before the first card heading (the tagline <h2>, optional <p>)
 *   card rows   — one row per card: [optional image cell] [title <p> (the source's titles
 *                 are not headings), <p> text…, optional link-only <p> = "Learn more" CTA];
 *                 a link-only title <p> = a linked card without a visible CTA (overlay only);
 *                 an image AFTER the title is card text (source richtext image), not the icon
 *                 a heading as the title works too (then the title is the heading)
 * A flattened single cell segments on the most frequent heading tag (heading-titled cards);
 * a picture just before a card heading belongs to that card. Every authored node is MOVED (EW1).
 * A card with a link-only paragraph becomes card-as-link: the authored link stays the
 * visible CTA and an empty overlay anchor (no authored text) covers the card.
 *
 * @variants light | dark (default light); col-3; icon; tagline-left; link-overlay (a card whose
 *   only text is a linked title still becomes card-as-link); flush (no gap under the tagline);
 *   single (the block is one card, no tagline)
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// a cell's authored elements; expands the runtime's wrapTextNodes <p> around media (#104)
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')
    && kids[0].children.length > 1) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      // HARNESS-ONLY fallback (EW5): wrap the existing text node, never copy its text
      if (n.textContent.trim()) {
        const p = el('p');
        p.append(n);
        return p;
      }
      return null;
    }).filter(Boolean);
  }
  if (!kids.length && cell.textContent.trim()) {
    // HARNESS-ONLY fallback (EW5): DA cells always carry a <p>
    const p = el('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

// the media node of an element: itself, or the picture/img a media-only <p> holds
function mediaOf(n) {
  if (n.matches('picture, img')) return n;
  if (n.tagName === 'P' && !n.textContent.trim()) return n.querySelector('picture, img');
  return null;
}

function cardHeadingTag(block) {
  const counts = {};
  block.querySelectorAll('h2, h3, h4, h5, h6').forEach((h) => {
    counts[h.tagName] = (counts[h.tagName] || 0) + 1;
  });
  const tags = Object.keys(counts);
  if (!tags.length) return null;
  // most frequent; a tie goes to the deeper level (the lone tagline is one level up)
  return tags.sort((a, b) => counts[b] - counts[a] || b.localeCompare(a))[0];
}

function segment(block) {
  const tag = cardHeadingTag(block);
  const rows = [...block.querySelectorAll(':scope > div')];
  // variant `single` (additive): the whole block is ONE card (a lone card has no heading or
  // second row to segment on, and would otherwise read as the tagline)
  if (block.classList.contains('single')) {
    return { head: [], cards: [rows.flatMap((r) => [...r.children].flatMap(cellNodes))] };
  }
  const head = [];
  const cards = [];
  const headingCards = tag && rows.filter((r) => r.querySelectorAll(tag).length === 1).length >= 2;
  if (rows.length > 1 && !headingCards) {
    // one row per card; leading rows that open with a heading are the head (tagline)
    rows.forEach((row) => {
      const nodes = [...row.children].flatMap(cellNodes);
      const isHead = !cards.length && nodes.length > 0 && isHeading(nodes[0]);
      if (isHead) head.push(...nodes);
      else cards.push(nodes);
    });
    return { head, cards };
  }
  if (headingCards) {
    // one row per card with a card heading, fields in authored order (#73)
    rows.forEach((row) => {
      const nodes = [...row.children].flatMap(cellNodes);
      if (row.querySelectorAll(tag).length === 1) cards.push(nodes);
      else if (!cards.length) head.push(...nodes);
      else cards[cards.length - 1].push(...nodes);
    });
    return { head, cards };
  }
  // flattened single cell: heading-boundary segmentation, media before a heading opens with it
  let pending = [];
  rows.flatMap((r) => [...r.children].flatMap(cellNodes)).forEach((n) => {
    if (tag && n.tagName === tag) {
      cards.push([...pending, n]);
      pending = [];
    } else if (mediaOf(n)) {
      pending.push(n);
    } else if (cards.length) {
      cards[cards.length - 1].push(...pending, n);
      pending = [];
    } else {
      head.push(...pending, n);
      pending = [];
    }
  });
  if (pending.length) (cards.length ? cards[cards.length - 1] : head).push(...pending);
  return { head, cards };
}

function linkOnly(n) {
  if (n.tagName !== 'P') return null;
  const a = n.querySelector('a[href]');
  if (!a || n.textContent.trim() !== a.textContent.trim()) return null;
  return a;
}

function buildCard(nodes, dark, linkOverlay = false) {
  const card = el('article', `card ${dark ? 'card-dark' : 'card-light'}`);
  const info = el('div', 'card-info');
  const title = el('div', 'card-title');
  const txt = el('div', 'card-txt');
  const cta = el('div', 'card-cta');
  let href = null;
  let media = null;
  // the title is the card's heading, or (the source's own shape) its first text paragraph;
  // a link-only FIRST text paragraph is a linked title (card-as-link without a visible CTA):
  // its href drives the overlay and the anchor is unwrapped, the title text stays (EW6)
  const firstText = nodes.find((n) => !mediaOf(n));
  let titleHref = null;
  // `link-overlay` variant: a lone linked title is enough (icon + title card, no other text)
  if (!nodes.find(isHeading) && firstText && linkOnly(firstText)
    && (linkOverlay || nodes.filter((n) => !mediaOf(n)).length > 1)) {
    const a = linkOnly(firstText);
    titleHref = a.getAttribute('href');
    a.replaceWith(...a.childNodes);
  }
  const titleNode = nodes.find(isHeading)
    || nodes.find((n) => n.tagName === 'P' && !mediaOf(n) && !linkOnly(n));
  let seenTitle = false;
  nodes.forEach((n) => {
    const m = mediaOf(n);
    const link = linkOnly(n);
    if (n === titleNode) seenTitle = true;
    if (m && !media && !seenTitle) {
      media = el('div', 'card-icon');
      media.append(m);
      if (n !== m && !n.children.length) n.remove();
    } else if (n === titleNode) {
      title.append(n);
    } else if (link) {
      href = href || link.getAttribute('href');
      cta.append(n);
    } else {
      txt.append(n);
    }
  });
  if (media) card.append(media);
  info.append(title);
  if (txt.children.length) info.append(txt);
  if (cta.children.length) info.append(cta);
  card.append(info);
  href = href || titleHref;
  if (href) {
    const overlay = el('a', 'card-link');
    overlay.href = href;
    overlay.setAttribute('aria-label', `Go to ${title.textContent.trim()}`);
    overlay.tabIndex = -1;
    card.append(overlay);
    card.classList.add('has-link');
  }
  return card;
}

// the source equalises card titles per visual row (inline min-height = tallest in row)
function equaliseTitles(grid) {
  const titles = [...grid.querySelectorAll('.card-title')];
  const run = () => {
    titles.forEach((t) => { t.style.minHeight = ''; });
    const rows = new Map();
    titles.forEach((t) => {
      const top = t.closest('.card').offsetTop;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(t);
    });
    rows.forEach((row) => {
      const h = Math.max(...row.map((t) => t.offsetHeight));
      row.forEach((t) => { t.style.minHeight = `${h}px`; });
    });
  };
  run();
  window.addEventListener('resize', run);
  if (document.fonts) document.fonts.ready.then(run);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .cards-grid')) return; // EW9: already decorated
  const dark = block.classList.contains('dark');
  const { head, cards } = segment(block);
  const grid = el('div', 'cards-grid');
  if (head.length) {
    const tagline = el('div', 'cards-tagline');
    tagline.append(...head);
    grid.append(tagline);
  }
  cards.forEach((nodes) => grid.append(buildCard(nodes, dark, block.classList.contains('link-overlay'))));
  block.replaceChildren(grid);
  if (block.classList.contains('col-3')) {
    requestAnimationFrame(() => equaliseTitles(grid));
  }
}
