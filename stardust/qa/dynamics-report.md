# Dynamics parity check — https://main--a608424f--aemcoder.aem.live — 2026-11-14T07:10:56.758Z

Replayed 8 checks over 6 features · pass 8 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| site search results (/en/search) | S | done | search-query | PASS | 1 results (source 1) · first: innovative b2b e-commerce platform for spinner · matches the source |  |
| site search results (/en/search) | S | done | search-query | PASS | 1 results (source 1) · first: successful omnichannel transformation for walz · matches the source |  |
| HubSpot contact form (form-block, Forms API v3, portal 3937475) | F | done | dom-count | PASS | 1 × .form-block form input[name="email"] (min 1) |  |
| HubSpot contact form (form-block, Forms API v3, portal 3937475) | F | done | dom-count | PASS | 8 × .form-block form [required] (min 3) |  |
| insights listing cards (static first page + pagination) | CR | done | dom-count | PASS | 21 × .article-list .list-article-card (min 21) |  |
| partner logo marquee (home) | CR | done | dom-count | PASS | 40 × .partners-bar .partners-bar-slide (min 5) |  |
| archetype pages run without uncaught exceptions | A | done | no-page-errors | PASS | none on 8 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (3 gated · 0 cross-site host(s) blocked) |  |

## Features without checks
