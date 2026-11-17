/**
 * article-list — source ArticleList (insights / news listing): section headline, filter pills
 * (inline >= 768, a full-screen "Filter by" sheet below), a grid of list-article cards with the
 * "View more" hover disc, and the page pagination.
 * Schema: stardust/eds-schema/en-insights-edge.json § article-list.
 * Decode tier: reconstructive (authors add / remove cards, pills and pages); rows are classified
 * by content, never by index.
 *
 * Authoring:
 *   head row   — <h2> headline · <ul> of filter labels (the first is the active "All items")
 *   card rows  — one per card: <picture> (card image) · <ul> of categories · <p> date ·
 *                <p> with the article link (title) · <p> teaser · <picture> (author avatar) ·
 *                <p> author name
 *   pages row  — <ul> of page labels (numbers; "-" is the gap spacer); the first is current
 * Captured state (replica progress.json types.listing.captureState): the static first page of
 * cards + pagination; the filter and page query is a dynamic surface (dynamics phase) — pills
 * toggle their active state only, pages are inert. The mobile filter sheet starts closed.
 *
 * Variants (block classes, listing siblings — the archetype /en/insights/edge is the default):
 *   teaser  — source TeaserList (customers, partner, events, locations): list-card grid
 *             (image [+ logo icon], optional bold name line, linked title, optional teaser),
 *             filter pills above, 3-up >= 1200; no headline row
 *   news    — source NewsList (news, downloads): the same list-card grid, centred pill row
 *   product — source ProductList (marketplace): a "Filters" sidebar (title <p>, group label
 *             <p>s each followed by a <ul> of checkbox labels), a search box (placeholder), product
 *             cards (image, linked title, description, price) and the pagination. Config rows
 *             are key | value: `Filters` | sidebar, `Search` | placeholder.
 *   list-card rows: <picture> (image) · [<picture> (logo icon over the image)] · [<p> name] ·
 *             <p> with the link (title) · [<p> teaser]
 *
 * @ew-exempt "Filter by", "View more", "next →", "← previous" and the category / date "|"
 *   separators are presentational UI chrome of the listing module (code-owned, aria-hidden or
 *   control labels), not authored copy; the product variant's config keys ("Filters", "Search")
 *   are row keys and the search placeholder is read into the input's placeholder attribute.
 */

const hasText = (node) => node.textContent.trim().length > 0;
const isHeading = (node) => /^H[1-6]$/.test(node.tagName);
const mediaOf = (node) => (node.matches('picture, img') ? node : node.querySelector('picture, img'));
const isMediaOnly = (node) => !!mediaOf(node) && !hasText(node);
const linkOnly = (node) => {
  const a = node.tagName === 'P' ? node.querySelector('a[href]') : null;
  return a && node.textContent.trim() === a.textContent.trim() ? a : null;
};
const isPageList = (ul) => ul.children.length > 0
  && [...ul.children].every((li) => /^(\d+|-|…|\.\.\.)$/.test(li.textContent.trim()));

const ARROW = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none" viewBox="0 0 25 24"><path fill="#1B31FF" d="M24.922 12 13.297.024l-1.187 1.21 9.92 9.92H.922v1.693H22.03L12.1 22.78l1.198 1.198L24.922 12Z"/></svg>';
const CHEVRON = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 25 25"><path fill="#081235" d="M12.75 19.576 24.726 7.951l-1.21-1.186L12.75 17.232 1.97 6.752.773 7.952 12.75 19.576Z"/></svg>';
const CROSS = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="33" height="32" fill="none" viewBox="0 0 33 32"><path stroke="#081235" stroke-width="2" d="m4.022 3.271 25.456 25.456M29.478 3.271 4.022 28.727"/></svg>';

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function rowNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img') && hasText(kids[0])) {
      // the runtime folded a media-led cell into one <p>: expand it
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): move the bare text node into a <p>, never copy it
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (hasText(cell)) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

/** move an <li>'s children into a span (pill / page label); never copies text */
function wrapLabel(li, className) {
  const span = el('span', className);
  span.append(...li.childNodes);
  li.append(span);
  return span;
}

