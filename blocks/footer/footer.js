/**
 * footer — diva-e chrome (canon § 7): navy band with link lists, the newsletter call,
 * the legal row, social icons and a back-to-top button.
 *
 * Reads the /footer document (or the page's `footer` metadata path). Default content only,
 * one section per band (classified by content, not position):
 *   top links   — <ul> of links (Jobs, Whistleblower system); repeated in the desktop legal row
 *   newsletter  — <p><a>Subscribe to diva-e newsletter!</a></p>
 *   main links  — the longest <ul> of links
 *   legal       — <p>copyright</p> + <ul> of links (Imprint, Data protection)
 *   social      — <ul> of icon links (:instagram:, :youtube:, :linkedin:)
 *   metadata    — Robots | noindex (consumed by the pipeline; ignored here).
 *
 * @ew-exempt social links — icon-only, no authored text
 * @ew-exempt desktop legal-row copies of the top links and of the newsletter link —
 *   presentational clones (stripInstrumentation)
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

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

async function inlineIcon(span) {
  if (!span) return;
  const name = [...span.classList].find((c) => c.startsWith('icon-'));
  if (!name) return;
  try {
    const resp = await fetch(`${window.hlx.codeBasePath}/icons/${name.substring(5)}.svg`);
    if (!resp.ok) return;
    const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    span.replaceWith(document.importNode(svg, true));
  } catch {
    // keep the <img> icon
  }
}

// wrap the link's own child nodes in a span (inner restructuring; the anchor itself moves)
function spanInside(a, className) {
  const span = el('span', className);
  span.append(...a.childNodes);
  a.append(span);
  return a;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  fragment.querySelectorAll('.metadata').forEach((m) => m.remove());
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('.icon'));

  const social = sections.find((s) => s.querySelector('a .icon'));
  const legal = sections.find((s) => s !== social
    && [...s.querySelectorAll('p')].some((p) => !p.querySelector('a')));
  const news = sections.find((s) => s !== social && s !== legal && !s.querySelector('ul')
    && s.querySelector('a'));
  const lists = sections.filter((s) => ![social, legal, news].includes(s) && s.querySelector('ul'))
    .sort((a, b) => b.querySelectorAll('a').length - a.querySelectorAll('a').length);
  const [main, top] = lists;

  const inner = el('div', 'footer-inner');

  let topLinks = [];
  if (top) {
    const nav = el('nav', 'footer-top-navigation', { 'aria-label': 'Footer' });
    const ul = top.querySelector('ul');
    topLinks = [...ul.querySelectorAll('a')];
    topLinks.forEach((a) => a.classList.add('text-xxsmall'));
    nav.append(ul);
    inner.append(nav);
  }

  let newsLink = null;
  if (news) {
    newsLink = news.querySelector('a');
    const box = el('div', 'footer-newsletter');
    newsLink.className = 'btn footer-newsletter-link';
    box.append(newsLink.closest('p') || newsLink);
    spanInside(newsLink, 'h2');
    inner.append(box);
  }

  if (main) {
    const nav = el('nav', 'footer-main-navigation', { 'aria-label': 'Services' });
    const ul = main.querySelector('ul');
    ul.querySelectorAll('a').forEach((a) => {
      a.className = 'btn btn-link';
    });
    nav.append(ul);
    inner.append(nav);
  }

  const bottom = el('div', 'footer-bottom-navigation');
  const bottomNav = el('nav', 'footer-bottom-nav', { 'aria-label': 'Legal' });
  const bottomList = el('ul');
  if (legal) {
    legal.querySelectorAll('p').forEach((p) => {
      if (p.querySelector('a')) return;
      const li = el('li', 'text-xxsmall');
      li.append(p);
      bottomList.append(li);
    });
    legal.querySelectorAll('li').forEach((li) => {
      li.querySelectorAll('a').forEach((a) => {
        a.className = 'btn btn-link text-xxsmall';
      });
      bottomList.append(li);
    });
  }
  topLinks.forEach((a) => {
    const li = el('li', 'footer-bottom-desktop');
    const copy = stripInstrumentation(a.cloneNode(true));
    copy.className = 'btn btn-link text-xxsmall';
    li.append(copy);
    bottomList.append(li);
  });
  bottomNav.append(bottomList);
  bottom.append(bottomNav);

  const media = el('div', 'footer-social-media');
  if (newsLink) {
    const box = el('div', 'footer-bottom-newsletter');
    const copy = stripInstrumentation(newsLink.cloneNode(true));
    copy.className = 'btn-link';
    const span = copy.querySelector('span');
    if (span) span.className = '';
    box.append(copy);
    media.append(box);
  }
  if (social) {
    const icons = [];
    social.querySelectorAll('a').forEach((a) => {
      const icon = a.querySelector('.icon');
      const name = icon ? [...icon.classList].find((c) => c.startsWith('icon-')) : '';
      a.className = 'footer-social';
      if (name) a.setAttribute('aria-label', `Go to diva-e ${name.substring(5)}`);
      a.target = '_blank';
      a.rel = 'noopener';
      icons.push(inlineIcon(icon));
      media.append(a);
    });
    await Promise.all(icons);
  }
  bottom.append(media);
  inner.append(bottom);

  const toTop = el('div', 'footer-btn-to-top');
  const button = el('button', '', { type: 'button', 'aria-label': 'scroll to top' });
  const arrow = el('span', 'icon icon-arrow-light');
  button.append(arrow);
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toTop.append(button);
  await inlineIcon(arrow);

  block.replaceChildren(inner, toTop);
}
