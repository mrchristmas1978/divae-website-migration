# EDS conversion log — diva-e.com replica

## Publish decision (2026-11-13)

Decision: **publish** (made by the run owner before the run; hands-off). Every delivered page, the redirects sheet and
the chrome documents (nav, footer and their locale variants) go live on the aem.live origin
(`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`).

## C0 foundation (2026-11-13)

- Foundation = canon.css § 1-7 lifted into `styles/styles.css` (tokens, 62.5% rem root, type ramp, grid,
  buttons) + `blocks/header` / `blocks/footer` (canon § 6 / § 7, scoped under the block root). Decode tier
  of both chrome blocks: template-slotted (canon DOM built in `decorate()`, authored nodes moved in).
- Class names: stylelint's kebab-case pattern renames prototype BEM classes (`a__b--c` → `a-b-c`;
  `*__container` → `*-bar` / `*-inner`, never an EDS `-container`/`-wrapper` suffix). Map recorded in
  `stardust/runtime-contract.json` (`foundation.classNaming`).
- Fonts: Inter (OFL) self-hosted as `fonts/inter.woff2` with the source's own overrides; `inter-fallback`
  (size-adjust 105.56 % from a width probe). GT Planar VF is licensed and NOT hosted — kept first in
  `--font-display`; every visitor without a licence renders the Liberation Sans / Arimo / Helvetica /
  Arial substitute (the gated canon behaviour, R-03).
- Deviation from deploy Step 3 (#36): `img` keeps the source's inline display (`max-width:100%; height:auto`,
  no `display:block`) — the descender gap under inline media is part of the gated geometry.
- Chrome is an overlay (fixed header): `--nav-height: 0`.
- Motion implemented from stardust/replica/motion evidence: mobile language links `show` only at scroll 0;
  header `is-submenu-open` dim while a mega menu is hovered; site-wide cursor circle (`.cursor-circle`,
  `cursor-blur` over links/buttons, `cursor-hide` over embeds).
- Chrome documents: `/nav`, `/footer` (en) and `/nav-de`, `/footer-de` (German root page; its page
  metadata must carry `nav: /nav-de` and `footer: /footer-de`), each with `Robots | noindex`; nav card
  images in DA media scope `chrome`.

## C-archetype case-study — en-about-us-customers-mann-hummel (2026-11-13)

- Blocks authored (general, variants as block classes): `hero` (default cover / `small` perspective
  card / `dark-blue` marker; `no-media` added by JS = navy plate), `breadcrumbs` (light default /
  `dark`), `mixed-media` (left default / `right` / `article`), `single-quote` (light / `dark`),
  `tags-carousel`. Decode tier: template-slotted for all five (fixed compositions; tags-carousel
  keeps the authored `<ul>` as the marquee track). Schema: stardust/eds-schema/en-about-us-customers-mann-hummel.json.
- D1 advisories (hero, breadcrumbs, single-quote, tags-carousel hold prose only) — justified: each is a
  bespoke source component with its own band/geometry/motion, not default content.
- SimpleText = default content in sections styled `simple-text, dark, headline|body` / `simple-text, light`
  (the dark band split in two sections so the no-heading display line needs no positional selector, EW10);
  its CSS is a foundation request, interim copy at the bottom of blocks/hero/hero.css.
- mixed-media: ONE authored image; below 768px the info column is `display: contents` and CSS order puts
  the image between title and text (the source renders a duplicate image there) — roundtrip IMG COUNT 🟡
  2 → 1 is intentional.
- tags-carousel: authored 5 tags; JS appends two loop copies (EW4 clones, aria-hidden) = the source's 15
  Swiper slides; autoplay RTL 4000 ms linear, loop period = authored count (captureState restoreAtDelivery).
  Rest position re-measured on the live page at delivery: translate 0 (first tag at the right edge), first
  transition ~2 s after navigation, ~96 px/s — the prototype's "two slides in" was a mid-run capture.
- Internal links root-relative extensionless; tags whose targets are outside the capture
  (/en/services/dxp/cdp/, /en/services/ams/cloud-consulting/) point at the source origin.
- Harness qa-gate: 6 broken images = the nav document's card images (chrome, dev-server proxy), cap 1241 at
  2560 = the live cap recorded by the prototype cap-probe.

## C-archetype program — en-services-crm → /en/services/crm (2026-11-13)

