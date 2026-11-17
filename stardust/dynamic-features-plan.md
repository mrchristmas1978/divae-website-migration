# Dynamic features — plan (diva-e.com replica)

| phase | rows | work | verify |
|---|---|---|---|
| D1 (with C0 foundation) | 4, 7–10, 12 | header search widget; `scripts/martech.js` scaffolded off (martech-scaffold; written at B2, CMP + routes disabled) | dynamics-check martech: `/` requests no tag/CMP host |
| D2 (with archetypes) | 3, 13, 14 | `hubspot-form` block (portalId, formId rows) | form renders on preview at 1440/360; row 14 already in migrated output |
| D3 (after rollout) | 5 | `/en/search/` results widget over `query-index` | search-query parity vs source count |
| interim | 6 | `de` switch → `/`; uncovered `/de/*` → source origin | link audit |
