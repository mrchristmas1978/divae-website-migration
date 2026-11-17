<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-13T12:40:11.481Z · input stardust/current/_dynamics.json (8 pages, 25 findings) · target probe https://main--a608424f--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 8/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-px-ads-linkedin-com | A | unknown third-party host px.ads.linkedin.com | 8/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-api-hubapi-com | A | unknown third-party host api.hubapi.com | 8/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 8/8 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | a-cms-app-settings-object-nuxt | A | CMS / app settings object __NUXT__ | 8/8 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 6 | a-unknown-third-party-host-api-storyblok-com | A | unknown third-party host api.storyblok.com | 4/8 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | cr-client-framework-nuxt | CR | client framework nuxt | 8/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 8 | cr-client-rendered-slot-swiper-slide-tags-carousel-slider-fr | CR | client-rendered slot swiper-slide tags-carousel__slider-frame js-frame | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | cr-client-rendered-slot-swiper-slide-swiper-slide-prev-tags- | CR | client-rendered slot swiper-slide swiper-slide-prev tags-carousel__slider-frame | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | cr-client-rendered-slot-swiper-slide-swiper-slide-visible-sw | CR | client-rendered slot swiper-slide swiper-slide-visible swiper-slide-active | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot-swiper-slide-swiper-slide-visible-sw | CR | client-rendered slot swiper-slide swiper-slide-visible swiper-slide-next | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | cr-client-rendered-slot-swiper-slide-swiper-slide-visible-ta | CR | client-rendered slot swiper-slide swiper-slide-visible tags-carousel__slider-frame | 1/8 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | f-form-backend-hubspot-forms | F | form backend: HubSpot forms | 8/8 | rebuild-native | block | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 14 | i18n-locale-variants-de-de-de-de-de | I18N | locale variants de,de,de,de,de | 1/8 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 15 | i18n-locale-variants-in | I18N | locale variants in | 1/8 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 16 | t-consent-usercentrics | T | consent: Usercentrics | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 17 | t-unknown-third-party-host-a-storyblok-com | T | unknown third-party host a.storyblok.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-unknown-third-party-host-js-hsadspixel-net | T | unknown third-party host js.hsadspixel.net | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-marketing-hubspot-tracking | T | marketing: HubSpot tracking | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-track-hubspot-com | T | unknown third-party host track.hubspot.com | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 8/8 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-third-party-mount-div-data-ads-portal-id-tag-manager-injec | T | third-party mount <div data-ads-portal-id> (tag-manager-injected widget) | 8/8 | embed-passthrough | embed | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 25 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 8/8 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 8 row(s) — read-settings, settled-dom-snapshot.
- **One owner decision batch:** 17 row(s) — inspect the XHR, add a vendor row · production backend (vendor form id + field mapping) · scope of the locale trees · CMP domain script reuse on the new host · which tags run on the new host; property ids · vendor account ids stay the owner's.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 8
- **detect** — 6
- **capture** — 6
- **locale wave** — 2
- **embeds** — 2
- **forms** — 1
