/**
 * related-links — source RelatedLinks (press archive): a navy band with a bold title line
 * (blurred dot) and one to three columns of links, each link a full-width row with a hairline.
 * Decode tier: template-slotted. Authoring: the title <p> (first non-list element), then one
 * <ul> of links per column (cells or rows, in order). Every authored node is moved (EW1).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .related-links-container')) return; // EW9
  const title = div('related-links-title dot-blur-16');
  const columns = div('related-links-columns');
  const rest = [];
  const nodes = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.children.length) nodes.push(...cell.children);
      else if (cell.textContent.trim()) {
        // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
        const p = document.createElement('p');
        p.append(...cell.childNodes);
        nodes.push(p);
      }
    });
  });
  nodes.forEach((n) => {
    if (n.matches('ul, ol')) {
      n.classList.add('related-links-column');
      columns.append(n);
    } else if (!title.childElementCount && !columns.childElementCount) {
      const inner = div('');
      inner.append(n);
      title.append(inner);
    } else rest.push(n);
  });
  columns.classList.add(`related-links-columns-${Math.min(3, columns.childElementCount || 1)}`);
  const container = div('related-links-container');
  if (title.childElementCount) container.append(title);
  container.append(columns);
  if (rest.length) container.append(...rest); // never drop an authored element
  block.replaceChildren(container);
}
