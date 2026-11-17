/**
 * image-caption — diva-e ImageCaption (image-grid-10): one rounded editorial image on a
 * 10-of-12 column grid, an optional caption below.
 * Schema: stardust/eds-schema/en-services-crm.json (section image-caption).
 * Decode tier: template-slotted. Authored shape (simple): the image (any cell), then
 * optional caption paragraphs. Every authored node is MOVED (EW1). A heading authored before the
 * image is the section headline (variant `large`: TwoColsTextImageLarge — headline over a
 * full 10-col image with a decorative lightbox disc).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .image-caption-inner')) return; // EW9
  const inner = el('div', 'image-caption-inner');
  const media = el('div', 'image-caption-media');
  const caption = el('div', 'image-caption-caption');
  const headline = el('div', 'image-caption-headline');
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap((cell) => [...cell.children]);
  nodes.forEach((n) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (pic && !media.children.length) {
      media.append(pic);
      if (n !== pic && !n.textContent.trim() && !n.querySelector('picture, img')) n.remove();
      else if (n !== pic) caption.append(n);
    } else if (/^H[1-6]$/.test(n.tagName) && !media.children.length) {
      headline.append(n); // a heading authored before the image (variant large)
    } else {
      caption.append(n);
    }
  });
  // variant `linked` (additive): the source's hover-button, the whole image is a link.
  // Authored as the image, then a paragraph with the link; the link covers the image and
  // its label becomes the accessible name.
  if (block.classList.contains('linked')) {
    const a = caption.querySelector('a[href]');
    const holder = a && a.closest('p');
    if (a && holder && media.children.length) {
      // the authored link is unwrapped in place and re-made as an overlay over the image (the
      // source's hover-button link); its paragraph (the label) moves into the overlay as the
      // visually hidden accessible name (EW: the text stays on one element)
      const link = a.cloneNode(false);
      link.className = 'image-caption-link';
      link.setAttribute('aria-label', a.textContent.trim());
      a.replaceWith(...a.childNodes);
      holder.className = 'image-caption-link-label';
      link.append(holder);
      media.append(link);
    }
  }
  if (headline.children.length) inner.append(headline);
  inner.append(media);
  if (caption.children.length) inner.append(caption);
  block.replaceChildren(inner);
}