function buildFilters(list) {
  const root = el('div', 'filter-buttons');
  const open = el('div', 'filter-buttons-open text-small');
  const openBtn = el('button', 'filter-buttons-btn-mobile text-small', {
    type: 'button', 'aria-label': 'Open filter on mobile', 'aria-expanded': 'false',
  });
  const openLabel = el('span');
  openLabel.append('Filter by ');
  openLabel.insertAdjacentHTML('beforeend', CHEVRON);
  openBtn.append(openLabel);
  open.append(openBtn);

  const sheet = el('div', 'filter-buttons-btn-list');
  const close = el('div', 'filter-buttons-close text-small');
  const closeLabel = el('span');
  closeLabel.textContent = 'Filter by';
  const closeBtn = el('button', '', { type: 'button', 'aria-label': 'Close filter on mobile' });
  closeBtn.innerHTML = CROSS;
  close.append(closeLabel, closeBtn);

  const pillsBox = el('div', 'filter-buttons-pills');
  list.classList.add('filter-buttons-pill-list');
  const pills = [...list.children];
  pills.forEach((li, i) => {
    li.classList.add('btn', 'btn-filter');
    if (!li.querySelector(':scope > .text')) wrapLabel(li, 'text');
    const name = li.textContent.trim();
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `Button to filter for ${name}`);
    li.setAttribute('aria-pressed', String(i === 0));
    li.classList.toggle('active', i === 0);
  });
  pillsBox.append(list);
  sheet.append(close, pillsBox);
  root.append(open, sheet);

  const setOpen = (on) => {
    sheet.classList.toggle('is-open', on);
    openBtn.setAttribute('aria-expanded', String(on));
  };
  openBtn.addEventListener('click', () => setOpen(!sheet.classList.contains('is-open')));
  closeBtn.addEventListener('click', () => setOpen(false));
  const activate = (pill) => {
    pills.forEach((p) => {
      p.classList.toggle('active', p === pill);
      p.setAttribute('aria-pressed', String(p === pill));
    });
  };
  pills.forEach((pill) => {
    pill.addEventListener('click', () => activate(pill));
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(pill);
      }
    });
  });
  return root;
}

function bindHover(hb) {
  const cursor = hb.querySelector('.hover-button-cursor');
  const move = (e) => {
    const r = hb.getBoundingClientRect();
    cursor.style.left = `${e.clientX - r.left}px`;
    cursor.style.top = `${e.clientY - r.top}px`;
  };
  hb.addEventListener('mouseenter', (e) => {
    move(e);
    cursor.classList.add('hover-button-cursor-active');
  });
  hb.addEventListener('mousemove', move);
  hb.addEventListener('mouseleave', () => cursor.classList.remove('hover-button-cursor-active'));
}

function buildCard(nodes) {
  const c = {
    media: null, cats: [], dates: [], title: null, teaser: [], avatar: null, names: [], rest: [],
  };
  nodes.forEach((n) => {
    if (isMediaOnly(n)) {
      if (!c.title && !c.media) c.media = mediaOf(n);
      else if (!c.avatar) c.avatar = mediaOf(n);
      else c.rest.push(n);
    } else if (n.matches('ul, ol') && !c.title) {
      c.cats.push(n);
    } else if (!c.title && (linkOnly(n) || isHeading(n))) {
      c.title = n;
    } else if (n.tagName === 'P' && hasText(n)) {
      if (!c.title) c.dates.push(n);
      else if (c.avatar) c.names.push(n);
      else c.teaser.push(n);
    } else {
      c.rest.push(n);
    }
  });

  const card = el('article', 'list-article-card');
  const titleLink = c.title ? c.title.querySelector('a[href]') : null;
  const href = titleLink ? titleLink.getAttribute('href') : null;
  const titleText = c.title ? c.title.textContent.trim() : '';

  const imgBox = el('div', 'card-img-box');
  const img = el('div', 'card-img');
  if (c.media) img.append(c.media);
  imgBox.append(img);
  const hb = el('div', 'hover-button');
  const cursor = el('div', 'hover-button-cursor', { 'aria-hidden': 'true' });
  const disc = el('div');
  disc.textContent = 'View more';
  cursor.append(disc);
  hb.append(cursor);
  if (href) {
    hb.append(el('a', 'hover-button-link', { href, 'aria-label': 'link', tabindex: '-1' }));
  }
  imgBox.append(hb);
  card.append(imgBox);

  if (c.cats.length || c.dates.length) {
    const label = el('div', 'card-label dot-blur-12 text-xsmall');
    if (c.cats.length) label.classList.add('has-cats');
    label.append(...c.cats, ...c.dates);
    card.append(label);
  }
  if (c.title) {
    const title = el('div', 'card-title');
    if (titleLink) titleLink.setAttribute('aria-label', `Go to ${titleText}`);
    title.append(c.title);
    card.append(title);
  }
  if (c.teaser.length) {
    const t = el('div', 'card-teaser text-xsmall');
    t.append(...c.teaser);
    card.append(t);
  }
  if (c.avatar || c.names.length) {
    const author = el('div', 'card-author');
    if (c.avatar) {
      const a = el('div', 'card-author-img');
      a.append(c.avatar);
      author.append(a);
    }
    if (c.names.length) {
      const n = el('div', 'card-author-name');
      n.append(...c.names);
      author.append(n);
    }
    card.append(author);
  }
  if (c.rest.length) card.append(...c.rest); // never drop an authored element
  bindHover(hb);
  return card;
}

