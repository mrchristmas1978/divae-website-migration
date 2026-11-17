/**
 * intro-side — diva-e IntroSideContainer: an intro column (optional heading + rich text) with an
 * optional sidebar of in-page / related links.
 * Decode tier: template-slotted. Authored shape: one row [intro cell] [optional sidebar cell:
 * a title <p> and a <ul> of links]. Every authored node is MOVED (EW1).
 * @variants top | bottom (the source module's top / bottom margins)
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .intro-side-column')) return; // EW9
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const column = el('div', 'intro-side-column');
  const intro = el('div', 'intro-side-intro');
  const [first, ...rest] = cells;
  if (first) {
    [...first.children].forEach((n) => {
      if (/^H[1-6]$/.test(n.tagName) && !intro.children.length) {
        const head = el('div', 'intro-side-headline');
        head.append(n);
        intro.append(head);
      } else {
        let txt = intro.querySelector(':scope > .intro-side-paragraph');
        if (!txt) {
          txt = el('div', 'intro-side-paragraph');
          intro.append(txt);
        }
        txt.append(n);
      }
    });
  }
  column.append(intro);
  const sideNodes = rest.flatMap((c) => [...c.children]);
  if (sideNodes.length) {
    const side = el('div', 'intro-side-sidebar');
    const anchor = el('div', 'intro-side-anchor');
    sideNodes.forEach((n) => {
      if (n.tagName === 'P' && !anchor.querySelector('.anchor-title')) n.classList.add('anchor-title');
      anchor.append(n);
    });
    side.append(anchor);
    column.append(side);
  }
  block.replaceChildren(column);
}
