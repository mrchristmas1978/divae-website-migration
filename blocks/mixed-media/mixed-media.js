/**
 * mixed-media — source component MixedMedia: an image beside a label / title / text column.
 * Decode tier: template-slotted. Schema: stardust/eds-schema/en-about-us-customers-mann-hummel.json
 * (sections mixed-media).
 *
 * Authoring (one row: image | copy — or every element flat in one cell; classified by role):
 *   <picture>/<img>                       → .mixed-media-media (one image; below 768px CSS moves
 *                                           it between title and text — no clone)
 *   <h5>/<h6> (or a short <p>) before the title → .mixed-media-info-label (blurred dot)
 *   the title heading (<h2>)              → .mixed-media-info-title
 *   (article) first <p> after the title   → .mixed-media-info-date
 *   <p>/<ul>/<ol> after the title         → .mixed-media-info-txt
 *   CTA <p> (<strong>/<em> link)          → .mixed-media-info-link
 *
 * Variants (block classes): (default) left — image left; right — image right;
 *   article — insights teaser: perspective image, italic title, date line, large text.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text beside an image — move the text node
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
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

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
const mediaOf = (el) => {
  if (el.matches('picture, img')) return el;
  if (el.tagName === 'P' && !el.textContent.trim()) return el.querySelector('picture, img');
  return null;
};
const isCta = (el) => el.tagName === 'P' && el.querySelector('a[href]')
  && el.textContent.trim() === el.querySelector('a[href]').textContent.trim();

export default function decorate(block) {
  if (block.querySelector(':scope > .mixed-media-grid')) return; // EW9

  const nodes = collectNodes(block);
  const headings = nodes.filter(isHeading);
  // the title is the highest-level heading; a smaller heading before it is the label
  const title = headings.reduce((best, h) => (!best || h.tagName < best.tagName ? h : best), null);
  const article = block.classList.contains('article');

  const label = div('mixed-media-info-label');
  const titleBox = div('mixed-media-info-title');
  const date = div('mixed-media-info-date');
  const txt = div('mixed-media-info-txt');
  const link = div('mixed-media-info-link');
  const img = div('mixed-media-img');
  let seenTitle = !title;
  nodes.forEach((el) => {
    const media = mediaOf(el);
    if (el === title) {
      titleBox.append(el);
      seenTitle = true;
    } else if (media) {
      if (!img.childElementCount) img.append(media);
    } else if (isCta(el)) {
      link.append(el);
    } else if (!seenTitle) {
      label.append(el);
    } else if (article && !date.childElementCount && el.tagName === 'P') {
      date.append(el);
    } else {
      txt.append(el);
    }
  });

  const mediaCol = div('mixed-media-media');
  mediaCol.append(img);
  const info = div('mixed-media-info');
  [label, titleBox, date, txt, link].forEach((box) => {
    if (box.childElementCount) info.append(box);
  });
  const grid = div('mixed-media-grid');
  if (img.childElementCount) grid.append(mediaCol);
  else block.classList.add('no-media');
  grid.append(info);
  block.replaceChildren(grid);
}
