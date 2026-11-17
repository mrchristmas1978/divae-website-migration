/**
 * breadcrumbs — source component LayoutBreadcrumbs. Decode tier: template-slotted.
 *
 * Authoring: one cell holding a <ul> of links (Home → … → current page). The list is ONE
 * editable unit (EW5: a trail authored as one paragraph cannot be made editable); the last
 * item is the current page.
 *
 * Variants (block classes): (default) light — grey trail on the page ground;
 *   dark — navy band, light trail (case studies, under a dark hero).
 */
export default function decorate(block) {
  if (block.querySelector(':scope > nav.breadcrumbs-nav')) return; // EW9
  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs-nav';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const list = block.querySelector('ul, ol');
  if (list) {
    nav.append(list);
    const links = list.querySelectorAll(':scope > li a[href]');
    const current = links[links.length - 1];
    if (current) current.setAttribute('aria-current', 'page');
  } else {
    // leftovers: whatever the author wrote stays visible
    block.querySelectorAll(':scope > div > div > *').forEach((el) => nav.append(el));
  }
  block.replaceChildren(nav);
}
