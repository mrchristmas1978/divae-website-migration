/**
 * author-card — grey rounded card: avatar column (photo, name, social icon links) beside the
 * bio column (paragraphs + "see all articles" link).
 * Schema: stardust/eds-schema/en-insights-edge-ai-radar-october.json § author-card.
 * Decode tier: template-slotted (fixed composition, authored nodes MOVED by role).
 *
 * Authoring (any row/cell split — classified by content and order):
 *   - <picture>/<img>: the avatar
 *   - first text-only <p>: the name; later text-only <p>s: the bio
 *   - <p> whose link carries an icon (:linkedin:) or no text: social links
 *   - <p> whose link carries text: the "see all articles" link
 */

const isMedia = (el) => el.matches('picture, img');
const mediaOf = (el) => (isMedia(el) ? el : el.querySelector('picture, img'));
const hasText = (el) => el.textContent.trim().length > 0;

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (hasText(cell)) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy them
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .author-box')) return; // EW9
  const nodes = collectNodes(block);
  if (!nodes.length) return;

  let avatar = null;
  let name = null;
  const social = [];
  const bio = [];
  const links = [];
  const leftovers = [];
  nodes.forEach((n) => {
    const m = mediaOf(n);
    const link = n.matches('a') ? n : n.querySelector('a[href]');
    if (m && !hasText(n) && !link && !avatar) {
      avatar = m;
    } else if (link && (link.querySelector('.icon, svg, img') || !hasText(link))) {
      social.push(n);
    } else if (link) {
      links.push(n);
    } else if (n.tagName === 'P' && hasText(n) && !name) {
      name = n;
    } else if (n.matches('p, ul, ol')) {
      bio.push(n);
    } else {
      leftovers.push(n);
    }
  });

  const colA = div('author-col author-col-avatar');
  if (avatar) {
    const a = div('author-img');
    a.append(avatar);
    colA.append(a);
  }
  if (name) {
    const nm = div('author-name');
    nm.append(name);
    colA.append(nm);
  }
  if (social.length) {
    const s = div('author-social');
    s.append(...social);
    s.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener';
      if (!a.getAttribute('aria-label') && name) a.setAttribute('aria-label', `Go to ${name.textContent.trim()} linkedin`);
    });
    colA.append(s);
  }

  const colB = div('author-col');
  if (bio.length) {
    const b = div('author-bio');
    b.append(...bio);
    colB.append(b);
  }
  if (links.length) {
    const l = div('author-link');
    l.append(...links);
    colB.append(l);
  }
  if (leftovers.length) colB.append(...leftovers); // never drop an authored element

  const box = div('author-box');
  box.append(colA, colB);
  block.replaceChildren(box);
}
