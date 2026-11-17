<!-- stardust provenance: skill=stardust:replica (dynamics Phases 1–3, hands-off) · 2026-11-13 · from stardust/dynamics/dynamic-features.generated-plan.md (28 rows, 10 probed pages); B2 re-verified 2026-11-13 against a fresh detect on the 8 archetypes (25 findings) -->
# Dynamic features — diva-e.com (curated)

Hands-off: every row has a disposition; only `self` ships autonomously; owner items ship their interim tier and are
named in the decision batch. Nothing is `decided-out`.

## Listings contract

Edge (`/en/insights/edge/`), News, Events, Downloads, Press and Customers listings are Nuxt/Storyblok client-rendered
card grids on the source. Delivery: document-first — the listing document carries the captured cards as authored rows
(verbatim, settled-DOM capture); a `query-index` top-up is optional later. Filter tabs/pagination render client-side
over the authored rows.

## Features

| # | id | class | feature | disposition | target | reproducibility | status | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | settings-datalayer / nuxt | A, CR | `dataLayer`, `__NUXT__` app state | static-snapshot | content | self | planned | settled DOM is the capture; keep `window.dataLayer` global name (martech) |
| 2 | hs-placeholder slots | CR | HubSpot form placeholders | static-snapshot | content | self | planned | replaced by row 3 |
| 3 | f-form-backend-hubspot-forms | F | HubSpot forms (portal 3937475; forms 0278b95f… ×51 pages, 7be38c84… ×18, 858dcd92… ×3, f867628b… ×3) | embed-passthrough | block `hubspot-form` (authored portalId + formId) | self | planned | public HubSpot embed (`js.hsforms.net/forms/v2.js`); submissions keep going to the owner's HubSpot portal. B2: headless probe (5 s and 15 s settle) rendered no `<form>` on /en/contact/ or /en/connect/ (late / consent-gated mount); form ids 0278b95f… and f867628b… still in their server HTML — row unchanged |
| 4 | f-form-global-search | F | header search box (JS-wired, 1 field) | client-only | widget (header) | self | planned | submits to `/en/search/?q=` · B2: not in the archetype probe set; `/en/search/` 200 and linked from the header on 2026-11-13 — unchanged |
| 5 | s-search-hosted-search-service | S | site search results (`/en/search/`) | index-backed | widget | self | planned | EDS `query-index` search over migrated pages; source result count probe in parity |
| 6 | i18n-locale-variants-de | I18N | de/en language switch | rebuild-native | runtime | needs-business-decision | interim | only `/` (German home) and `/en/*` in scope; the `de` link keeps pointing to `/` ; other `/de/*` targets link to the source origin until migrated (owner decision: German tree) |
| 7 | t-consent-usercentrics | T | Usercentrics CMP | embed-passthrough | martech | needs-business-decision | interim (off) | `stardust/martech-contract.json` consent.cmp, disabled |
| 8 | t-tag-manager-google-tag-manager | T | GTM-W77TLSS + gtag AW-1056602529 | embed-passthrough | martech | needs-business-decision | interim (off) | routes disabled. B2: the container loads through the first-party server-side GTM host `load.data.diva-e.com` (also serves gtag G-LVE0DSYGPD, AW-1056602529, AW-16967774015); contract route src moved to `load.data.diva-e.com/gtm.js?id=GTM-W77TLSS` |
| 9 | t-marketing-hubspot-tracking, hsadspixel, track.hubspot.com, api.hubapi.com | T | HubSpot tracking | embed-passthrough | martech (via tag manager) | needs-business-decision | interim (off) | loaded by tag manager on source |
| 10 | linkedin (px.ads, px4.ads, www, snap.licdn.com), facebook (connect., www.), ad.doubleclick.net, google.com | T | ad / retargeting pixels | embed-passthrough | martech (via tag manager) | needs-business-decision | interim (off) | |
| 11 | storyblok (api., a.) | A, T | Storyblok CMS API / assets | static-snapshot | content | self | planned | source CMS; content captured; images rehosted on EDS media bus |
| 12 | third-party mounts (data-ads-portal-id, data-v-…) | T | tag-manager-injected widgets | embed-passthrough | martech | needs-credential | interim (off) | arrive with the tag manager when enabled |
| 13 | v-iframe-without-src | V | runtime-injected iframe (HubSpot / CMP) | embed-passthrough | embed | self | planned | produced by rows 3 / 7 |
| 14 | cr-client-rendered-slot swiper tags-carousel | CR | customer-story tags carousel (Swiper; 1/8 — /en/about-us/customers/mann-hummel/) | rebuild-native | block (`tags-carousel` in migrated output) | self | delivered | new at B2; settled-DOM slides already captured in stardust/migrated (alreadyDelivered) — no extra work |

B2 noise dropped: `i18n-locale-variants-in` (a linkedin.com/in/ profile link, not a locale). Unknown-host rows (www.google.com, api.hubapi.com, js.hsadspixel.net, track.hubspot.com, www.facebook.com) fold into rows 9–10.

## Decision batch (owner)

1. Turn on Usercentrics (settings id `zwbhh7MR`) and the GTM container (sGTM host `load.data.diva-e.com`) / gtag routes in `stardust/martech-contract.json` (all off; owner chose to keep the source stack, carried over disabled).
2. German tree: migrate `/de/*` later or keep linking to the source.
3. HubSpot forms keep submitting to portal 3937475 — confirm the portal is the production one.

## Register

No dynamic feature changes the design; none enters the inconsistency register.
