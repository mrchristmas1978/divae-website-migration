/**
 * article-hero — blog article lead: 88vh cover image with a white box overlapping its foot
 * (meta line, <h1>, subtitle, author).
 * Schema: stardust/eds-schema/en-insights-edge-ai-radar-october.json § article-hero.
 * Decode tier: template-slotted (fixed composition, authored nodes MOVED by role).
 *
 * Authoring (rows or one flattened cell — classified by content and order, never by index):
 *   - <picture>/<img> BEFORE the heading: the cover image
 *   - <ul> of categories (one <li> each) BEFORE the heading
 *   - <p> BEFORE the heading: the date
 *   - <h1>: the article title
 *   - <p> after the heading (before the avatar): the subtitle
 *   - <picture>/<img> AFTER the heading: the author avatar; the <p> after it: the author name
 */

const isMedia = (el) => el.matches('picture, img');
const mediaOf = (el) => (isMedia(el) ? el : el.querySelector('picture, img'));
const hasText = (el) => el.textContent.trim().length > 0;

// Collect the authored elements of every cell, in order (EW1: existing nodes only).
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img') && hasText(kids[0])) {
      // the runtime's wrapTextNodes folded a media-led cell into one <p>: expand it
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): a bare text node; move the node, never copy its text
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (hasText(cell)) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hero-media, :scope > .hero-box-wrap')) return; // EW9
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  const headingIdx = nodes.findIndex((n) => /^H[1-6]$/.test(n.tagName));
  const heading = headingIdx >= 0 ? nodes[headingIdx] : null;
  const before = headingIdx >= 0 ? nodes.slice(0, headingIdx) : nodes;
  const after = headingIdx >= 0 ? nodes.slice(headingIdx + 1) : [];

  let cover = null;
  const cats = [];
  const dates = [];
  const leftovers = [];
  before.forEach((n) => {
    const m = mediaOf(n);
    if (m && !hasText(n) && !cover) cover = m;
    else if (n.matches('ul, ol')) cats.push(n);
    else if (n.tagName === 'P' && hasText(n)) dates.push(n);
    else leftovers.push(n);
  });

  let avatar = null;
  const subtitles = [];
  const names = [];
  after.forEach((n) => {
    const m = mediaOf(n);
    if (m && !hasText(n) && !avatar) avatar = m;
    else if (n.tagName === 'P' && hasText(n)) (avatar ? names : subtitles).push(n);
    else leftovers.push(n);
  });

  const media = div('hero-media');
  if (cover) media.append(cover);

  const box = div('hero-box');
  if (cats.length || dates.length) {
    const meta = div('article-meta');
    if (cats.length) {
      meta.classList.add('has-cats');
      const c = div('meta-cats');
      c.append(...cats);
      meta.append(c);
    }
    if (dates.length) {
      const d = div('meta-date');
      d.append(...dates);
      meta.append(d);
    }
    box.append(meta);
  }
  if (heading) {
    const t = div('hero-title');
    t.append(heading);
    box.append(t);
  }
  if (subtitles.length) {
    const s = div('hero-subtitle');
    s.append(...subtitles);
    box.append(s);
  }
  if (avatar || names.length) {
    const author = div('article-author');
    if (avatar) {
      const a = div('author-img');
      a.append(avatar);
      author.append(a);
    }
    if (names.length) {
      const nm = div('author-name');
      nm.append(...names);
      author.append(nm);
    }
    box.append(author);
  }
  if (leftovers.length) box.append(...leftovers); // never drop an authored element

  const wrap = div('hero-box-wrap');
  wrap.append(box);
  block.replaceChildren(media, wrap);

  const img = media.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
  }
}
