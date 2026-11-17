/* article archetype — reading-progress ring (observed on the live page:
   .progress-bar circle stroke-dashoffset tracks scroll, 0.1s linear; ring
   circumference 2π·24 ≈ 150.8, full offset at the top of the page). */
(() => {
  const ring = document.querySelector('[data-read-progress] .read-progress__bar');
  if (!ring) return;
  const C = 2 * Math.PI * 24;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    ring.style.strokeDashoffset = String(C * (1 - p));
  };
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
