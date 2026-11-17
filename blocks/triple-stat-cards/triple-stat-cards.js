/**
 * triple-stat-cards — source TripleStatCards (locations "Our awards"): a bold label line
 * (blurred dot) or heading, then up to three tinted cards (stat title / text / award icon).
 * Decode tier: template-slotted. Authoring: first row = the title (<p> label or heading); then
 * one row per card — any of: heading (stat), <p> text, <picture> (icon, bottom of the card).
 * Variants: dark-blue (navy band) · top / bottom (source module margins).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function cellNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    if (cell.children.length) out.push(...cell.children);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const mediaOnly = (n) => !!(n.matches('picture, img') || n.querySelector('picture, img'))
  && !n.textContent.trim();

export default function decorate(block) {
  if (block.querySelector(':scope > .triple-stat-cards-container')) return; // EW9
  const container = div('triple-stat-cards-container');
  const cards = div('triple-stat-cards-cards');
  const rows = [...block.children];
  rows.forEach((row, i) => {
    const nodes = cellNodes(row);
    if (!nodes.length) return;
    const isTitle = i === 0 && !nodes.some(mediaOnly) && nodes.length === 1;
    if (isTitle) {
      const title = div('triple-stat-cards-title');
      const n = nodes[0];
      if (!/^H[1-6]$/.test(n.tagName)) title.classList.add('dot-blur-16', 'is-label');
      title.append(n);
      container.append(title);
      return;
    }
    const card = div('triple-stat-cards-card');
    const head = div('triple-stat-cards-card-title');
    const text = div('triple-stat-cards-card-text');
    const icon = div('triple-stat-cards-card-icon');
    nodes.forEach((n) => {
      if (mediaOnly(n)) icon.append(n);
      else if (/^H[1-6]$/.test(n.tagName) && !text.childElementCount) head.append(n);
      else text.append(n);
    });
    [head, text, icon].forEach((d) => { if (d.childElementCount) card.append(d); });
    cards.append(card);
  });
  container.append(cards);
  block.replaceChildren(container);
}
