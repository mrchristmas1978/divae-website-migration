# Journal — diva-e.com replica (hands-off)

## Extract — 100/100 planned pages captured live, 8 page types (2026-11-13)

- `crawl.mjs --pages <100 plan URLs> --dynamics --concurrency 3`: 100/100 OK, 0 failed, real Chrome headless, consent auto.
  `/` redirects to `/de/` (German home); the other 99 are `/en/`.
- Capture gap: `/en` links 62 first-level targets not in the plan — scope is fixed by the site plan, recorded as scope debt
  (`state.json.site.captureGaps`), not widened.
- Style census 1440+360 (`_computed-styles.json`): navy #081235 / #edf0fb / blue #1b31ff; GT Planar VF (commercial)
  headings, Inter 300 body; 12px radius, pill buttons, 2px inset ring outlines.
- cap-probe: content caps differ by archetype (1040 most, 540 article column) — inconsistency candidates logged by the probe.
- Vision check (subagent, thumb.mjs): 100 rendered; Usercentrics "Privacy Settings" bar visible on most captures; sticky
  header ghosted mid-page on long captures; 3 suspects (baby-walz embed blank band, cypress-playwright wide 2210px capture,
  data-silos whitepaper variant).
- Types: article 41 · case-study 20 · program 16 · listing 9 · form 6 · static 5 · landing 2 · unique 1.
- Ran the linear flow (no first-page-first parallel track): the full prep extract was already the first step.

## Preserve direction — verbatim promotion, deferred-only register, dynamics + martech triaged (2026-11-13)

- Promoted current/PRODUCT.md, DESIGN.md, DESIGN.json verbatim to the root; `stardust/direction.md` in preserve mode.
- Register: 2 deferred entries (single-module 1413px cap on the Edge listing header; German strings on EN pages) —
  effectively a pure replica.
- Dynamics: detect on 8 archetypes + search + newsletter (28 findings) → curated 13 rows; HubSpot forms (portal
  3937475) as a public embed block; search rebuilt over query-index; de/en switch interim.
- Martech (owner asked to keep): spec-martech found Usercentrics + dataLayer; dynamics-plan --martech wrote the
  contract with a gtag route; added the Usercentrics CMP (settings id zwbhh7MR) and GTM-W77TLSS route by hand — all off.
- Publish decision recorded in stardust/eds-conversion-log.md.

## Recreate / source-fidelity-gate — landing archetype `en` gated, shared canon established (2026-11-13)

- 1440: 2.57% px, Δh 0, content-diff 0🔴/0 lost, clipped 0, overflow 0 (3 iter). 360: 2.53%, Δh 0, same (3 iter). cap-probe PASS.
- `--main ".page"`, built-in consent dismissal (Usercentrics) sufficed. Fonts: Inter self-hosted; GT Planar → Liberation Sans (R-03).
- canon.css: tokens, type ramp, grid, buttons, header (mega menu), footer, cards, coverflow, stories rail, partner logos, HubSpot form band.
- Residuals: substitute-font text widths in chrome; units check advisory misses (hover overlay, logos mid-scroll).

## Recreate / source-fidelity-gate — remaining 7 archetypes gated, prototype table written (2026-11-13)

- Archetypes (one subagent each, shared canon untouched, results merged from stardust/replica/results/<type>.json):
  program en-services-crm 0.95%/1.71%; article en-insights-edge-ai-radar-october 0.87%/1.15%;
  case-study en-about-us-customers-mann-hummel 1.20%/2.14%; static en-imprint 0.66%/1.31%;
  form en-contact 0.56%/1.66%; listing en-insights-edge 1.18%/1.65%; unique en-connect 0.69%/1.28% (Δh −1 @360).
  All Δh ≤ 1, content-diff 0🔴/0 lost, clipped 0, cap-probe PASS, approved hands-off.