function buildPagination(list) {
  const nav = el('div', 'list-pagination list-pagination-dark');
  list.classList.add('list-pagination-pages');
  const items = [...list.children];
  let current = 1;
  items.forEach((li, i) => {
    li.classList.add('list-pagination-page');
    const label = li.textContent.trim();
    if (!/^\d+$/.test(label)) {
      li.classList.add('list-pagination-spacer');
      return;
    }
    const active = i === 0;
    if (active) current = Number(label);
    li.classList.toggle('list-pagination-page-active', active);
    if (!li.querySelector(':scope > .page-label')) wrapLabel(li, 'page-label');
    // an empty hit area over the authored label (EW7: no <button> hosts authored text)
    const hit = el('button', 'page-hit', { type: 'button', 'aria-label': `Button page ${label}` });
    if (active) hit.setAttribute('aria-current', 'page');
    li.append(hit);
  });
  const arrows = el('div', 'list-pagination-nav');
  const next = el('button', 'arrow-right', {
    type: 'button', 'aria-label': `Go to page ${current + 1}`,
  });
  const nextLabel = el('span');
  nextLabel.textContent = 'next →';
  const nextIcon = el('span', 'mobile-arrow');
  nextIcon.innerHTML = ARROW;
  next.append(nextLabel, nextIcon);
  const prev = el('button', 'arrow-left', {
    type: 'button', 'aria-label': `Go to page ${current - 1}`,
  });
  prev.disabled = current <= 1;
  const prevLabel = el('span');
  prevLabel.textContent = '← previous';
  const prevIcon = el('span', 'mobile-arrow');
  prevIcon.innerHTML = ARROW;
  prev.append(prevLabel, prevIcon);
  arrows.append(next, prev);
  nav.append(list, arrows);
  return nav;
}

/* list-card (teaser / news variants) */
function buildListCard(nodes) {
  const c = {
    media: null, icon: null, names: [], title: null, teaser: [], rest: [],
  };
  nodes.forEach((n) => {
    if (isMediaOnly(n) && !c.title) {
      if (!c.media) c.media = mediaOf(n);
      else if (!c.icon) c.icon = mediaOf(n);
      else c.rest.push(n);
    } else if (!c.title && (linkOnly(n) || isHeading(n))) {
      c.title = n;
    } else if (n.tagName === 'P' && hasText(n)) {
      if (!c.title) c.names.push(n);
      else c.teaser.push(n);
    } else {
      c.rest.push(n);
    }
  });

  const card = el('div', 'list-card');
  const titleLink = c.title ? c.title.querySelector('a[href]') : null;
  const href = titleLink ? titleLink.getAttribute('href') : null;
  const titleText = c.title ? c.title.textContent.trim() : '';
  if (href) {
    card.append(el('a', 'list-card-card-link', { href, tabindex: '-1', 'aria-hidden': 'true' }));
  }
  if (c.media) {
    const box = el('div', 'list-card-img-container');
    const img = el('div', 'list-card-img');
    img.append(c.media);
    box.append(img);
    if (c.icon) {
      img.classList.add('has-icon');
      const icon = el('div', 'list-card-icon');
      icon.append(c.icon);
      box.append(icon);
    }
    const hb = el('div', 'hover-button');
    const cursor = el('div', 'hover-button-cursor', { 'aria-hidden': 'true' });
    const disc = el('div');
    disc.textContent = 'View more';
    cursor.append(disc);
    hb.append(cursor);
    if (href) hb.append(el('a', 'hover-button-link', { href, 'aria-label': 'link', tabindex: '-1' }));
    box.append(hb);
    card.append(box);
    bindHover(hb);
  }
  if (c.names.length) {
    const name = el('div', 'list-card-name dot-blur-16');
    const inner = el('div');
    inner.append(...c.names);
    name.append(inner);
    card.append(name);
  }
  if (c.title) {
    const title = el('div', 'list-card-title');
    if (titleLink) {
      titleLink.classList.add('list-card-link');
      titleLink.setAttribute('aria-label', `Go to ${titleText}`);
    }
    title.append(c.title);
    card.append(title);
  }
  if (c.teaser.length) {
    const t = el('div', 'list-card-teaser');
    t.append(...c.teaser);
    card.append(t);
  }
  if (c.rest.length) card.append(...c.rest); // never drop an authored element
  return card;
}

