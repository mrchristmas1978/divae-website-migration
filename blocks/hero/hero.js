/**
 * hero — the diva-e page hero (source component Hero). Decode tier: template-slotted.
 * Schema: stardust/eds-schema/en-about-us-customers-mann-hummel.json (section hero).
 *
 * Authoring (one cell or one element per row, any order — classified by role):
 *   eyebrow <p> (short, before the heading)  → .hero-label
 *   <h1> (any heading)                       → .hero-headline
 *   description <p>(s) after the heading     → .hero-description
 *   CTA <p> (<strong>/<em> link)             → .hero-actions
 *   <picture>/<img>                           → .hero-media (absent = navy plate)
 *   optional second <picture>/<img>           → mobile art direction (<= 768px), default
 *                                               variant only; adds `has-mobile-media`
 *
 * Variants (block classes):
 *   (default) — full-bleed cover image (or navy plate when no image) under an info band;
 *               ≥950 a 100vh stage with the copy over the image
 *   small     — case-study hero: navy band, copy left, perspective image card right
 *   dark-blue — marker kept from the source (hero--dark-blue); paint is identical
 */

// DA-flattened cell collector (deploy SKILL § 8, #62/#104): returns EXISTING nodes
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text beside an image — move the text node
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

const isMedia = (el) => el.matches('picture, img') || (el.tagName === 'P'
  && el.querySelector('picture, img') && !el.textContent.trim());
const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
const isCta = (el) => el.tagName === 'P' && el.querySelector('a[href]')
  && el.textContent.trim() === el.querySelector('a[href]').textContent.trim();

/*
 * INTERIM (foundation request queued in stardust/rollout/foundation-requests.md: a YouTube link
 * authored alone in its own section auto-blocks to `video` in scripts.js buildAutoBlocks — the
 * DA model keeps embeds out of block tables, davids-model D1). Until scripts/ ships it, the
 * case-study hero (decorated in the first, eager section) builds those blocks so the later
 * section load decorates them; nothing else is touched.
 */
const VIDEO_LINK = /^https?:\/\/(www\.)?(youtube\.com\/watch\?|youtu\.be\/)/;
function interimVideoAutoblock() {
  document.querySelectorAll('main > .section > .default-content-wrapper:only-child > p:only-child > a[href]:only-child').forEach((a) => {
    const p = a.parentElement;
    if (!VIDEO_LINK.test(a.href) || p.textContent.trim() !== a.textContent.trim()) return;
    const wrapper = p.parentElement;
    // the shape aem.js buildBlock + decorateBlock produce (no import: harness-loadable)
    const video = document.createElement('div');
    video.className = 'video block';
    video.dataset.blockName = 'video';
    video.dataset.blockStatus = 'initialized';
    const row = document.createElement('div');
    const cell = document.createElement('div');
    cell.append(a);
    row.append(cell);
    video.append(row);
    p.replaceWith(video);
    wrapper.className = 'video-wrapper';
    wrapper.closest('.section').classList.add('video-container');
  });
}

export default function decorate(block) {
  if (block.classList.contains('small')) interimVideoAutoblock();
  if (block.querySelector(':scope > .hero-info, :scope > .hero-inner')) return; // EW9

  const nodes = collectNodes(block);
  const heading = nodes.find(isHeading);
  const label = [];
  const description = [];
  const actions = [];
  let media = null;
  let mobile = null;
  let seenHeading = false;
  nodes.forEach((el) => {
    if (el === heading) {
      seenHeading = true;
    } else if (isMedia(el)) {
      if (!media) media = el.matches('picture, img') ? el : el.querySelector('picture') || el;
      else if (!mobile) mobile = el.matches('picture, img') ? el : el.querySelector('picture') || el;
    } else if (isCta(el)) {
      actions.push(el);
    } else if (!seenHeading && heading) {
      label.push(el);
    } else {
      description.push(el);
    }
  });

  const headline = div('hero-headline');
  if (heading) headline.append(heading);
  const labelBox = div('hero-label');
  labelBox.append(...label);
  const descBox = div('hero-description');
  descBox.append(...description);
  const actionsBox = div('hero-actions');
  actionsBox.append(...actions);
  if (media) {
    const img = media.querySelector ? media.querySelector('img') || media : media;
    if (img.tagName === 'IMG') {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
  }

  const title = div('hero-info-title');
  if (label.length) title.append(labelBox);
  title.append(headline);

  if (block.classList.contains('small')) {
    const inner = div('hero-inner');
    const wrapper = div('hero-image-wrapper');
    // no authored description = no description box (its 40px top margin would open a gap)
    if (description.length) title.append(descBox);
    if (actions.length) title.append(actionsBox);
    const card = div('hero-image-container');
    if (media) card.append(media);
    wrapper.append(title, card);
    inner.append(wrapper);
    block.replaceChildren(inner);
    return;
  }

  const mediaBox = div('hero-media');
  if (media && mobile) {
    // additive: a second authored image is the source's mobile art direction (<= 768px)
    const desktopBox = div('hero-media-desktop');
    desktopBox.append(media);
    const mobileBox = div('hero-media-mobile');
    mobileBox.append(mobile);
    const mobileImg = mobile.tagName === 'IMG' ? mobile : mobile.querySelector('img');
    if (mobileImg) mobileImg.loading = 'eager';
    mediaBox.append(desktopBox, mobileBox);
    block.classList.add('has-mobile-media');
  } else if (media) mediaBox.append(media);
  else block.classList.add('no-media');
  const info = div('hero-info');
  const container = div('hero-info-container');
  container.append(title);
  if (description.length) container.append(descBox);
  if (actions.length) container.append(actionsBox);
  info.append(container);
  block.replaceChildren(mediaBox, info);
}
