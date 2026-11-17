/**
 * partners-bar — diva-e PartnersBar "We ♥ our partners" with two logo marquees (canon § 12).
 * Schema: stardust/eds-schema/en.json (section partners-bar, 2 × DIV.partners-bar__row).
 * Decode tier: template-slotted head + reconstructive logo rows. Authored shape (container):
 *   head row    — two headings: "We" and "our <em>partners</em>" (the heart is decorative)
 *   logo rows   — one block row per marquee; each logo a linked image
 *                 (<p><a href><img></a></p>; a bare image or an image followed by a
 *                 link-only <p> is accepted too)
 *   CTA row     — a link-only <p> (em = outline button), rendered at the canon btn-md size
 * Classified by content: headings → head, image-bearing nodes → the current row's logos,
 * link-only paragraphs after a logo → that logo's link (when the logo has none), else CTA.
 * Capture state restored (replica progress.json captureState "partner marquees"): Swiper
 * autoplay delay 1 ms, speed 4000 ms per slide, linear, loop, right → left; the loop repeats
 * each row's set to at least 16 slides (6 × 3 = 18, 11 × 2 = 22). Re-measured on the live page
 * at delivery (probes/marquee-live.mjs): the track rests at translate 0 and starts its first
 * 4 s transition ~2 s after navigation, one slide (pitch = slide + gap) per transition.
 * The first copy holds the authored logos; the others are presentational clones (EW4).
 */

const LOOP_MIN = 16;
const SPEED = 4000;
const START_AT_MS = 2000;
const HEART = '<svg class="partners-bar-heart" aria-hidden="true" focusable="false" '
  + 'xmlns="http://www.w3.org/2000/svg" width="146" height="133" fill="none" viewBox="0 0 146 133">'
  + '<g filter="url(#partners-bar-heart-blur)"><path fill="#1B31FF" d="M55.708 119.356 17.553 '
  + '59.898c-4.547-7.084-5.78-15.379-4.109-23.04 1.672-7.66 6.25-14.684 13.335-19.23 7.085-4.545 '
  + '15.378-5.784 23.039-4.112 7.66 1.672 14.684 6.254 19.23 13.337l6.653 10.366 10.364-6.652c7.082'
  + '-4.545 15.378-5.783 23.039-4.111 7.66 1.672 14.684 6.253 19.231 13.336 4.542 7.085 5.781 '
  + '15.378 4.109 23.039-1.672 7.66-6.254 14.684-13.335 19.231l-59.458 38.155a2.86 2.86 0 0 '
  + '1-3.946-.861h.003Z"></path></g><defs><filter id="partners-bar-heart-blur" width="144.423" '
  + 'height="131.863" x=".732" y=".805" color-interpolation-filters="sRGB" '
  + 'filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>'
  + '<feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>'
  + '<feGaussianBlur result="blur" stdDeviation="6"></feGaussianBlur></filter></defs></svg>';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

function cellNodes(cell) {
  let kids = [...cell.children];
  if (!kids.length && cell.textContent.trim()) {
    // HARNESS-ONLY fallback (EW5): DA cells always carry a <p>
    const p = el('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const hasMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');

function linkOnly(n) {
  if (n.tagName !== 'P' || hasMedia(n)) return null;
  const a = n.querySelector('a[href]');
  if (!a || n.textContent.trim() !== a.textContent.trim()) return null;
  return a;
}

function segment(block) {
  const heads = [];
  const rows = [];
  const ctas = [];
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    let logos = null;
    [...row.children].flatMap(cellNodes).forEach((n) => {
      if (isHeading(n)) heads.push(n);
      else if (hasMedia(n)) {
        if (!logos) {
          logos = [];
          rows.push(logos);
        }
        logos.push({ node: n, link: null });
      } else if (linkOnly(n) && logos && !logos[logos.length - 1].node.querySelector('a[href]')
        && !logos[logos.length - 1].link) {
        logos[logos.length - 1].link = n;
      } else if (linkOnly(n)) ctas.push(n);
      else heads.push(n); // leftovers stay visible in the head
    });
  });
  return { heads, rows, ctas };
}

function buildSlide({ node, link }) {
  const slide = el('div', 'partners-bar-slide', { role: 'group' });
  const anchor = node.querySelector('a[href]') || (node.tagName === 'A' ? node : null);
  if (anchor) {
    anchor.setAttribute('aria-label', 'Go to link');
    slide.append(node);
  } else {
    const item = el('div', 'partners-bar-logo');
    item.append(node);
    if (link) {
      // @ew-exempt the logo's link text is the target, shown as the logo itself
      item.append(link);
      link.classList.add('partners-bar-logo-link');
    }
    slide.append(item);
  }
  return slide;
}

function startMarquee(row, track, count, slides) {
  let step = 0;
  const pitch = () => {
    const cs = getComputedStyle(track);
    return parseFloat(cs.getPropertyValue('--slide')) + parseFloat(cs.getPropertyValue('--gap'));
  };
  const place = (i, animate) => {
    track.style.transition = animate ? `transform ${SPEED}ms linear` : 'none';
    track.style.transform = `translate3d(${-i * pitch()}px, 0, 0)`;
    slides.forEach((s, n) => {
      s.classList.toggle('swiper-slide-active', n === i);
      s.classList.toggle('swiper-slide-prev', n === i - 1);
      s.classList.toggle('swiper-slide-next', n === i + 1);
    });
  };
  const tick = () => {
    if (step >= count) {
      step = 0;
      place(0, false);
      track.getBoundingClientRect(); // commit the reset before the next transition
    }
    step += 1;
    place(step, true);
  };
  place(0, false);
  setTimeout(() => {
    tick();
    setInterval(tick, SPEED);
  }, Math.max(1, START_AT_MS - performance.now()));
  window.addEventListener('resize', () => place(step, false));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .partners-bar-header')) return; // EW9
  const { heads, rows, ctas } = segment(block);

  const header = el('div', 'partners-bar-header');
  const we = el('div', 'partners-bar-we');
  const weHead = el('div', 'partners-bar-headline-we');
  const two = el('div', 'partners-bar-headline-two');
  heads.forEach((h, i) => (i === 0 ? weHead : two).append(h));
  we.append(weHead);
  we.insertAdjacentHTML('beforeend', HEART);
  header.append(we, two);

  const rowsBox = el('div', 'partners-bar-rows');
  const marquees = [];
  rows.forEach((logos, r) => {
    const originals = logos.map(buildSlide);
    const n = originals.length;
    const copies = Math.max(2, Math.ceil(LOOP_MIN / n));
    const row = el('div', `partners-bar-row ${r === 0 ? 'partners-bar-row-top' : 'partners-bar-row-bottom'}`, {
      'aria-label': r === 0 ? 'Partners Slider (direction right to left)' : 'Partners Slider',
    });
    const track = el('div', 'partners-bar-track');
    track.style.setProperty('--count', String(n));
    const slides = [];
    for (let c = 0; c < copies; c += 1) {
      originals.forEach((o) => {
        if (c === 0) {
          slides.push(o);
          return;
        }
        const clone = stripInstrumentation(o.cloneNode(true));
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
        slides.push(clone);
      });
    }
    slides.forEach((s, i) => {
      s.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
      track.append(s);
    });
    row.append(track);
    rowsBox.append(row);
    marquees.push([row, track, n, slides]);
  });

  const btn = el('div', 'partners-bar-btn');
  btn.append(...ctas);

  block.replaceChildren(header, rowsBox);
  if (ctas.length) block.append(btn);
  marquees.forEach((args) => startMarquee(...args));
}
