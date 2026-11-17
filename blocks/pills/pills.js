/**
 * pills — diva-e Pills: a dot tagline over a wrap of large pill labels (some linked).
 * Decode tier: template-slotted. Authored shape: a tagline <p> (or heading), then ONE <ul> whose
 * items are the pills (plain text, or one link each). Every authored node is MOVED (EW1).
 * @variants dark (navy band) | center; top | bottom (source module margins)
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .pills-container')) return; // EW9
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap((c) => [...c.children]);
  const container = el('div', 'pills-container');
  const header = el('div', 'pills-header');
  let list = null;
  nodes.forEach((n) => {
    if (n.tagName === 'UL' && !list) {
      list = n;
      list.classList.add('pills-list');
      [...list.children].forEach((li) => {
        li.classList.add('pills-item');
        const a = li.querySelector('a');
        if (a) a.classList.add('pill');
        else {
          const span = el('span', 'pill');
          span.append(...li.childNodes);
          li.append(span);
        }
      });
    } else if (!list) {
      n.classList.add('pills-tagline');
      header.append(n);
    } else {
      header.append(n);
    }
  });
  if (header.children.length) container.append(header);
  if (list) container.append(list);
  block.replaceChildren(container);
}
