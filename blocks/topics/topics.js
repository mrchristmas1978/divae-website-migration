/**
 * topics — the article body: a sticky "scroll to topics" toggle (≥1024) beside a column of
 * rich-text topics, each an optional <h3> title + body (p / ul / ol / CTA paragraphs).
 * Schema: stardust/eds-schema/en-insights-edge-ai-radar-october.json § topics.
 * Decode tier: reconstructive (authors add/remove topics).
 *
 * Authoring: one row per topic (a row without a heading = an untitled intro topic). A flattened
 * single cell is segmented on the most frequent heading tag. A paragraph holding only a
 * <strong> link (a primary button) is grouped into the topic's button row.
 * Variant `rows`: every row is one topic, titled by its leading heading (no segmentation).
 * The toggle is presentational (no authored text; the source's click is dead — rendered static).
 */

const TOGGLE_SVG = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#081235" d="M0 7v2h2V7H0ZM0 15h2v2H0v-2ZM0 23h2v2H0v-2ZM6 7v2h26V7H6ZM6 15h26v2H6v-2ZM6 23h26v2H6v-2Z"/></svg>';

const hasText = (el) => el.textContent.trim().length > 0;

function div(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

// Authored elements of one row, in order (EW1: existing nodes only).
function rowNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (hasText(cell)) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy them
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

// A CTA paragraph: decorateButtons' wrapper, or a <p> whose whole text is one strong/em link.
function isButtonPara(el) {
  if (el.tagName !== 'P') return false;
  if (el.classList.contains('button-wrapper')) return true;
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1) return false;
  const a = links[0];
  return !!a.closest('strong, em') && el.textContent.trim() === a.textContent.trim()
    && a.textContent.trim().length > 0;
}

function buildTopic(group) {
  const topic = div('topic');
  if (group.heading) {
    const t = div('topic-title');
    t.append(group.heading);
    topic.append(t);
  }
  const body = div('topic-body');
  let buttons = null;
  group.body.forEach((n) => {
    if (isButtonPara(n)) {
      if (!buttons) {
        buttons = div('topic-buttons');
        body.append(buttons);
      }
      buttons.append(n);
    } else {
      buttons = null;
      body.append(n);
    }
  });
  if (group.body.length) topic.append(body);
  return topic;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .topics-content')) return; // EW9
  const rows = [...block.children];
  if (!rows.length) return;

  const perRow = rows.map(rowNodes);
  const all = perRow.flat();
  const tally = {};
  all.filter((n) => /^H[1-6]$/.test(n.tagName)).forEach((h) => {
    tally[h.tagName] = (tally[h.tagName] || 0) + 1;
  });
  const unitTag = Object.keys(tally).sort((a, b) => tally[b] - tally[a])[0];

  const groups = [];
  if (block.classList.contains('rows')) {
    // variant `rows`: one topic per authored row; a leading heading (any level) is its title,
    // later headings stay in the body (sub-headings, mixed h2/h3 topic titles)
    perRow.forEach((nodes) => {
      const [first, ...rest] = nodes;
      if (first && /^H[1-6]$/.test(first.tagName)) groups.push({ heading: first, body: rest });
      else groups.push({ heading: null, body: nodes });
    });
  } else {
    perRow.forEach((nodes) => {
      let g = { heading: null, body: [] };
      groups.push(g);
      nodes.forEach((n) => {
        if (n.tagName === unitTag) {
          if (g.heading || g.body.length) {
            g = { heading: null, body: [] };
            groups.push(g);
          }
          g.heading = n;
        } else {
          g.body.push(n);
        }
      });
    });
  }

  const items = div('topics-items');
  groups.filter((g) => g.heading || g.body.length).forEach((g) => items.append(buildTopic(g)));

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'topics-toggle';
  toggle.setAttribute('aria-label', 'Button Scroll to Topics');
  toggle.innerHTML = TOGGLE_SVG;

  const content = div('topics-content');
  content.append(toggle, items);
  block.replaceChildren(content);
}
