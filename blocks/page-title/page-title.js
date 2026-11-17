/**
 * page-title — source HeroPageTitle: a title band (navy when `dark-blue`) with the brand's
 * decorative blue line behind the copy. Decode tier: template-slotted.
 *
 * Authoring (one cell, any order — classified by role):
 *   eyebrow <p> before the heading  → .page-title-label
 *   <h1> (any heading)               → .page-title-title
 *   CTA <p> (<strong>/<em> link)     → .page-title-actions
 *
 * @ew-exempt decorative line SVG — presentational, code-owned
 * Variants (block classes): dark-blue (navy band, ink-light copy) | (default) page ground
 */

const LINE_DESKTOP = '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="454" fill="none" viewBox="0 0 1920 454" class="desktop" aria-hidden="true" focusable="false"><path stroke="#1B31FF" stroke-width="30" d="M-225 149.482c2812.5 157.12 1524.69-809.882 1103.061 0C607.775 668.655 2615 329.517 2615 329.517"/></svg>';
const LINE_MOBILE = '<svg xmlns="http://www.w3.org/2000/svg" width="375" height="257" fill="none" viewBox="0 0 375 257" class="mobile" aria-hidden="true" focusable="false"><path stroke="#1B31FF" stroke-width="18.072" d="M-323.956 74.16c1265.229 137.677 707.151-329.201 497.685 26.194C39.451 328.179 953.135 222.829 953.135 222.829"/></svg>';

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .page-title-wrapper')) return; // EW9
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
  const wrapper = div('page-title-wrapper');
  const label = div('page-title-label');
  const title = div('page-title-title');
  const actions = div('page-title-actions');
  let seenHeading = false;
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) {
      seenHeading = true;
      title.append(n);
    } else if (n.tagName === 'P' && n.querySelector('a[href]')
      && n.textContent.trim() === n.querySelector('a[href]').textContent.trim()) {
      actions.append(n);
    } else if (!seenHeading) label.append(n);
    else title.append(n);
  });
  if (label.children.length) wrapper.append(label);
  wrapper.append(title);
  if (actions.children.length) wrapper.append(actions);
  const line = div('page-title-line');
  line.innerHTML = LINE_DESKTOP + LINE_MOBILE;
  block.replaceChildren(wrapper, line);
}
