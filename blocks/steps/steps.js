/**
 * steps — diva-e Steps: a section heading over a vertical list of numbered step cards.
 * Decode tier: reconstructive (repeat group). Authored shape (container):
 *   head row  — the section heading (rows before the first two-cell row)
 *   step rows — [number <p>] [title heading, description <p>…]
 * Every authored node is MOVED (EW1); the number cell keeps its paragraph.
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .steps-container')) return; // EW9
  const container = el('div', 'steps-container');
  const title = el('div', 'steps-title');
  const list = el('div', 'steps-list');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      if (!list.children.length) title.append(...cells.flatMap((c) => [...c.children]));
      return;
    }
    const item = el('div', 'step-item');
    const num = el('div', 'step-item-number');
    num.append(...cells[0].children);
    const content = el('div', 'step-item-content');
    cells.slice(1).forEach((c) => {
      [...c.children].forEach((n) => {
        if (/^H[1-6]$/.test(n.tagName)) n.classList.add('step-item-title');
        content.append(n);
      });
    });
    item.append(num, content);
    list.append(item);
  });
  if (title.children.length) container.append(title);
  container.append(list);
  block.replaceChildren(container);
}
