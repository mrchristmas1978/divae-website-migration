/* en-insights-edge — listing interactions observed on the live page
   (stardust/replica/motion/en-insights-edge.json):
   - filter pill click moves the `active` state (the article query itself is
     a dynamic surface, handed to the dynamics phase);
   - card image hover shows the "View more" cursor disc at the pointer
     (hover-button__cursor--active, opacity/transform .2s);
   - below 768 the "Filter by" button opens the filter sheet. */
(() => {
  const root = document.querySelector('[data-filter]');
  if (root) {
    const list = root.querySelector('.filter-buttons__btn-list');
    const open = root.querySelector('[data-filter-open]');
    const set = (on) => { list.classList.toggle('is-open', on); open.setAttribute('aria-expanded', String(on)); };
    open.addEventListener('click', () => set(!list.classList.contains('is-open')));
    root.querySelector('[data-filter-close]').addEventListener('click', () => set(false));
    const pills = [...root.querySelectorAll('.btn--filter')];
    pills.forEach((b) => b.addEventListener('click', () => {
      pills.forEach((p) => { p.classList.toggle('active', p === b); p.setAttribute('aria-pressed', String(p === b)); });
    }));
  }
  document.querySelectorAll('.hover-button').forEach((hb) => {
    const cursor = hb.querySelector('.hover-button__cursor');
    const move = (e) => {
      const r = hb.getBoundingClientRect();
      cursor.style.left = `${e.clientX - r.left}px`;
      cursor.style.top = `${e.clientY - r.top}px`;
    };
    hb.addEventListener('mouseenter', (e) => { move(e); cursor.classList.add('hover-button__cursor--active'); });
    hb.addEventListener('mousemove', move);
    hb.addEventListener('mouseleave', () => cursor.classList.remove('hover-button__cursor--active'));
  });
})();