- Prototype table (gate-all --stage prototype): 8/8 pixel PASS both widths; full 7/8 — landing `en` fails units only
  (marquee phase + teaser wrapper granularity), recorded as residual for the published-origin gate.
- Chrome-parity residuals (substitute heading font) shared across archetypes; header cursor circle + lang-switch `show`
  class observed live and not implemented (shared chrome — foundation work in C0).
- cap-probe needs `--main .page --build-main .page` on this site.

## Migrate plan — 8 archetypes first, 92 siblings in 15 template render clusters (2026-11-13)

- Unit ledger stardust/migrate/progress.json: render-archetypes (8 approved prototypes), then per template the
  sibling clusters (≤ 8 each) — each one rendered only after its template's C-deliver archetype unit is done (#126).
- Root `/` (slug `index`, German home) is a landing sibling of the `en` archetype.

## A-inventory — 100 pages, 8 templates, archetypes pending, 92 siblings content-pending (2026-11-13)

- inventory.mjs (project copy) patched: state rows matched archetypes only on exact path (`/en/` vs `/en`) and
  joined siblings by `type` = archetype slug; now dedups on trailing slash/slug and maps type → archetype via the sidecar.
- rollout.json site: DA aemcoder/a608424f@main, live host main--a608424f--aemcoder.aem.live.

## B-block — 18 distinct blocks, each converts on exactly one page (2026-11-13)

- breadcrumbs×48, hero×45, article blocks×41; plan.json representative-first. Sibling block sets are inherited from the
  archetype until each cluster's variance probe budgets the deltas.

## B2-dynamic — 14 rows verified on the 8 archetypes, martech carried over all-off (2026-11-13)

- Fresh detect: GTM-W77TLSS loads first-party from load.data.diva-e.com (+ GA4 G-LVE0DSYGPD, AW-16967774015); row 10 adds
  snap.licdn.com / ad.doubleclick.net; row 14 new: Swiper tags carousel (rebuild-native). HubSpot forms not rendered in
  the headless probe on /en/contact/ and /en/connect/ (ids present in HTML) — kept as captured.
- Martech: scripts/martech.js scaffolded (Usercentrics zwbhh7MR enabled:false, routes disabled); loadConsent() in
  loadEager, loadTags() in loadDelayed. dynamics-plan --martech drops consent/container rows — re-added by hand.

## C-deliver — 7 archetype units live and gated, landing + program clusters delivered, static waits on foundation (2026-11-13)

- Archetypes done on the preview origin (1440 / 360): article 0.97/1.35, case-study 1.95/2.81, listing 1.18/1.69,
  form 0.56/2.22 (additive `form-block.regular`), unique 1.28/1.82, landing 1.36/2.19 (units residual: marquee timing).
- archetype-static FAILED 11.73/20.04 (Δh −538/−720): simple-text section styles live only as interims in hero/cards
  CSS, which en-imprint does not load — apply the foundation request (simple-text → styles.css) at an idle point, re-gate.
- Coordinator decision: reused blocks may take strictly ADDITIVE variant classes in-unit (form regular, cards
  link-overlay/speakers, hero second image, slider-cards narrow-heading); behaviour changes stay request lines.
- Siblings need a per-page structural clone as `--source`; renders run against a state copy because migrate only takes
  A′ for `directed` pages. cluster-landing: `/` live, partners-bar marquee reset makes content-presence flaky.
- cluster-program 15/15 live; 5 rows fail (slider-cards loop too short, total-experience mixed-media heights) →
  C-final with the queued requests. cluster-article part A 16/16 live, gate pending (stopped at session cap).

## C-deliver — article, case-study, listing, form clusters delivered; static, unique, gate-all, final remain (2026-11-13)