/* list-product-card (product variant) */
function buildProductCard(nodes) {
  const c = {
    media: null, title: null, texts: [], rest: [],
  };
  nodes.forEach((n) => {
    if (isMediaOnly(n) && !c.media && !c.title) c.media = mediaOf(n);
    else if (!c.title && (linkOnly(n) || isHeading(n))) c.title = n;
    else if (n.tagName === 'P' && hasText(n)) c.texts.push(n);
    else c.rest.push(n);
  });
  const card = el('div', 'list-product-card');
  const titleLink = c.title ? c.title.querySelector('a[href]') : null;
  const href = titleLink ? titleLink.getAttribute('href') : null;
  if (href) {
    card.append(el('a', 'list-product-card-card-link', { href, tabindex: '-1', 'aria-hidden': 'true' }));
  }
  if (c.media) {
    const box = el('div', 'list-product-card-img-container');
    const img = el('div', 'list-product-card-img');
    img.append(c.media);
    box.append(img);
    card.append(box);
  }
  const info = el('div', 'list-product-card-info');
  const text = el('div', 'list-product-card-text');
  if (c.title) {
    c.title.classList.add('list-product-card-title');
    if (titleLink) titleLink.setAttribute('aria-label', `Go to ${c.title.textContent.trim()}`);
    text.append(c.title);
  }
  // the last text line is the price (source list-product-card__price), the rest describe
  const price = c.texts.length > 1 ? c.texts.pop() : null;
  if (c.texts.length) {
    const d = el('div', 'list-product-card-description');
    d.append(...c.texts);
    text.append(d);
  }
  info.append(text);
  if (price) {
    const p = el('div', 'list-product-card-price');
    p.append(price);
    info.append(p);
  }
  card.append(info);
  if (c.rest.length) card.append(...c.rest);
  return card;
}

const CHECK_CHEVRON = '<svg aria-hidden="true" class="product-filter-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 25 25"><path fill="#081235" d="M12.75 19.576 24.726 7.951l-1.21-1.186L12.75 17.232 1.97 6.752.773 7.952 12.75 19.576Z"/></svg>';
const SEARCH = '<svg aria-hidden="true" class="product-list-search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7.5" stroke="#081235" stroke-width="1.5"/><path stroke="#081235" stroke-width="1.5" d="m16 16 6 6"/></svg>';

/* product variant: the filter sidebar (title, groups of checkbox labels) */
function buildSidebar(nodes) {
  const side = el('aside', 'product-list-sidebar');
  const box = el('div', 'product-filter-sidebar');
  const groups = el('div', 'product-filter-groups');
  let header = null;
  let group = null;
  // a group label is the line (heading or <p>) right before its option list
  const labels = new Set(nodes.filter((n) => !n.matches('ul, ol')
    && n.nextElementSibling && n.nextElementSibling.matches('ul, ol')));
  nodes.forEach((n) => {
    if (labels.has(n)) {
      group = el('div', 'product-filter-group');
      const btn = el('button', 'product-filter-group-header', { type: 'button', 'aria-expanded': 'true' });
      // the authored group label stays inside the toggle row (EW7: the button is an empty hit
      // area beside it)
      const head = el('div', 'product-filter-group-head');
      n.classList.add('product-filter-group-label');
      head.append(n, btn);
      btn.insertAdjacentHTML('beforeend', CHECK_CHEVRON);
      btn.setAttribute('aria-label', `Toggle ${n.textContent.trim()}`);
      group.append(head);
      groups.append(group);
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        group.classList.toggle('is-collapsed', !open);
      });
    } else if (n.matches('ul, ol') && group) {
      n.classList.add('product-filter-options');
      [...n.children].forEach((li) => {
        li.classList.add('product-filter-option');
        const label = wrapLabel(li, 'product-filter-check-label');
        const box2 = el('span', 'product-filter-checkbox', { 'aria-hidden': 'true' });
        li.insertBefore(box2, label);
        li.setAttribute('role', 'checkbox');
        li.setAttribute('aria-checked', 'false');
        li.setAttribute('tabindex', '0');
        const toggle = () => {
          const on = li.getAttribute('aria-checked') !== 'true';
          li.setAttribute('aria-checked', String(on));
          li.classList.toggle('active', on);
        };
        li.addEventListener('click', toggle);
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
      });
      group.append(n);
    } else if (!header && !group) {
      header = el('div', 'product-filter-header');
      n.classList.add('product-filter-title');
      header.append(n);
    } else {
      (group || box).append(n); // never drop an authored element
    }
  });
  if (header) box.append(header);
  box.append(groups);
  side.append(box);
  return side;
}

