# Martech hand-off

Everything below is scaffolded **off**. To ship it, set `enabled: true` on `consent.cmp` and on each route in `stardust/martech-contract.json`, then re-run `deploy/scripts/martech-scaffold.mjs` and `dynamics/scripts/dynamics-check.mjs` to confirm the enabled tags load. Enabled tags load on `www.diva-e.com` only; preview with `?martech=on` (add `&consent=accept` to grant every category).

## Consent

- **CMP:** Usercentrics, `data-settings-id` = `zwbhh7MR`, loader `https://web.cmp.usercentrics.eu/ui/loader.js` (plus the `privacy-proxy.usercentrics.eu` uc-block bundle on the source) — `enabled: false` (added by hand, see Run notes)
- **Model `owner-decision`:** no evidence of consent gating inside the tag manager. Keep the source behaviour (route `category` null), or set a route `category` to a consent group id to load that tag manager only once the group is granted.
- **Categories:** not read — `spec-martech.mjs` parses OneTrust only; Usercentrics categories stay in the Usercentrics admin (settings `zwbhh7MR`) and are not re-implemented on the site.

## Routes

| id | vendor | src | CMP groups listing its host | enabled |
|---|---|---|---|---|
| google-tag-manager | Google Tag Manager | `https://www.googletagmanager.com/gtag/js?id=AW-1056602529` | — | false |
| google-tag-manager-container | Google Tag Manager | `https://load.data.diva-e.com/gtm.js?id=GTM-W77TLSS` | — | false |

Also seen, not routed (loaded by the tag manager or inline on the source — confirm each still fires): consent: Usercentrics · analytics: Google Analytics / Ads · marketing: HubSpot tracking · marketing: ad / retargeting pixel.

## Rewrite before go-live

Nothing found (or no tag-manager library read).

## Data layer

The source pages expose `dataLayer`; keep the same global names.
Rules in Google Tag Manager were not parsed. Read each library listed in `martech/tags.json` and record its rules and data elements in the contract's `tagNotes`, keyed by tag manager, each citing where it was read (`from`); until then their triggers and events come from the tagging plan.
Ask the owner for the tagging plan (solution design reference): each event, its payload and the interaction that pushes it. With it, add each push in the block that owns the interaction.

## Run notes (replica rollout B2, 2026-11-13)

- **Owner decision (made):** keep the source analytics, tags and consent; everything carried over **off**. `scripts/martech.js` is
  scaffolded with the CMP present but `enabled: false` and no route emitted (the scaffold writes only enabled routes); hooks:
  `loadConsent()` first in `loadEager()`, `loadTags()` in `loadDelayed()` of `scripts/scripts.js` (no `scripts/delayed.js`).
  Re-run `stardust/scripts/deploy/martech-scaffold.mjs` after enabling.
- **CMP (added by hand):** the vendor table has no Usercentrics CMP row, so every contract rebuild (`dynamics-plan.mjs --martech`)
  drops `consent.cmp`; re-add it after any rebuild.
- **GTM container (added by hand):** `GTM-W77TLSS` loads on the source through the first-party server-side GTM host
  `load.data.diva-e.com` (custom loader `/7nqndmrluefj.js?bv2jl=<base64 id>`), which also serves gtag `G-LVE0DSYGPD`,
  `AW-1056602529`, `AW-16967774015`. The route uses `load.data.diva-e.com/gtm.js?id=GTM-W77TLSS` (same container, checked);
  the rebuild drops this route too — re-add it. Collector/sGTM host and cookie domain on the new host are owner items.
- HubSpot tracking (portal 3937475), LinkedIn insight, Facebook pixel and DoubleClick load through GTM / HubSpot on the source —
  confirm each still fires once the routes are enabled. Order: enable `consent.cmp` first, then each route.
