# Rollout report — diva-e.com → AEM Edge Delivery (replica, 2026-11-14)

| | |
|---|---|
| Pages | 100 in scope · 100 live on aem.live · 100 verified · 0 failed · 0 pending |
| Templates | 8 (landing, article, case-study, program, listing, static, form, unique) — one gated archetype each |
| Blocks | 18 distinct (476 instances) · 18 deployed + verified · widget `read-progress` |
| Fidelity | published-origin gate 1440: 100/100 (81 clean + 19 documented overrides) · 360: 100/100 (77 clean + 23 documented overrides) |
| Quality | optimize health 56 · open P1 0 · P2 100 (JSON-LD not carried, manual) · P3 8 (source titles > 60 chars, kept verbatim) · 46 source-parity informational |
| Site | sitemap served 100 = assembled 100 · redirects sheet 8 rows live · `/` 200 · chrome docs noindex |
| Dynamics | query-index 100 · parity 8/8 PASS (search ×2 vs source, HubSpot form fields, listing, marquee, no page errors, martech gate) |
| Martech | GTM / gtag / HubSpot / LinkedIn / Facebook / Usercentrics carried in `stardust/martech-contract.json`, every part disabled; `scripts/martech.js` shipped |
| Links | 88/88 internal hrefs 200; 292 targets outside the 100-page scope point to the source site (decision in `stardust/direction.md`) |

## To deliver / owner decisions
- Turn on consent + tag routes in the martech contract (`stardust/martech-handoff.md`).
- JSON-LD: the source pages ship structured data; place it via head/metadata (P2 ×100).
- HubSpot: one filled test submission from /en/contact into the production portal.
- Pages outside the run scope (insights archive, services sub-pages, further customer stories, the /de/* tree) — linked to the source until migrated.
- `/en/data-privacy` carries the source's broken `/en/mailto:…/` links, kept as captured.
