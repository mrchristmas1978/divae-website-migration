/**
 * header — diva-e chrome (canon § 6): fixed header over a gradient scrim; a white pill nav
 * with hover mega menus from 1280px, a burger drawer below; mobile language links show at
 * the top of the page only; the site-wide custom cursor circle is mounted here.
 *
 * Reads the /nav document (or the page's `nav` metadata path). Default content only:
 *   section 1 — brand: <p><a href="/en/">:diva-e-logo:</a></p>
 *   section 2 — one <ul>; each <li> is a top link, or a label (plain text or link) with a
 *               nested <ul> panel. A panel whose items carry an image is a CARDS panel
 *               (card li = title link, image, text <p>, CTA link; image-less items = plain
 *               links); otherwise a COLUMNS panel (column li = head link + optional <ul>).
 *   section 3 — tools: <p><a>:search:</a></p>, a <ul> of language links (de, en), the CTA
 *               as <p><strong><a>…</a></strong></p>.
 *   metadata  — Robots | noindex (consumed by the pipeline; ignored here).
 *
 * @ew-exempt brand and search links — icon-only, no authored text
 * @ew-exempt mobile search + language links — presentational clones (stripInstrumentation)
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const DESKTOP = window.matchMedia('(min-width: 1280px)');
const MOTION_OK = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

// presentational clones must not keep the editor's indices (EW4)
function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

// the authored <p> around a node when it is the node's only wrapper, else the node itself
function unitOf(node, stop) {
  const p = node.parentElement;
  return p && p.tagName === 'P' && p !== stop && p.children.length === 1 ? p : node;
}

// replace an icon span (decorateIcons output) by the inline SVG so CSS can recolour it
async function inlineIcon(span, className) {
  if (!span) return;
  const name = [...span.classList].find((c) => c.startsWith('icon-'));
  if (!name) return;
  try {
    const resp = await fetch(`${window.hlx.codeBasePath}/icons/${name.substring(5)}.svg`);
    if (!resp.ok) return;
    const doc = new DOMParser().parseFromString(await resp.text(), 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return;
    if (className) svg.classList.add(className);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    span.replaceWith(document.importNode(svg, true));
  } catch {
    // keep the <img> icon
  }
}

// the label of a nav <li>: its direct link, or its text (authored <p> or bare text nodes)
function takeLabel(li) {
  const link = li.querySelector(':scope > a, :scope > p > a');
  if (link) return { node: unitOf(link, li), link };
  const p = li.querySelector(':scope > p');
  if (p) return { node: p, link: null };
  const texts = [...li.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
  if (!texts.length) return { node: null, link: null };
  const span = el('span');
  span.append(...texts);
  return { node: span, link: null };
}

function buildColumns(sub) {
  const panel = el('div', 'menu-item-submenu menu-item-submenu-columns');
  const cont = el('ul', 'menu-item-submenu-inner');
  [...sub.children].forEach((li) => {
    const col = el('li', 'menu-item menu-item-column');
    const { node, link } = takeLabel(li);
    if (link) link.classList.add('menu-item-link', 'menu-item-link-head');
    if (node) col.append(node);
    const list = li.querySelector(':scope > ul');
    if (list) {
      list.classList.add('menu-item-sublist');
      [...list.children].forEach((item) => {
        item.classList.add('menu-item');
        item.querySelectorAll('a').forEach((a) => a.classList.add('menu-item-link'));
      });
      col.append(list);
    }
    cont.append(col);
  });
  panel.append(cont);
  return panel;
}

function buildCard(li) {
  const card = el('li', 'menu-card');
  const links = [...li.querySelectorAll('a')];
  const title = links[0];
  const cta = links.length > 1 ? links[links.length - 1] : null;
  const media = li.querySelector('picture, img');
  const text = [...li.querySelectorAll('p')].find((p) => !p.querySelector('a, picture, img'));
  if (title) {
    const label = title.textContent.trim();
    card.append(el('a', 'menu-card-overlay', { href: title.href, 'aria-label': `Go to ${label}` }));
    title.classList.add('menu-card-title');
    card.append(unitOf(title, li));
  }
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) img.classList.add('menu-card-image');
    card.append(unitOf(media, li));
  }
  if (text) {
    text.classList.add('menu-card-text');
    card.append(text);
  }
  if (cta) {
    cta.classList.add('menu-card-cta');
    card.append(unitOf(cta, li));
  }
  return card;
}

function buildCards(sub) {
  const panel = el('div', 'menu-item-submenu menu-item-submenu-cards');
  const cont = el('ul', 'menu-item-submenu-inner');
  let plain = null;
  [...sub.children].forEach((li) => {
    if (li.querySelector('picture, img')) {
      cont.append(buildCard(li));
      return;
    }
    if (!plain) {
      const group = el('li', 'menu-item-no-card');
      plain = el('ul');
      group.append(plain);
      cont.append(group);
    }
    const item = el('li', 'menu-item');
    const { node, link } = takeLabel(li);
    if (link) link.classList.add('menu-item-link');
    if (node) item.append(node);
    plain.append(item);
  });
  panel.append(cont);
  return panel;
}

function setSubmenu(header, item, open) {
  item.classList.toggle('is-active', open);
  const trigger = item.querySelector(':scope > .menu-item-link, :scope > p > .menu-item-link');
  if (trigger) trigger.setAttribute('aria-expanded', String(open));
  const any = header.querySelector('.menu-item-has-submenu.is-active, .menu-item-has-submenu.is-hover');
  header.classList.toggle('is-submenu-open', DESKTOP.matches && !!any);
}

function closeSubmenus(header) {
  header.querySelectorAll('.menu-item-has-submenu').forEach((item) => {
    item.classList.remove('is-hover');
    setSubmenu(header, item, false);
  });
}

function buildTopItem(li, header) {
  const item = el('li', 'menu-item menu-item-top');
  const sub = li.querySelector(':scope > ul');
  const label0 = takeLabel(li);
  const { link } = label0;
  let { node } = label0;
  let trigger = link;
  if (!link && node) {
    // a label without a link: the authored text moves into a focusable wrapper (EW7)
    trigger = el('div', 'menu-item-link', { role: 'button', tabindex: '0' });
    trigger.append(node);
    node = trigger;
  }
  if (link) link.classList.add('menu-item-link');
  if (node) item.append(node);
  if (!sub) return item;

  item.classList.add('menu-item-has-submenu');
  const cards = sub.querySelector(':scope > li picture, :scope > li img');
  item.append(cards ? buildCards(sub) : buildColumns(sub));
  if (!trigger) return item;
  const label = trigger.textContent.trim();
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'true');
  if (!link) trigger.setAttribute('aria-label', `Open ${label} Submenu`);
  if (!DESKTOP.matches) item.setAttribute('aria-label', `Go to ${label}`);

  item.addEventListener('mouseenter', () => {
    if (!DESKTOP.matches) return;
    item.classList.add('is-hover');
    setSubmenu(header, item, item.classList.contains('is-active'));
  });
  item.addEventListener('mouseleave', () => {
    item.classList.remove('is-hover');
    setSubmenu(header, item, false);
  });
  const toggle = (e) => {
    if (link && !DESKTOP.matches) return; // a linked label navigates in the drawer
    e.preventDefault();
    const open = !item.classList.contains('is-active');
    if (open) closeSubmenus(header);
    setSubmenu(header, item, open);
  };
  trigger.addEventListener('click', (e) => {
    if (link && DESKTOP.matches) return; // hover opens it; the click follows the link
    toggle(e);
  });
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') toggle(e);
  });
  return item;
}

function markActiveLanguage(list) {
  const path = window.location.pathname;
  let best = null;
  let bestLen = -1;
  list.querySelectorAll('a').forEach((a) => {
    const p = new URL(a.href, window.location).pathname;
    if (path.startsWith(p) && p.length > bestLen) {
      best = a;
      bestLen = p.length;
    }
  });
  list.querySelectorAll('li').forEach((li) => li.classList.toggle('active', !!best && li.contains(best)));
}

function mountCursor() {
  if (document.querySelector('.cursor-circle')) return;
  const circle = el('div', 'cursor-circle', { 'aria-hidden': 'true' });
  document.body.append(circle);
  document.addEventListener('pointermove', (e) => {
    if (!MOTION_OK.matches) return;
    circle.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(1)`;
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    circle.classList.toggle('cursor-hide', !!t.closest('iframe, video'));
    circle.classList.toggle('cursor-blur', !!t.closest('a, button, [role="button"]'));
  }, { passive: true });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  fragment.querySelectorAll('.metadata').forEach((m) => m.remove());
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('img, .icon'));
  const navSection = sections.find((s) => s.querySelector('ul ul')) || sections[1];
  const brandSection = sections.find((s) => s !== navSection) || null;
  const toolsSection = sections.find((s) => s !== navSection && s !== brandSection) || null;

  const header = block;
  const container = el('div', 'header-bar');

  // brand
  const logo = brandSection ? brandSection.querySelector('a') : null;
  if (logo) {
    logo.classList.add('header-logo');
    logo.setAttribute('aria-label', 'Go to Homepage');
    container.append(unitOf(logo, brandSection));
    await inlineIcon(logo.querySelector('.icon'), 'logo');
    const svg = logo.querySelector('svg');
    if (svg) svg.setAttribute('aria-label', 'diva-e logo');
  }

  // tools
  const search = toolsSection
    ? [...toolsSection.querySelectorAll('a')].find((a) => a.querySelector('.icon'))
    : null;
  const langs = toolsSection ? toolsSection.querySelector('ul') : null;
  const cta = toolsSection
    ? [...toolsSection.querySelectorAll('a')].find((a) => a !== search && !langs?.contains(a))
    : null;
  if (search) {
    search.setAttribute('aria-label', 'Open search');
    await inlineIcon(search.querySelector('.icon'));
  }
  if (langs) {
    langs.classList.add('header-langs');
    langs.querySelectorAll('a').forEach((a) => {
      a.classList.add('header-lang-item');
      a.setAttribute('aria-label', `Select Language ${a.textContent.trim()}`);
    });
    markActiveLanguage(langs);
  }

  // mobile row: search + languages (presentational clones) + burger
  const mobile = el('div', 'header-mobile');
  if (search) {
    const s = stripInstrumentation(search.cloneNode(true));
    s.className = 'header-icon-search';
    s.setAttribute('aria-label', 'Go to Search');
    mobile.append(s);
  }
  let mobileLangs = null;
  if (langs) {
    mobileLangs = stripInstrumentation(langs.cloneNode(true));
    mobileLangs.classList.add('header-langs-mobile');
    mobile.append(mobileLangs);
    langs.classList.add('header-langs-desktop');
  }
  const burger = el('button', 'header-btn-burger', {
    type: 'button', 'aria-label': 'Open Main Navigation', 'aria-expanded': 'false', 'aria-controls': 'nav',
  });
  burger.append(el('span'), el('span'), el('span'));
  mobile.append(burger);
  container.append(mobile);

  // nav: menu, desktop search, languages, contact
  const nav = el('nav', 'header-nav', { id: 'nav', 'aria-label': 'Main' });
  const navContainer = el('div', 'header-nav-inner');
  const menu = navSection ? navSection.querySelector('ul') : null;
  if (menu) {
    const wrapper = el('ul', 'header-nav-list');
    [...menu.children].forEach((li) => wrapper.append(buildTopItem(li, header)));
    navContainer.append(wrapper);
  }
  nav.append(navContainer);
  if (search) {
    const box = el('div', 'header-icon-search header-icon-search-desktop');
    box.append(unitOf(search, toolsSection));
    nav.append(box);
  }
  if (langs) nav.append(langs);
  if (cta) {
    cta.classList.add('btn', 'btn-fill', 'btn-menu');
    cta.classList.remove('button', 'primary');
    const box = el('div', 'header-contact');
    box.append(cta.closest('p') || cta);
    nav.append(box);
  }
  container.append(nav);
  block.replaceChildren(container);

  // behaviour
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close Main Navigation' : 'Open Main Navigation');
  };
  burger.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (header.querySelector('.menu-item-has-submenu.is-active')) closeSubmenus(header);
    else if (header.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });
  header.addEventListener('focusout', (e) => {
    if (DESKTOP.matches && !header.contains(e.relatedTarget)) closeSubmenus(header);
  });
  DESKTOP.addEventListener('change', () => {
    setOpen(false);
    closeSubmenus(header);
  });

  // mobile languages are visible at the top of the page only (live: `show` class)
  if (mobileLangs) {
    const onScroll = () => mobileLangs.classList.toggle('show', window.scrollY <= 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  mountCursor();
}
