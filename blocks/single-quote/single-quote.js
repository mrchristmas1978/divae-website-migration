/**
 * single-quote — source component SingleQuote: one large testimonial with its author.
 * Decode tier: template-slotted. Schema: stardust/eds-schema/en-about-us-customers-mann-hummel.json
 * (section single-quote).
 *
 * Authoring:
 *   row 1 — the quote: <p>(s) (or a <blockquote>)           → blockquote.single-quote-text
 *   row 2 — the author: name <p>, then position <p>          → figcaption .single-quote-name /
 *                                                               .single-quote-position
 * Flattened into one cell: the LAST two short paragraphs are name + position.
 *
 * Variants (block classes): (default) light ground; dark — navy band, light text;
 *   blue — blue band, white text (source single-quote--blue).
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

export default function decorate(block) {
  if (block.querySelector(':scope > figure.single-quote-container')) return; // EW9

  const rows = [...block.querySelectorAll(':scope > div')];
  const cells = rows.map((row) => [...row.querySelectorAll(':scope > div > *')]
    .flatMap((el) => (el.tagName === 'BLOCKQUOTE' ? [...el.children] : [el])));
  let quote;
  let author;
  if (cells.length >= 2) {
    [quote] = cells;
    author = cells.slice(1).flat();
  } else {
    const all = cells.flat();
    const n = all.length > 2 ? 2 : Math.max(all.length - 1, 0);
    quote = all.slice(0, all.length - n);
    author = all.slice(all.length - n);
  }

  const figure = document.createElement('figure');
  figure.className = 'single-quote-container';
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'single-quote-text';
  blockquote.append(...quote);
  figure.append(blockquote);
  if (author.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'single-quote-author';
    const name = div('single-quote-name');
    name.append(author[0]);
    caption.append(name);
    if (author.length > 1) {
      const position = div('single-quote-position');
      position.append(...author.slice(1));
      caption.append(position);
    }
    figure.append(caption);
  }
  block.replaceChildren(figure);
}
