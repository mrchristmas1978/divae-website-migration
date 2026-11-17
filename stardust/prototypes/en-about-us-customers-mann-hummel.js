/* case-study page behaviour — only what motion-observe saw fire on the live page
   (stardust/replica/motion/en-about-us-customers-mann-hummel.json):
   - tags marquee: Swiper autoplay, RTL, linear 4000ms per slide, loop; rests two
     slides in (live capture: slide 3 active, translate ≈ two slide pitches).
   The 15 slides are the 5 services three times, so the loop period is 5 slides. */
(() => {
  document.querySelectorAll('[data-tags-marquee] .tags-carousel__track').forEach((track) => {
    const slides = [...track.children];
    const period = 5;
    const offset = (k) => {
      let x = 0;
      for (let i = 0; i < k; i += 1) x += slides[i].getBoundingClientRect().width + parseFloat(getComputedStyle(slides[i]).marginLeft);
      return x;
    };
    let k = 2;
    const place = (animate) => {
      track.style.transition = animate ? 'transform 4000ms linear' : 'none';
      track.style.transform = `translate3d(${offset(k)}px, 0, 0)`;
      slides.forEach((el, n) => {
        el.classList.toggle('swiper-slide-active', n === k);
        el.classList.toggle('swiper-slide-prev', n === k - 1);
        el.classList.toggle('swiper-slide-next', n === k + 1);
      });
    };
    place(false);
    const tick = () => {
      if (k >= 2 + period) { k = 2; place(false); void track.offsetWidth; }
      k += 1;
      place(true);
    };
    setTimeout(() => { tick(); setInterval(tick, 4000); }, 1);
  });
})();