function buildSearch(nodes) {
  const bar = el('div', 'product-list-toolbar');
  const search = el('div', 'product-list-search');
  const p = nodes.find((n) => hasText(n));
  const input = el('input', 'product-list-search-input', {
    type: 'text', 'aria-label': p ? p.textContent.trim() : 'Search',
  });
  if (p) {
    input.placeholder = p.textContent.trim();
    p.remove();
  }
  search.append(input);
  search.insertAdjacentHTML('beforeend', SEARCH);
  bar.append(search);
  return bar;
}

const keyOf = (row) => {
  const cells = [...row.children];
  if (cells.length !== 2) return null;
  const k = cells[0].textContent.trim().toLowerCase();
  return ['filters', 'search'].includes(k) ? k : null;
};

function decorateProduct(block) {
  const layout = el('div', 'product-list-layout');
  const content = el('div', 'product-list-content');
  const cards = el('div', 'product-list-cards');
  let sidebar = null;
  let toolbar = null;
  let pagination = null;
  const leftovers = [];
  [...block.children].forEach((row) => {
    const key = keyOf(row);
    if (key) {
      const value = [...row.children[1].children];
      if (key === 'filters') sidebar = buildSidebar(value);
      else toolbar = buildSearch(value);
      return;
    }
    const nodes = rowNodes(row);
    if (!nodes.length) return;
    const lists = nodes.filter((n) => n.matches('ul, ol'));
    if (nodes.some((n) => isMediaOnly(n) || linkOnly(n))) cards.append(buildProductCard(nodes));
    else if (!pagination && lists.length && lists.every(isPageList)) {
      pagination = buildPagination(lists[0]);
      leftovers.push(...nodes.filter((n) => n !== lists[0]));
    } else leftovers.push(...nodes);
  });
  if (sidebar) layout.append(sidebar);
  if (toolbar) content.append(toolbar);
  content.append(cards);
  if (pagination) content.append(pagination);
  if (leftovers.length) {
    const extra = el('div', 'article-list-extra');
    extra.append(...leftovers);
    content.append(extra);
  }
  layout.append(content);
  const inner = el('div', 'article-list-inner');
  inner.append(layout);
  block.replaceChildren(inner);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .article-list-inner')) return; // EW9
  if (block.classList.contains('product')) {
    decorateProduct(block);
    return;
  }
  const listCards = block.classList.contains('teaser') || block.classList.contains('news');
  const rows = [...block.children];
  if (!rows.length) return;

  const headline = el('div', 'article-list-headline');
  const filters = el('div', 'article-list-filters');
  const cards = el('div', 'article-list-cards');
  const leftovers = [];
  let pagination = null;

  rows.forEach((row) => {
    const nodes = rowNodes(row);
    if (!nodes.length) return;
    const lists = nodes.filter((n) => n.matches('ul, ol'));
    const isCard = nodes.some((n) => isMediaOnly(n) || linkOnly(n));
    if (isCard) {
      cards.append(listCards ? buildListCard(nodes) : buildCard(nodes));
    } else if (!pagination && lists.length && lists.every(isPageList)
      && !nodes.some(isHeading)) {
      pagination = buildPagination(lists[0]);
      leftovers.push(...nodes.filter((n) => n !== lists[0]));
    } else {
      nodes.forEach((n) => {
        if (isHeading(n) && !headline.childElementCount) headline.append(n);
        else if (n.matches('ul, ol') && !filters.childElementCount) {
          filters.append(buildFilters(n));
        } else leftovers.push(n);
      });
    }
  });

  const header = el('div', 'article-list-header');
  if (headline.childElementCount) header.append(headline);
  if (filters.childElementCount) header.append(filters);
  if (leftovers.length) {
    const extra = el('div', 'article-list-extra');
    extra.append(...leftovers); // never drop an authored element
    header.append(extra);
  }
  const inner = el('div', 'article-list-inner');
  if (header.childElementCount) inner.append(header);
  inner.append(cards);
  if (pagination) inner.append(pagination);
  block.replaceChildren(inner);
}
