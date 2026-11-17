/* diva-e canon behaviour — only what motion-observe saw fire on the live page
   (stardust/replica/motion/en*.json):
   - burger click toggles header.is-open (live: class mutation + drawer opacity/visibility)
   - project coverflow prev/next (live: swiper-slide-active mutations, 600ms transform)
   - breakpoint-dependent initial DOM of the project slider + drawer labels
   Mega-menu panels open on :hover in CSS (live: opacity/visibility transitions on hover);
   the partner marquees are a CSS animation (live: autoplay, linear, 4s per slide). */
(() => {
  const header = document.querySelector('[data-header]');
  const burger = header && header.querySelector('[data-burger]');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }
})();

/* Breakpoint-dependent initial DOM, as the source renders it:
   below 950px the project slider holds the 9 projects once (active = first),
   from 950px the list is doubled (18 slides, active = 10th) for the coverflow;
   below 1280px the drawer's submenu parents carry "Go to …" labels. */
(() => {
  const teaser = document.querySelector('[data-teaser]');
  if (teaser && !window.matchMedia('(min-width: 950px)').matches) {
    const track = teaser.querySelector('[data-track]');
    const slides = [...track.children];
    const half = slides.length / 2;
    if (Number.isInteger(half) && half > 0) {
      slides.slice(0, half).forEach((el) => el.remove());
      const rest = [...track.children];
      rest.forEach((el, i) => el.setAttribute('aria-label', `${i + 1} / ${rest.length}`));
      track.style.setProperty('--active', '0');
      [...teaser.querySelectorAll('.teaser-slider__bullet')].slice(half).forEach((el) => el.remove());
    }
  }
  if (!window.matchMedia('(min-width: 1280px)').matches) {
    document.querySelectorAll('.header .menu-item--has-submenu').forEach((li) => {
      const label = li.querySelector(':scope > .menu-item__link').textContent.trim();
      li.setAttribute('aria-label', `Go to ${label}`);
    });
  }
})();

/* Project coverflow: prev/next move the active slide by one (Swiper speed 600ms). */
(() => {
  const teaser = document.querySelector('[data-teaser]');
  if (!teaser) return;
  const track = teaser.querySelector('[data-track]');
  const bullets = () => [...teaser.querySelectorAll('.teaser-slider__bullet')];
  const slides = () => [...track.children];
  let active = slides().findIndex((el) => el.classList.contains('is-active'));
  if (active < 0) active = Number(getComputedStyle(track).getPropertyValue('--active')) || 0;
  const go = (to) => {
    const all = slides();
    active = Math.max(0, Math.min(all.length - 1, to));
    track.style.setProperty('--active', String(active));
    all.forEach((el, i) => {
      el.style.setProperty('--k', String(i - active));
      el.style.setProperty('--ak', String(Math.abs(i - active)));
      el.classList.toggle('is-active', i === active);
      el.classList.toggle('swiper-slide-active', i === active);
      el.classList.toggle('swiper-slide-prev', i === active - 1);
      el.classList.toggle('swiper-slide-next', i === active + 1);
    });
    bullets().forEach((b, i) => b.classList.toggle('is-active', i === active));
  };
  teaser.querySelector('[data-prev]')?.addEventListener('click', () => go(active - 1));
  teaser.querySelector('[data-next]')?.addEventListener('click', () => go(active + 1));
  bullets().forEach((b, i) => b.addEventListener('click', () => go(i)));
  if (!window.matchMedia('(min-width: 950px)').matches) go(0);
})();

/* Partner marquees — observed live: Swiper autoplay (delay 1 ms, speed 4000 ms,
   linear), loop, right to left, one slide per 4 s step; starts two slides in. */
(() => {
  document.querySelectorAll('[data-marquee] .partners-bar__track').forEach((track) => {
    const count = Number(track.style.getPropertyValue('--count')) || 6;
    let step = 0;
    const pitch = () => {
      const cs = getComputedStyle(track);
      return parseFloat(cs.getPropertyValue('--slide')) + parseFloat(cs.getPropertyValue('--gap'));
    };
    const slides = [...track.children];
    const place = (i, animate) => {
      track.style.transition = animate ? 'transform 4000ms linear' : 'none';
      track.style.transform = `translate3d(${-(i + 2) * pitch()}px, 0, 0)`;
      slides.forEach((el, n) => {
        el.classList.toggle('swiper-slide-active', n === i + 2);
        el.classList.toggle('swiper-slide-prev', n === i + 1);
        el.classList.toggle('swiper-slide-next', n === i + 3);
      });
    };
    const tick = () => {
      if (step >= count) { step = 0; place(0, false); void track.offsetWidth; }
      step += 1;
      place(step, true);
    };
    track._t = setInterval(tick, 4000);
    setTimeout(tick, 1);
  });
})();
