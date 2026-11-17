/**
 * embed — source CodeEmbed: an optional headline row and a third-party iframe app
 * (dynamic-features embed-passthrough, e.g. the security quiz frames).
 * Decode tier: template-slotted.
 *
 * Authoring:
 *   optional one-cell row  — headline / copy above the frame (moved, EW1)
 *   <a href=frame-url> | <height px>  — one row per frame; the link becomes the iframe src,
 *                                        the optional second cell its initial height (default 840)
 * The provider's iframeResizer (served from the frame origin, as on the source) then sizes the
 * frame to its content.
 *
 * @ew-exempt frame link + height — config (the link is moved into a hidden config holder)
 * Variants (block classes): dark-blue (navy band) | (default) light, 80px margins
 */

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.head.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .embed-container')) return; // EW9
  const container = div('embed-container');
  const head = div('embed-headline');
  const config = div('embed-config');
  config.hidden = true;
  const frames = [];
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    const link = cells[0] && cells[0].querySelector('a[href]');
    if (link && /^https?:/.test(link.href) && cells[0].textContent.trim() === link.textContent.trim()) {
      const height = cells[1] ? parseInt(cells[1].textContent, 10) : NaN;
      const content = div('embed-content');
      const iframe = document.createElement('iframe');
      iframe.src = link.href;
      iframe.title = document.title;
      iframe.width = '100%';
      iframe.setAttribute('scrolling', 'no');
      iframe.style.height = `${Number.isNaN(height) ? 840 : height}px`;
      content.append(iframe);
      frames.push(iframe);
      config.append(...cells.flatMap((c) => [...c.children]));
      container.append(content);
    } else {
      cells.forEach((c) => head.append(...c.children));
    }
  });
  if (head.children.length) container.prepend(head);
  block.replaceChildren(container, config);

  frames.forEach((iframe, i) => {
    const { origin } = new URL(iframe.src);
    iframe.id = iframe.id || `embed-frame-${i + 1}`;
    loadScript(`${origin}/js/iframeResizer.min.js`)
      .then(() => {
        if (window.iFrameResize) window.iFrameResize({ log: false }, `#${iframe.id}`);
        return loadScript(`${origin}/js/urlLoader.js`);
      })
      .catch(() => { /* the frame keeps its authored height */ });
  });
}
