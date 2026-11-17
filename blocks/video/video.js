/**
 * video — source component Video (video--contained: a rounded 16:9-ish YouTube player on the
 * page grid). Decode tier: template-slotted.
 *
 * Authoring: a YouTube link alone in its own section (default content, auto-blocked — interim in
 * blocks/hero/hero.js until scripts.js buildAutoBlocks ships it), or one cell holding ONE link;
 * the link text is the player's accessible title (the source iframe title). The authored link is
 * MOVED (EW1) into a visually hidden caption so it stays editable and reachable without the
 * player; a non-YouTube link stays a plain visible link.
 *
 * Paint: the source video--contained with top+bottom margins (12px radius; margins 40 / 64 >= 950 /
 *   80 >= 1200) — the only shape on the site; no variants.
 */

function youtubeId(href) {
  try {
    const u = new URL(href, window.location.href);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/\/(?:embed|shorts)\/([\w-]+)/);
      if (m) return m[1];
    }
  } catch (e) {
    // not a URL
  }
  return null;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .video-container')) return; // EW9

  const link = block.querySelector('a[href]');
  const id = link ? youtubeId(link.href) : null;
  if (!id) return;

  const container = document.createElement('div');
  container.className = 'video-container';
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?rel=0&showinfo=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
  iframe.title = link.textContent.trim() || 'YouTube video';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  container.append(iframe);

  // the source VideoItem seek bar: a progress track over the player bottom (YouTube IFrame API
  // over postMessage — progress from infoDelivery, click seeks to the clicked fraction)
  const controls = document.createElement('button');
  controls.type = 'button';
  controls.className = 'video-controls';
  controls.setAttribute('aria-label', 'Button to seek on video');
  const progress = document.createElement('div');
  progress.className = 'video-controls-progress';
  controls.append(progress);
  container.append(controls);
  let duration = 0;
  const post = (msg) => iframe.contentWindow
    && iframe.contentWindow.postMessage(JSON.stringify(msg), 'https://www.youtube.com');
  iframe.addEventListener('load', () => post({ event: 'listening', id }));
  window.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow || typeof e.data !== 'string') return;
    let data;
    try { data = JSON.parse(e.data); } catch (err) { return; }
    const info = data && data.info;
    if (!info) return;
    if (info.duration) duration = info.duration;
    if (duration && typeof info.currentTime === 'number') {
      progress.style.width = `${Math.min(100, (info.currentTime / duration) * 100)}%`;
    }
  });
  controls.addEventListener('click', (e) => {
    if (!duration) return;
    const r = controls.getBoundingClientRect();
    const t = ((e.clientX - r.left) / r.width) * duration;
    post({ event: 'command', func: 'seekTo', args: [t, true] });
  });

  const caption = document.createElement('p');
  caption.className = 'video-link';
  caption.append(link);
  block.replaceChildren(container, caption);
}