- cluster-form 5/5 live (new blocks page-title, embed, search); en-security-quiz fails (slider-cards loop, simple-text interim not loaded); /query-index.json 404 → owner must configure index; search shows no-results meanwhile.
- cluster-listing 8/8 live (article-list teaser/news/product, related-links, triple-stat-cards, two-cols-image-text); en-about-us-partner fails content only (partners-bar rest phase).
- cluster-case-study 19/19 live, 10 pass; content fails are tags-carousel marquee timing (flaky), best4tires/siemens 360 R-03 wraps; video block built in hero.js until a scripts.js auto-block at C-final. gate-all `--eds-host` needs `https://`.
- cluster-article 40/40 live, 1440 all pass; 360 fails 6 — cypress/agentic regressed by topics `min-width:auto` scoped to ≥1024 (fix at C-final), 4 R-03 wrap drift. qa-sap-ai path needs a redirect at D-site.
- A stuck `pull --rebase --autostash` held the repo mid-rebase 16:33–18:20; quit, stash kept as stash@{0}. Briefs: commit first, never --autostash.
- Next: archetype-static re-gate (simple-text interim must load on static pages — e.g. breadcrumbs.css, or apply the foundation request), cluster-static (4), cluster-unique (0 siblings → done), then C-final with the queued requests, gate-all, final.

## C-deliver — archetype-static re-gated after the simple-text foundation rules moved into styles.css (2026-11-13)

- Applied the archetype-static foundation request at an idle point: the shared simple-text section rules (base, dark/light, headline/body, no-top/no-bottom, lead, lists, button row, bold 400, h3 ramp) now ship in styles/styles.css, plus `:is(p, ul, ol) + h3 { margin-top: 1.2em }`; foundation refrozen. Block-level copies remain (identical declarations) for the C-final dedup.
- gate-all preview en-imprint (state stardust/.work/static/state-gate.json, `--eds-host https://…`): 1440 11.73 % → 4.92 % Δh +108, 360 20.04 % → 7.82 % Δh +96, clip 0, MISSING/HIDDEN 0 — PASS. Unit `archetype-static` done.
- Next: render cluster static (4 siblings) then cluster-static, cluster-unique (0 siblings), gate-all, final.

## C-deliver — static cluster delivered 4/4, unique cluster empty (2026-11-13)

- render static: rendered 4, unchanged 0, refused 0, passthrough 0 (about-us, data-privacy, ai-manifest, management).
- cluster-static 4/4 live; new block slider-contacts (management coverflow). Max 1440 7.74 % / 360 9.41 %. Fails: en-about-us (partners-bar rest phase, landing request), ai-manifest 1440 Δh 218 vs 215 limit (simple-text `medium` measure, request). 3 request lines (partners-bar, Inter italic, simple-text medium/small).
- cluster-unique: en-connect is the only page of its template → done with 0 siblings.
- Next: C-final (apply foundation requests once, re-gate affected archetypes), gate-all roster, final.

## C-deliver — gate-all roster over 100 pages (2026-11-13)

- Roster state built from coverage deployedUrls (stardust/.work/rollout/gate-all/state.json); gate-all --skip-existing at both widths (≈90 + 100 min with 1+2+1 browser concurrency).
- 1440: 85 PASS / 15 FAIL (pixel-only 96). 360: 77 PASS / 23 FAIL (pixel-only 88). update-coverage --gate applied for both.
- Fail classes: marquee phase (partners-bar, tags-carousel) → declared `variable` in gates/all-<w>/presence.json (counts only); partner-logos unit dropped from units.json (time-variant); short slider-cards rails → block fix (repeat to ≥15 slides, 8b9409a); reused stale eds captures (ai-manifest, security-quiz, total-experience) → recapture; 360 R-03 wrap residuals on articles.
- Next: final — fix round over the failing set with --recapture-eds, then C-deliver end.

## C-deliver — final unit: roster re-gated, 100/100 at both widths, C-deliver closed (2026-11-14)

