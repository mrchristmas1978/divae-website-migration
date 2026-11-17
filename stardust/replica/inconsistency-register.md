# Inconsistency register — diva-e.com replica

Hands-off policy: adopt no improvement. Everything not listed here is frozen; any design delta found by the gate
is a defect, not an improvement. The entries below are `deferred` (handover list only — nothing changes in this run).

## R-01 — Single-section width cap on the Edge listing header

- **Evidence:** cap-probe (`DESIGN.json extensions.breakpoints.capRegister`): module cap 1413px on
  `#artikel .article-list__header` at https://www.diva-e.com/en/insights/edge/ while other modules cap at 1040px.
- **Finding:** one module caps at a width no other module uses.
- **Minimal change:** none in this run (replicated as captured).
- **Status:** deferred
- **Where:** listing (Edge overview)

## R-02 — Mixed-language labels on English pages

- **Evidence:** captured strings "Jetzt Kontakt aufnehmen" (en-about-us-locations h2), "Presse" (en-insights-press h1),
  "Ausgangslage und Ziel" (en-about-us-customers-sma h6).
- **Finding:** German strings on the English tree.
- **Minimal change:** none — content is verbatim; owner to translate after go-live.
- **Status:** deferred
- **Where:** static, listing, case-study

## R-03 — Licensed heading face not rehosted (GT Planar VF)

- **Evidence:** census `type.headingFamily` = "GT Planar VF" (Grilli Type, commercial); measured substitutes on the
  landing archetype: Inter +2.3% wider (+31px on one story title), Liberation Sans height-identical.
- **Finding:** the brand heading face cannot be served from the new domain without a licence.
- **Minimal change:** font stack `"GT Planar VF", "Liberation Sans", Arimo, Helvetica, Arial, sans-serif`; a licensed
  GT Planar drop-in wins automatically. The GT-only backward slant on the mobile hero title renders upright.
- **Status:** applied
- **Where:** all page types, every heading

## R-04 — Source article pages overflow horizontally at 360 (not replicated)

- **Evidence:** `measure.mjs` live vs preview @360 (2026-11-13): cypress-playwright-selenium live scrollWidth 1519
  (+1159 px over the 360 viewport), scrollHeight 6352 vs served 360 / 7756; agentic-ai-unternehmen-ki-agenten live
  scrollWidth 824 (+464 px), scrollHeight 16297 vs served 360 / 18585. A long `&nbsp;`-joined run widens the topic
  column (flex item at its automatic minimum size), so every line runs longer and the page is shorter.
- **Finding:** the source page is wider than the phone viewport; replicating it would fail the horizontal-overflow
  assert every replica page must pass.
- **Minimal change:** the topic column keeps the viewport width below 1024 px (`blocks/topics/topics.css`, `rows`
  auto min-width only >= 1024); the text wraps inside the viewport.
- **Status:** applied — the two pages carry an `overrides.json` row at 360 (`source-overflow`, R-04); the measured
  number stays beside it.
- **Where:** article template, 360 only (two pages).