- Blocks converted (general, variants as block classes): `image-caption` (template-slotted), `cards`
  (reconstructive; `light`/`dark`, `col-3`, `icon`, `tagline-left`; card titles authored as `<p>` like
  the source's div titles — an `<h3>` title is a ROLE SWAP against the prototype), `button-group`
  (template-slotted; `dark-blue`, `left`/`right`), `teaser-slider` (reconstructive; Swiper loop
  restored: >= 950 px the set repeats to >= 16 slides with the middle one active, authored items in the
  active copy, clones stripped of editor indices; < 950 px the unique set, first active), `form-block`
  (template-slotted key-value: Heading / Portal / Form / Legal / Consent (required) / Consent / Note;
  HubSpot contact form rendered natively, submitted to the Forms API v3 of portal 3937475 — dynamic
  features row 3; key cells and config values kept in a hidden holder).
- Reused (case-study unit): `hero dark-blue` (no image = navy plate), `breadcrumbs`.
- simple-text bands: default content + section metadata `simple-text` / `simple-text, dark`; base
  rules INTERIM in blocks/hero/hero.css, the `<h2>` ramp + single-section dark padding INTERIM in
  blocks/cards/cards.css (foundation request appended).
- davids-model 🟡 D1 (hero, breadcrumbs, image-caption, button-group: one-row bespoke components) and
  D3 (teaser-slider: 1-cell head row + 2-cell item rows) accepted; roundtrip --ew 0 🔴, editable 28/28.
- localize-links --check fails on /nav.html only (1 normalisable href, C0 chrome document, not touched).
- Gate (preview origin, gate-all --only en-services-crm): 1440 PASS 0.98 % Δh 0 clip 0 MISSING/HIDDEN 0;
  360 PASS 2.12 % Δh -1 clip 0 MISSING/HIDDEN 0. Computed-style guard ok (cards grid, flex rows, image
  1089 px wide), qa-gate PASS on the preview URL, ai-readability code 100 % with form-block as the app
  block (`--exclude-blocks client-app,widget,form-block`; 44 code-owned field-label words), strict 81 %
  (header mega menu 118 words, footer 27 — chrome).
- Chrome crop (live vs preview): header 2.18 % (1440) / 3.10 % (360), footer 1.68 % / 2.54 % — glyph
  edges of the GT Planar -> Liberation Sans substitute (R-03) and the live Usercentrics widget; the
  frozen foundation's residual, no block fix.
- gate-all reads state.json `status: deployed`; run with a scratch copy
  (stardust/.work/rollout/program/state.json) since units may not write state.json, and `--eds-host`
  needs the scheme (`https://…`).

## C-archetype listing — en-insights-edge → /en/insights/edge (2026-11-13)

- Block converted: `article-list` (reconstructive; rows classified by content: head row `<h1>` +
  `<ul>` filter labels, one row per card — image, `<ul>` categories, date `<p>`, title `<p><a>`
  (cta role, as the source's div > a), teaser, avatar, name — and a pages row `<ul>` of page labels).
  Filter pills = the authored `<li>`s (`btn btn-filter`, role=button, aria-pressed); page labels get
  an empty overlay `<button>` (EW7). "Filter by" / "View more" / "next →" / "← previous" and the
  `|` separators are code-owned UI chrome (`@ew-exempt`).
- Reused: `mixed-media right article` (case-study unit). Interim overrides of its article variant in
  article-list.css (media 6/12 >= 950; R-03 title cap 260px < 768) + the PageEdge `main` offset —
  both filed in foundation-requests.md.
- captureState restored: static first page of 21 cards + pagination 1 2 3 - 11 (pills toggle
  active/aria-pressed only; pages inert — dynamic query surface for the dynamics phase); mobile
  filter sheet closed by default < 768, opened by "Filter by". motion.implemented: pill toggle +
  sheet open/close, hover-button "View more" disc following the pointer — probed on the preview URL.
- Decision: the source has no `<h1>`; delivery-lint P0 + the `.plain.html` contract need one, so the
  list headline "All articles" is authored `<h1>` (same face/size as the source h2.h3 — no pixel
  change). The one link whose target is already in content (`/en/insights/edge/ai-radar-october/`)
  lost its trailing slash (P1 404); every other card href stays root-relative as captured (E2).
- delivery-lint 0 P0 / 0 P1 (21 P2 trailing slashes), davids-model 0/0, media 27 hosted
  (`media/listing/`), roundtrip --ew 0 🔴, editable 112/112. qa-gate on preview: one FAIL = content
  cap 1411px at 2560 vs DESIGN.json 1040 — source-faithful (live filter row 1413px, every box Δ 0
  at 2560). ai-readability code 100 %.
- Gate (preview origin, gate-all --only en-insights-edge): 1440 PASS 1.18 % Δh 0 clip 0
  MISSING/HIDDEN 0; 360 PASS 1.69 % Δh 0 clip 0 MISSING/HIDDEN 0 (round 1: 24.47 % / 27.65 % from the
  mixed-media article geometry; fixed by the overrides). Chrome crop: header 2.20 % (1440) /
  2.54 % (360), footer 1.34 % / 1.72 %; chrome-parity 24 deltas at both widths — the frozen
  foundation's R-03 residual, same as the case-study and program units.

## C-archetype form — en-contact → /en/contact (2026-11-13)

- Blocks converted: none (plan.json convert []). Reused: `hero` (no image = navy plate, template-slotted),
  `breadcrumbs` (light default), `form-block regular` (key-value: Portal / Form / Legal / Consent
  (required) / Consent / Note; no Heading row — the source contact form has none).
- captureState restoreAtDelivery (HubSpot form, portal 3937475, form 0278b95f…): delivered by the
  reused form-block — native HubSpot field set submitted to the Forms API v3 of the owner's portal
  (dynamic-features row 3). motion.implemented (radio/submit hover slnt) ships in form-block CSS.
- Gap: form-block has no `regular` (blue card, white form) CSS; the page renders the default light card
  on navy. Not my block → request line in foundation-requests.md; no override shipped (no own block).
- No simple-text dependency on this page.
- davids-model 🟡 D1 hero/breadcrumbs (one-row bespoke components) accepted; delivery-lint clean;
  roundtrip --ew 0 🔴, editable 12/12. Harness qa-gate: 6 broken images = nav card images (chrome,
  dev-server proxy); "units form-block → breadcrumbs" = schema pairing artefact; wide-2560 warns = full
  bleed bands. ai-readability code 100 % (form-block excluded as app block), strict 88 %.
- Gate (preview, gate-all --only en-contact): 1440 FAIL 45.03 % Δh 0 clip 0 MISSING/HIDDEN 0;
  360 FAIL 52.53 % Δh -1 clip 0 MISSING/HIDDEN 0 — hot bands only over the form card (paint, the
  missing `regular` variant); hero/breadcrumbs/footer bands ≤ 1 %.
- Chrome crop (live vs preview): header 2.74 % (1440) / 3.24 % (360), footer 1.48 % / 2.95 % — the
  R-03 font-substitution residual already filed (case-study line).
- Coordinator decision: `regular` variant added to blocks/form-block/form-block.css as an ADDITIVE
  block (`.form-block.regular …` only; selectors raised to the base rules' specificity so stylelint's
  no-descending-specificity holds; no JS change; the program pages' default rendering unchanged). Page
  re-deployed (--force). Re-gate (preview): 1440 PASS 0.56 % Δh 0 clip 0 MISSING/HIDDEN 0; 360 PASS
  2.22 % Δh -1 clip 0 MISSING/HIDDEN 0 — 1 fix round. Request line marked resolved.

## C-archetype landing — en → /en (2026-11-13)

- Blocks converted: `slider-cards` (reconstructive; head <h2> + one row per story [image] [date <p>, title
  link <p>]; card-as-link EW6 — title anchor unwrapped, href on the overlay + hover links; Swiper loop
  restored: last story first, slide 2 active, track shifted one card; the loop's second copy is appended
  on the first prev/next click only — at rest it is never in view and cloned text cost 3 % ai-readability;
  "View More" hover cursor painted by CSS ::before, code-owned), `partners-bar` (template-slotted head
  "We ♥ our partners" — two authored <h2>, decorative heart SVG — + reconstructive logo rows: one block
  row per marquee, each logo `<p><a href><img></a></p>` (linked images survive the DA pipeline as
  `<a><picture>`); CTA `<em>` link = outline button at btn-md size). Schema stardust/eds-schema/en.json.
- captureState "partner marquees" implemented: Swiper autoplay 4000 ms/slide linear, loop (set repeated
  to >= 16 slides: 6 x 3, 11 x 2), right → left. Rest position re-measured on the live page at delivery
  (probes/marquee-live.mjs): translate 0 until ~2 s after navigation, then one pitch (slide + gap,
  235 px at 1440) per 4 s — the prototype's "two slides in" was a mid-run capture (same finding as
  tags-carousel). motion.implemented: card/story hovers, story cursor, coverflow (teaser-slider, reused),
  marquee; breakpoint DOM of the coverflow is the teaser-slider block's.
- Reused: hero (default full-bleed; ONE image — the source's mobile art-direction crop
  mobile2-modified-1696 <= 768 px is not expressible in the hero block: 360 hero band 16.6 %, header
  crop 33.6 % over it), cards (`cards` light + `cards dark icon`), teaser-slider (9 projects, x2 = 18),
  form-block (portal 3937475, form 0278b95f… as captured on /en/).
- Default content: Text band `Style: text, dark`; SimpleText `simple-text, light`; block bands
  `band-bottom` (light cards) / `band, dark` (cert cards) — interim CSS in slider-cards.css, foundation
  request appended.
- Reuse gaps in the `cards` block (program unit's; not edited, reported): (1) a card whose only link is
  an overlay with no visible CTA (cert cards "Go to ISO 27001/TISAX" → /en/about-us#certificate) cannot
  be authored — links omitted, gate content MISSING 2 at both widths; (2) the dark non-col-3 grid keeps
  row-gap 24 px between tagline and cards (source 0) — Δh -24 at 1440.
- Lint: delivery-lint P1 one-cta-per-p on the hero description is a false positive (5 inline industry
  links + a <strong> sentence with no link — never buttonized); davids-model 🟡 D3 (cards, teaser-slider,
  slider-cards 1-cell head row + 2-cell item rows), D4 (2 pure-vector SVG logos, verified). roundtrip --ew
  0 🔴 (hero 2/2, cards 12/12 + 3/3, teaser 27/27, slider-cards 21/21, partners-bar 3/3, form 14/14).
  qa-gate unit asserts map schema sections to blocks by order and are shifted by the two default-content
  sections (instrument artefact; slider 20 → 10 at rest by design, partners 18/22, teaser 18, cards 4/2).
- Gate (preview, gate-all --only en): 1440 pixel 3.10 % Δh -25 clip 0, content MISSING 2 (cert links) /
  HIDDEN 1 (marquee phase), units off 2 / hidden 3 / missing 3 (teaser wrapper granularity #87, cert
  links, marquee phase, story 1 date at the clip edge); 360 pixel 2.67 % Δh -1 clip 0, MISSING 2 /
  HIDDEN 0, units vs the 1440-cached origin inventory (not actionable). ai-readability code 100 %
  (strict 90 %, chrome 118 words). Chrome crop: header 2.21 % (1440, R-03 glyphs) / 33.61 % (360, hero
  image under the overlay header), footer 1.34 % / 1.74 %. units.json: served-side selectors added for
  service-cards, cert-cards, partner-logos (prototype selectors kept first).

## archetype-unique — en-connect (/en/connect)

- Converts nothing (plan.json): reuses hero, breadcrumbs, cards, mixed-media, partners-bar, form-block.
  Tiers as their owners: hero / breadcrumbs / mixed-media / form-block template-slotted; cards and
  partners-bar logo rows reconstructive. simple-text sections = default content + `Style: simple-text,
  light|dark` (interim styles load via hero.css + cards.css, both on this page).
- Additive only: `.cards.speakers` (speaker cards: copy left, name centred, 24px before copy, 300 copy,
  `bolder` strong) in blocks/cards/cards.css; form-block FIELDS entry for HubSpot form f867628b…
  (Connect registration, portal 3937475, kept as captured per dynamic-features row 3).
- The delivery pipeline strips a leading `<br>` in `<p>`: the source's blank-line spacing is authored as a
  mid-paragraph `<br><br>` (hero, speaker cards, mixed-media); after the list a `&nbsp;<br>` (delivered
  as `<p><br>…`). Without it: 1440 pixel 16.62 % Δh -321 → with it 1.28 % Δh 9.
- captureState sponsor marquee: partners-bar block marquee (1 ms delay, 4000 ms linear, RTL loop); one
  authored row, bottom row absent (live has it empty).
- Gates (preview): 1440 1.28 % Δh 9 clip 0 MISSING 0 HIDDEN 0; 360 1.82 % Δh -3 clip 0 MISSING 0 HIDDEN 0.
  Chrome crop header 2.18 % / footer 1.34 % (1440), header 4.01 % / footer 2.79 % (360); chrome-parity
  24 deltas per width — canon font substitution R-03, foundation (same as the other archetypes).
- Coordinator round (additive reuse-block changes, existing selectors/defaults untouched): `cards`
  variant `link-overlay` (a card whose only text is a linked title becomes card-as-link — anchor
  unwrapped, overlay `Go to <title>`) + `flush` (row-gap 0 under the tagline); `hero` optional second
  authored image = mobile art direction <= 768px (`has-mobile-media`, desktop/mobile wrappers only in
  that branch; single-image heroes decorate as before). /en: cert cards `cards dark icon link-overlay
  flush` with links → /en/about-us#certificate; hero carries mobile2-modified-1696 (media/landing).
  Gate (preview): 1440 pixel 1.36 % Δh -1 clip 0 MISSING 0 / HIDDEN 0, units off 2 / hidden 3 / missing
  1 (teaser wrapper #87, marquee phase, story-1 date at clip edge); 360 pixel 2.19 % Δh -1 clip 0
  MISSING 0 / HIDDEN 0 (units vs the 1440-cached origin inventory). Chrome crop header 2.21 % / 2.73 %
  (R-03 glyphs), footer 1.34 % / 1.74 %.