- 1440 roster (`--skip-existing`): 81 PASS, 99 pixel-only; hd-plus recaptured after the cards col-3 fix (10.3 → 5.39 %); 7 more marquee-phase overrides (origin edge-clips links too: counts match ±1) → 100/100 with 19 documented overrides.
- 360 roster (`--skip-existing --recapture-eds`, 2.5 h): 77 PASS, 94 pixel-only; 9 marquee-phase overrides; crm-pharma fix round (cards tagline h3 ramp 2/2.4/3.4rem, simple-text `h3-head` variant = source headline row with an h3) 14.37 → 11.54 % (1440 6.23 → 2.71 %); crm-pharma, events, ifm, vendor-lab-day carry R-03 font-substitution overrides (text % dominant, 10.4–11.5 %, Δh ≤ 0.7 %, 1440 PASS).
- `--only` rows folded into summary.json with `stardust/.work/replica/probes/merge-summary.mjs` (summary.md re-rendered via gate-all's formatSummary); update-coverage --gate both widths: 100 deployed, gate pass 100. Foundation refrozen (14 files).
- Open for later phases: `/en/insights/edge/QA_SAP_AI` is delivered at the lowercased `/en/insights/edge/qa-sap-ai` — the D-site redirects sheet must map it; scorecard comes from F-optimize.

## Migrate — render closed, state and report (2026-11-14)

- All 16 render units done (render-archetypes + 15 sibling clusters run inside C-deliver after each archetype unit). state.json advanced: 100 migrated (migratedPath per page, `state.mjs advance --to migrated`).
- Branches: 8 Path A (approved prototypes), 92 Path A' (template-applied siblings at sibling tier); delivery numbers are the gate-all tables (1440 / 360 100/100 with documented overrides).

## D-site — sitemap verified, redirects sheet live, root answers (2026-11-14)

- `stardust/redirects.tsv` → `/redirects.json` (DA sheet, PUT + preview + live): `/en/insights/edge/QA_SAP_AI[/]` → `/en/insights/edge/qa-sap-ai` (path-safety lowercase), `/de[/]` → `/` (source root 301s to /de/, whose content is the delivered root `index`). All four rows answer 301 on aem.live; `/` 200 on .page and .live.
- Coverage row `en-insights-edge-qa-sap-ai` path set to the delivered `/en/insights/edge/qa-sap-ai` under the coverage lock (`stardust/.work/rollout/probes/coverage-path-fix.mjs`) — an `inventory.mjs` re-run derives the uppercase path again; re-apply after one.
- `assemble.mjs --verify-origin` exit 0: served 100 = assembled 100; /nav, /footer, /nav-de, /footer-de serve `robots: noindex`.

## D2-dynamic — query index live, parity replay 8/8 PASS on aem.live (2026-11-14)

- `/query-index.json` was 404: `helix-query.yaml` committed + pushed (index `site`, chrome docs excluded; title/description/image/lastModified/robots), then the admin index endpoint POSTed for the 100 delivered paths (100 × 200); `total` settled at 100 within the first poll.
- `stardust/dynamics/parity.json` written (5 features + the contract's martech row). Search expectations read from the source `/en/search/` (Algolia over the whole site): `spinner` 2 hits / 1 in scope, `best4tires` 5 / 1 in scope — compared restricted to the run scope (environmentLimit on the row).
- `dynamics-check.mjs --origin https://main--a608424f--aemcoder.aem.live` exit 0: search ×2 match the source, form fields (8 required), listing 21 cards, marquee 40 slides, no page errors on 8 archetypes, martech gate (all parts off, no tag host requested). Report: `stardust/qa/dynamics-report.md`.
- HubSpot filled submission not replayed: it would create a contact in the owner's production portal — owner action named on the parity row.

## E-full-site — 100/100 verified on aem.live (2026-11-14)

- First `verify.mjs --base <aem.live> --all`: 27/73. Causes: (a) 292 root-relative targets outside the fixed 100-page scope (en/de insights, services sub-pages, customers, /de/* locale tree) — repointed to the source origin (`stardust/.work/rollout/probes/out-of-scope-links.mjs --write`, 70 files incl. nav/footer); `/en/home` and `/en/kampagnen/next-gen-crm-pharma` (source 301s into delivered pages) pointed at the delivered pages + 4 redirect rows (sheet now 8 rows, live); `localize-links.mjs` normalized 61 trailing-slash hrefs, `--check` PASS; 74 docs redeployed + published (`ledger-e2-links.json`). (b) `/en/data-privacy` carries the source's broken `/en/mailto:…/` hrefs (404 on the source too) — kept as captured, repointed to the source URL; owner note.
- Second run 66/34: the 25 article `/widgets/read-progress.html` links are widget code references (200, decorated by scripts.js) and the 8 archetypes 404 only because verify's `publicUrl` appends a folder-index slash (their migratedHtml is `…/index.html`, the DA doc is the leaf). Those 34 checked at their coverage path with verify's checks (`probes/verify-paths.mjs`: 200, no about:error, internal links resolve) → `update-coverage.mjs <slug> --status verified`. Coverage: 100 verified, gate pass 100.
- Render check: partner marquee advances unpoked on `/` and `/en`, tags carousel on mann-hummel (`probes/motion-advance.mjs`).

## E2-link-audit — every internal href 200 on aem.live (2026-11-14)

- 88 distinct root-relative hrefs across the 104 content docs (pages + nav/footer/de chrome) GET 200 on aem.live (redirects followed); `localize-links.mjs --check` PASS. Scope-extension repoint recorded as a named decision in `stardust/direction.md`.

## F-optimize — 0 open P1 over 100 pages (2026-11-14)

- `optimize.mjs --all` against aem.live inspected only 92 pages: lib `publicUrl` requests the 8 archetypes (migratedHtml `…/index.html`) with a folder-index slash → 404, skipped. Re-run through a local read-only slash-dropping proxy (`stardust/.work/rollout/probes/slash-proxy.mjs`, 127.0.0.1:8797) → 100 inspected.
- Health 56/100 (seo 68, ai 0, xpage 100; a11y not assessed). Open P1 0 · P2 100 · P3 8; source parity 46 (informational). P2 = `ai-search/jsonld` on every page (the source ships JSON-LD; registry strategy `manual`), P3 title-length.

## G-aem — no autofix applied: drafts declined under replica, JSON-LD manual (2026-11-14)

- `autofix-aem.mjs --project . --dry-run`: 108 candidates — 8 `eds-metadata-title` content drafts (truncated <h1> as <title>) and 100 `eds-jsonld` manual. The drafts would replace the source's verbatim <title> (replica: no content rewriting, no unregistered change) → not applied; the 8 title-length findings stay open P3, mirroring the source. JSON-LD: the source pages ship structured data the migration did not carry; placing it is a head/metadata pipeline task left as an owner follow-up (P2, not gated). No project file changed, nothing to re-deploy; verify + optimize numbers stand (100 verified, 0 P1).

## H-report — summary written (2026-11-14)

- `stardust/rollout/report.md` (pages 100/100 verified, blocks 18/18 — 5 block rows that coverage still read `pending` though live on 26–41 pages each were recorded deployed → verified, gates, quality, owner decisions) + `stardust/learnings.md` (6 entries).

## I-dashboard — dashboard written (2026-11-14)

- `dashboard.mjs` → `stardust/rollout/dashboard/{index.html,data.json}`: 100 pages identified / prototyped / deployed (verified 100 in coverage). Rollout A–I closed.

## Handoff — run complete (2026-11-14)

- Runner done-check `{"complete": true, "gaps": []}`. 100/100 pages live and verified on aem.live, both gate widths 100/100 (documented overrides), rollout A–I closed, 0 open P1. Owner follow-ups in `stardust/rollout/report.md`.
