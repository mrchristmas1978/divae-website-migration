/**
 * search — site search page (source GlobalSearch; dynamic-features row 5, index-backed):
 * a search box, the authored "Popular Searches" card, and results from the EDS query index
 * (`/query-index.json`) for `?q=` (+ optional `?filter=<type>`). Decode tier: template-slotted.
 *
 * Authoring (key | value rows):
 *   Placeholder | <p>…   — input placeholder (config)
 *   Submit | <p>…        — submit button label (config)
 *   Popular | <h1>… <ul><li><a href="/en/search?q=…">…</a></li></ul>  — popular searches card
 *   No results | <h2>… <p>…  — shown when a query has no hits (the query is appended, struck)
 *   Filters | <p>toggle label</p><ul><li>All</li>…</ul>  — result type filter (sidebar)
 *   Stats | <p>{count} results found</p>  — result count line ({count} is replaced)
 *   Index | <p>/query-index.json</p>  — optional index path
 * Authored copy is MOVED into the layout (EW1); key cells and config values move into a hidden
 * config holder (never displayed, never dropped).
 *
 * @ew-exempt key cells — metadata; Placeholder / Submit / Index values — config
 * @ew-exempt result cards — runtime data from the query index, not authored content
 */

const TYPES = [
  [/^\/en\/insights\/edge\/authors\//, 'Author'],
  [/^\/en\/insights\/edge\/./, 'Article'],
  [/^\/en\/insights\/news\/./, 'News'],
  [/^\/en\/insights\/press\/./, 'Press Release'],
  [/^\/en\/insights\/downloads\/./, 'Download'],
];

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function readConfig(block) {
  const cfg = { config: [], slots: {} };
  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    cfg.config.push(...cells[0].children);
    const value = cells[1];
    if (['placeholder', 'submit', 'index'].includes(key)) {
      cfg[key] = value.textContent.trim();
      cfg.config.push(...value.children);
    } else {
      cfg.slots[key] = [...value.children];
    }
  });
  return cfg;
}

function typeOf(path) {
  const hit = TYPES.find(([re]) => re.test(path));
  return hit ? hit[1] : '';
}

function crumbs(path) {
  const parts = path.split('/').filter(Boolean).slice(1);
  const words = (s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return ['Home', ...parts.map(words)];
}

let indexCache;
async function loadIndex(url) {
  if (!indexCache) {
    indexCache = fetch(url).then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => (j.data || []).filter((r) => r.path && r.path.startsWith('/en')))
      .catch(() => []);
  }
  return indexCache;
}

function resultCard(row) {
  const card = el('div', 'search-result');
  const link = el('a', 'search-result-link', { href: row.path, 'aria-label': `Go to ${row.title || row.path}` });
  const content = el('div', 'search-result-content');
  const type = typeOf(row.path);
  if (type) content.append(Object.assign(el('span', 'search-result-type'), { textContent: type }));
  content.append(Object.assign(el('div', 'search-result-title'), { textContent: (row.title || '').replace(/ \| diva-e Conclusion$/, '') }));
  if (row.description) content.append(Object.assign(el('p', 'search-result-subline'), { textContent: row.description }));
  const ul = el('ul', 'search-result-breadcrumb');
  crumbs(row.path).forEach((c) => ul.append(Object.assign(el('li'), { textContent: c })));
  content.append(ul);
  card.append(link, content);
  return card;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .search-container')) return; // EW9
  const cfg = readConfig(block);
  const container = el('div', 'search-container');

  const form = el('form', 'search-form', { role: 'search', action: window.location.pathname });
  const input = el('input', 'search-input', {
    type: 'search', name: 'q', placeholder: cfg.placeholder || '', 'aria-label': cfg.placeholder || 'Search',
  });
  const submit = el('button', 'search-submit', { type: 'submit' });
  submit.textContent = cfg.submit || 'Search';
  form.append(input, submit);

  const state = el('div', 'search-state');
  const popular = el('div', 'search-popular');
  popular.append(...(cfg.slots.popular || []));
  const stats = el('p', 'search-stats', { role: 'status', 'aria-live': 'polite' });
  const statsTpl = (cfg.slots.stats || []).map((n) => n.textContent).join(' ') || '{count} results found';
  cfg.config.push(...(cfg.slots.stats || []));
  const grid = el('div', 'search-grid');
  const noResults = el('div', 'search-no-results', { hidden: '' });
  noResults.append(...(cfg.slots['no results'] || []));
  const results = el('div', 'search-results');
  const sidebar = el('div', 'search-sidebar', { hidden: '' });
  const [toggleLabel, filterList] = cfg.slots.filters || [];
  const filters = [];
  if (toggleLabel && filterList) {
    const toggle = el('button', 'search-filter-toggle', { type: 'button', 'aria-expanded': 'true' });
    toggle.append(...toggleLabel.childNodes);
    filterList.classList.add('search-filters');
    [...filterList.children].forEach((li) => {
      const btn = el('button', 'search-filter', { type: 'button' });
      btn.append(...li.childNodes);
      li.append(btn);
      filters.push(btn);
    });
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      sidebar.classList.toggle('is-open', !open);
    });
    sidebar.classList.add('is-open');
    sidebar.append(toggle, filterList);
    cfg.config.push(toggleLabel);
  }
  grid.append(noResults, results, sidebar);
  state.append(popular, stats, grid);
  container.append(form, state);
  const config = el('div', 'search-config', { hidden: '' });
  config.append(...cfg.config);
  block.replaceChildren(container, config);

  const noResultsHeading = noResults.querySelector('h1, h2, h3');
  const struck = el('s', 'search-query');
  if (noResultsHeading) noResultsHeading.append(document.createElement('br'), struck);

  let activeFilter;
  async function run() {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get('q') || '').trim();
    activeFilter = (params.get('filter') || 'all').toLowerCase();
    input.value = q;
    filters.forEach((b) => b.classList.toggle('active', b.textContent.trim().toLowerCase() === activeFilter
      || (activeFilter === 'all' && filters[0] === b)));
    if (!q) {
      block.classList.remove('has-query');
      popular.hidden = false;
      stats.textContent = '';
      results.replaceChildren();
      noResults.hidden = true;
      sidebar.hidden = true;
      return;
    }
    block.classList.add('has-query');
    popular.hidden = true;
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const rows = await loadIndex(cfg.index || '/query-index.json');
    const hits = rows.filter((r) => {
      const hay = `${r.title || ''} ${r.description || ''} ${r.path}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    }).filter((r) => activeFilter === 'all' || typeOf(r.path).toLowerCase() === activeFilter
      || (activeFilter === 'article' && typeOf(r.path) === 'Article'));
    stats.textContent = statsTpl.replace('{count}', hits.length);
    results.replaceChildren(...hits.map(resultCard));
    struck.textContent = q;
    noResults.hidden = hits.length > 0;
    sidebar.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    window.history.pushState({}, '', url);
    run();
  });
  filters.forEach((b) => b.addEventListener('click', () => {
    const url = new URL(window.location.href);
    const f = b.textContent.trim().toLowerCase();
    if (f === 'all' || b === filters[0]) url.searchParams.delete('filter');
    else url.searchParams.set('filter', f);
    window.history.replaceState({}, '', url);
    run();
  }));
  window.addEventListener('popstate', run);
  run();
}
