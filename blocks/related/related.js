/**
 * related — "Recommended Reads": section title + a rail of article cards (media, meta line,
 * linked title, 3-line teaser, author). 3 per view >=1200, 2 >=950, 1.1 below (static
 * overflow-clipped track, as gated).
 * Schema: stardust/eds-schema/en-insights-edge-ai-radar-october.json § related.
 * Decode tier: reconstructive (authors add/remove cards).
 *
 * Authoring: first row = the section title (<h2>); then one row per card:
 *   <picture> (card image) · <ul> of categories · <p> date · <h3> with the article link ·
 *   <p> teaser · <picture> (author avatar) · <p> author name.
 * A flattened single cell is segmented on the card heading, the pictures and lists by order.
 * The card title's authored link is read and unwrapped (EW6); the card links are overlays.
 * "View more" is a presentational hover label (aria-hidden), not authored text.
 */

const isMedia = (el) => el.matches('picture, img');
const mediaOf = (el) => (isMedia(el) ? el : el.querySelector('picture, img'));
const hasText = (el) => el.textContent.trim().length > 0;
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function rowNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img') && hasText(kids[0])) {
      // the runtime's wrapTextNodes folded a media-led cell into one <p>: expand it
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): move the bare text node into a <p>, never copy it
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

const emptyCard = () => ({
  media: null, cats: [], dates: [], heading: null, teaser: [], avatar: null, names: [], rest: [],
});
const isEmpty = (c) => !c.media && !c.cats.length && !c.dates.length && !c.heading
  && !c.teaser.length && !c.avatar && !c.names.length && !c.rest.length;

function buildMeta(cats, dates) {
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
  return meta;
}

function overlayLink(href, className, label) {
  const a = document.createElement('a');
  a.className = className;
  a.href = href;
  a.setAttribute('aria-label', label);
  return a;
}

function buildCard(c) {
  const card = document.createElement('article');
  card.className = 'article-card';
  let href = null;
  const titleLink = c.heading ? c.heading.querySelector('a[href]') : null;
  if (titleLink) {
    href = titleLink.getAttribute('href');
    titleLink.replaceWith(...titleLink.childNodes); // EW6: no nested anchors
  }
  const titleText = c.heading ? c.heading.textContent.trim() : '';

  const media = div('card-media');
  if (c.media) media.append(c.media);
  const hover = div('card-hover');
  hover.setAttribute('aria-hidden', 'true');
  const hoverLabel = document.createElement('div');
  hoverLabel.textContent = 'View more';
  hover.append(hoverLabel);
  media.append(hover);
  if (href) media.append(overlayLink(href, 'card-media-link', 'link'));
  card.append(media);

  if (c.cats.length || c.dates.length) card.append(buildMeta(c.cats, c.dates));

  if (c.heading) {
    const title = div('card-title');
    if (href) title.append(overlayLink(href, 'card-link', `Go to ${titleText}`));
    title.append(c.heading);
    card.append(title);
  }
  if (c.teaser.length) {
    const t = div('card-teaser');
    t.append(...c.teaser);
    card.append(t);
  }
  if (c.avatar || c.names.length) {
    const author = div('article-author');
    if (c.avatar) {
      const a = div('author-img');
      a.append(c.avatar);
      author.append(a);
    }
    if (c.names.length) {
      const n = div('author-name');
      n.append(...c.names);
      author.append(n);
    }
    card.append(author);
  }
  if (c.rest.length) card.append(...c.rest); // never drop an authored element

  const slide = div('related-slide');
  slide.setAttribute('role', 'group');
  slide.append(card);
  return slide;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .related-rail')) return; // EW9
  const rows = [...block.children];
  if (!rows.length) return;
  const perRow = rows.map(rowNodes);
  const all = perRow.flat();

  const tally = {};
  all.filter(isHeading).forEach((h) => { tally[h.tagName] = (tally[h.tagName] || 0) + 1; });
  const unitTag = Object.keys(tally).sort((a, b) => tally[b] - tally[a]
    || Number(b[1]) - Number(a[1]))[0];

  const head = [];
  const cards = [];
  perRow.forEach((nodes) => {
    let c = emptyCard();
    const push = () => {
      if (!isEmpty(c)) cards.push(c);
      c = emptyCard();
    };
    nodes.forEach((n) => {
      const m = mediaOf(n);
      if (isHeading(n) && n.tagName !== unitTag && !cards.length && isEmpty(c)) {
        head.push(n);
      } else if (isHeading(n)) {
        if (c.heading) push();
        c.heading = n;
      } else if (m && !hasText(n)) {
        if (!c.heading && !c.media) c.media = m;
        else if (c.heading && !c.avatar) c.avatar = m;
        else {
          push();
          c.media = m;
        }
      } else if (n.matches('ul, ol')) {
        if (c.heading) push();
        c.cats.push(n);
      } else if (n.tagName === 'P' && hasText(n)) {
        if (!c.heading) c.dates.push(n);
        else if (c.avatar) c.names.push(n);
        else c.teaser.push(n);
      } else if (!cards.length && isEmpty(c) && !head.length) {
        head.push(n);
      } else {
        c.rest.push(n);
      }
    });
    push();
  });

  const out = [];
  if (head.length) {
    const title = div('related-title');
    title.append(...head);
    out.push(title);
  }
  const track = div('related-track');
  cards.forEach((c, i) => {
    const slide = buildCard(c);
    slide.setAttribute('aria-label', `${i + 1} / ${cards.length}`);
    track.append(slide);
  });
  const rail = div('related-rail');
  rail.setAttribute('aria-label', 'Related Articles Slider');
  rail.append(track);
  out.push(rail);
  block.replaceChildren(...out);
}
