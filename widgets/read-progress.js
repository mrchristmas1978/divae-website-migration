/**
 * read-progress — the article's fixed reading-progress ring (a widget: no authored content).
 * Motion lifted from the live page: the ring's stroke-dashoffset tracks the scroll position
 * (0.1s linear), full offset at the top (circumference 2 * PI * 24 ~ 150.8).
 */
export default function decorate(widget) {
  widget.setAttribute('aria-hidden', 'true');
  const ring = widget.querySelector('.read-progress-bar');
  if (!ring) return;
  const C = 2 * Math.PI * 24;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    ring.style.strokeDashoffset = String(C * (1 - p));
  };
  const onScroll = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
