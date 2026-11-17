/**
 * accordion — diva-e Accordion: a section heading over question / answer rows (closed by
 * default; each question is a button toggling its panel, as on the source).
 * Decode tier: reconstructive (repeat group). Authored shape (container):
 *   head row  — the section heading (one-cell rows before the first item)
 *   item rows — [question <p>] [answer <p>/<ul>…]
 * Every authored node is MOVED (EW1): the question paragraph moves into the toggle button.
 * @variants dark (navy band)
 */

let uid = 0;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .accordion-container')) return; // EW9
  const container = el('div', 'accordion-container');
  const title = el('div', 'accordion-title');
  const list = el('div', 'accordion-list');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      if (!list.children.length) title.append(...cells.flatMap((c) => [...c.children]));
      return;
    }
    uid += 1;
    const item = el('div', 'accordion-item');
    const button = el('button', 'accordion-item-title');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `accordion-panel-${uid}`);
    const q = el('div', 'title h5');
    q.append(...cells[0].children);
    const arrow = el('span', 'arrow');
    arrow.setAttribute('aria-hidden', 'true');
    button.append(q, arrow);
    const panel = el('div', 'accordion-item-panel');
    panel.id = `accordion-panel-${uid}`;
    cells.slice(1).forEach((c) => panel.append(...c.children));
    button.addEventListener('click', () => {
      const open = !item.classList.contains('active');
      item.classList.toggle('active', open);
      button.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '';
    });
    item.append(button, panel);
    list.append(item);
  });
  if (title.children.length) container.append(title);
  container.append(list);
  block.replaceChildren(container);
}
