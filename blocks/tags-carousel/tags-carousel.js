/**
 * tags-carousel — source component TagsCarousel: a section title over a tilted marquee of
 * service tags (Swiper autoplay RTL, 4000 ms per slide, linear, loop; rests on the first tag and
 * starts moving ~2 s after navigation, as measured on the live page),
 * plus the source's empty second row. Decode tier: template-slotted (title) + the authored
 * list as the track. Schema: stardust/eds-schema/en-about-us-customers-mann-hummel.json
 * (section tags-carousel).
 *
 * Authoring: the title heading (<h2>), then ONE <ul> of tag links (each <li> one link); an
 * optional SECOND <ul> fills the source's second row (left-to-right, opposite direction).
 * Loose link paragraphs are gathered into a list as a fallback.
 * The marquee needs each list repeated (Swiper loop: >= 3 copies, >= 12 slides): the authored
 * items stay first and editable; the loop copies are presentational clones (EW4,
 * stripInstrumentation).
 *
 * @ew-exempt marquee loop copies — presentational clones of the authored tags (EW4)
 */

const PERIOD_MS = 4000;
const START = 0;
// the live Swiper rests at translate 0 and starts its first transition ~2 s after navigation
const START_AT_MS = 2000;

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function startMarquee(track, list, period, dir = 1) {
  const slides = [...list.children];
  let k = START;
  let timer;
  const offset = (n) => {
    let x = 0;
    for (let i = 0; i < n; i += 1) {
      x += slides[i].getBoundingClientRect().width
        + parseFloat(getComputedStyle(slides[i]).marginLeft);
    }
    return x;
  };
  const place = (animate) => {
    track.style.transition = animate ? `transform ${PERIOD_MS}ms linear` : 'none';
    track.style.transform = `translate3d(${dir * offset(k)}px, 0, 0)`;
    slides.forEach((el, n) => {
      el.classList.toggle('is-active', n === k);
    });
  };
  const tick = () => {
    if (k >= START + period) {
      k = START;
      place(false);
      track.getBoundingClientRect(); // flush the reset before animating again
    }
    k += 1;
    place(true);
  };
  const boot = () => {
    if (!track.isConnected) return;
    if (!track.offsetWidth) {
      setTimeout(boot, 100);
      return;
    }
    place(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTimeout(() => {
      tick();
      timer = setInterval(tick, PERIOD_MS);
    }, Math.max(1, START_AT_MS - performance.now()));
  };
  window.addEventListener('resize', () => place(false));
  boot();
  return () => clearInterval(timer);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .tags-carousel-grid')) return; // EW9

  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const heading = nodes.find((el) => /^H[1-6]$/.test(el.tagName));
  const lists = nodes.filter((el) => el.matches('ul, ol'));
  let list = lists[0];
  if (!list) {
    list = document.createElement('ul');
    nodes.filter((el) => el.tagName === 'P' && el.querySelector('a[href]')).forEach((p) => {
      const li = document.createElement('li');
      li.append(p);
      list.append(li);
    });
  }
  // optional second authored list: the source's second row, moving the other way (LTR)
  const list2 = lists[1] || null;

  const grid = div('tags-carousel-grid');
  const title = div('tags-carousel-title');
  if (heading) title.append(heading);
  const container = div('tags-carousel-container');
  const slider = div('tags-carousel-slider');
  slider.setAttribute('dir', 'rtl');
  slider.setAttribute('aria-label', 'Tags Carousel Slider (direction right to left)');
  const track = div('tags-carousel-track');
  track.append(list);
  slider.append(track);
  const second = div('tags-carousel-slider');
  let track2 = null;
  if (list2) {
    second.setAttribute('aria-label', 'Tags Carousel Slider (direction left to right)');
    track2 = div('tags-carousel-track');
    track2.append(list2);
    second.append(track2);
  } else second.setAttribute('aria-hidden', 'true');
  container.append(slider, second);
  if (heading) grid.append(title);
  grid.append(container);
  // leftovers: any other authored element stays visible under the title
  nodes.filter((el) => el !== heading && el !== list && el !== list2 && !list.contains(el))
    .forEach((el) => title.append(el));
  block.replaceChildren(grid);

  // the marquee needs the set repeated (Swiper loop): at least three copies and >= 12 slides
  const run = (ul, tr, dir) => {
    const items = [...ul.children];
    if (!items.length) return;
    const copies = Math.max(3, Math.ceil(12 / items.length));
    for (let c = 1; c < copies; c += 1) {
      items.forEach((li) => {
        const clone = stripInstrumentation(li.cloneNode(true));
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        ul.append(clone);
      });
    }
    startMarquee(tr, ul, items.length, dir);
  };
  run(list, track, 1);
  if (list2) run(list2, track2, -1);
}
