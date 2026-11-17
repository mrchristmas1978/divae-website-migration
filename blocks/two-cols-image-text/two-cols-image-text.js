/**
 * two-cols-image-text — source TwoColsImageText (customers "Our latest success story"): a
 * headline across the top, then a panned image (5 of 10 columns) beside a text column
 * (4 of 10) with an optional CTA. Decode tier: template-slotted.
 * Authoring (classified by role, any row/cell layout): heading → headline; <picture> → image;
 * <p>/<ul>/<ol> → text; CTA <p> (<strong>/<em> link) → button row.
 * Variants: dark-blue (navy band) · reverse (image right) · top / bottom (source margins).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .two-cols-image-text-container')) return; // EW9
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (cell.children.length) nodes.push(...cell.children);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    }
  });
  const headline = div('two-cols-image-text-headline');
  const media = div('two-cols-image-text-img');
  const info = div('two-cols-image-text-info');
  nodes.forEach((n) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (pic && !n.textContent.trim() && !media.childElementCount) media.append(pic);
    else if (/^H[1-6]$/.test(n.tagName) && !headline.childElementCount && !info.childElementCount) {
      headline.append(n);
    } else {
      if (n.querySelector(':scope > a.button, :scope > strong > a, :scope > em > a')) {
        n.classList.add('two-cols-image-text-btn');
      }
      info.append(n);
    }
  });
  const container = div('two-cols-image-text-container');
  if (headline.childElementCount) container.append(headline);
  if (media.childElementCount) container.append(media);
  container.append(info);
  block.replaceChildren(container);
}
