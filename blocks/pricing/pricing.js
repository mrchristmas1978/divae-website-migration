/**
 * pricing — diva-e Pricing: a section heading over 1–3 price cards.
 * Decode tier: reconstructive (repeat group). Authored shape (container):
 *   head row  — the section heading (one-cell rows before the first item)
 *   item rows — [name <p>, price <p>] [feature list <ul> / <p>…]
 * Every authored node is MOVED (EW1).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .pricing-container')) return; // EW9
  const wrap = el('div', 'pricing-wrap');
  const title = el('div', 'pricing-title');
  const list = el('div', 'pricing-container');
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      if (!list.children.length) title.append(...cells.flatMap((c) => [...c.children]));
      return;
    }
    const item = el('div', 'pricing-item');
    const box = el('div', 'pricing-item-price-box');
    const [name, price, ...rest] = [...cells[0].children];
    if (name) { name.classList.add('pricing-item-name'); box.append(name); }
    if (price) { price.classList.add('pricing-item-price'); box.append(price); }
    box.append(...rest);
    const content = el('div', 'pricing-item-content');
    cells.slice(1).forEach((c) => content.append(...c.children));
    item.append(box, content);
    list.append(item);
  });
  list.classList.add(`pricing-container-${Math.min(list.children.length, 3)}`);
  if (title.children.length) wrap.append(title);
  wrap.append(list);
  block.replaceChildren(wrap);
}
