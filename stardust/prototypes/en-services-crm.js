/* en-services-crm — the source's cards-block equalises card titles per visual
   row (inline min-height = tallest title in the row; recorded in the capture:
   48px on row 1, 24px on row 2). Re-run on resize like the source. */
(() => {
  const grid = document.querySelector('.cards-block--col-3 .cards-block__grid');
  if (!grid) return;
  const titles = [...grid.querySelectorAll('.card__info-title')];
  const equalise = () => {
    titles.forEach((t) => { t.style.minHeight = ''; });
    const rows = new Map();
    titles.forEach((t) => {
      const top = t.closest('.card').offsetTop;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(t);
    });
    rows.forEach((row) => {
      const h = Math.max(...row.map((t) => t.offsetHeight));
      row.forEach((t) => { t.style.minHeight = `${h}px`; });
    });
  };
  equalise();
  window.addEventListener('resize', equalise);
  document.fonts?.ready.then(equalise);
})();

/* Project slider below 950px: the source renders the 4 CRM projects once
   (aria "1 / 4" … "4 / 4"); from 950px it loops them to 16 slides. canon.js
   halves the doubled list (16 → 8); trim to the unique set here. */
(() => {
  const teaser = document.querySelector('[data-teaser]');
  if (!teaser || window.matchMedia('(min-width: 950px)').matches) return;
  const track = teaser.querySelector('[data-track]');
  const unique = 4;
  [...track.children].slice(unique).forEach((el) => el.remove());
  [...track.children].forEach((el, i) => el.setAttribute('aria-label', `${i + 1} / ${unique}`));
  [...teaser.querySelectorAll('.teaser-slider__bullet')].slice(unique).forEach((el) => el.remove());
})();
