/**
 * button-group — diva-e ButtonGroup: a centred row of CTAs on a 10-of-12 column grid.
 * Schema: stardust/eds-schema/en-services-crm.json (section button-group).
 * Decode tier: template-slotted. Authored shape (simple): one CTA paragraph per button —
 * <p><strong><a></a></strong></p> = fill (primary), <em> = outline (secondary). Each CTA
 * moves as its paragraph (EW3); any other authored node is kept after the buttons.
 *
 * @variants dark-blue (navy band, light buttons); left | right (default centred)
 */

export default function decorate(block) {
  if (block.querySelector(':scope > .button-group-buttons')) return; // EW9
  const row = document.createElement('div');
  row.className = 'button-group-buttons';
  const rest = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((n) => {
      if (n.querySelector('a[href]') || n.matches('a[href]')) row.append(n);
      else rest.push(n);
    });
  });
  block.replaceChildren(row, ...rest);
}
