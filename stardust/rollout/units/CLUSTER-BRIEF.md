# C-deliver cluster unit brief (one subagent per template cluster)

Everything in stardust/rollout/units/ARCHETYPE-BRIEF.md applies (project, hosts, token handling, read-first docs,
chain, frozen foundation, request lines, limits). Read it first. This brief adds the sibling-tier steps.
Extra read-first (BY SECTION): /home/node/adobe-skills/plugins/stardust/skills/replica/reference/handoff-contract.md
§ 1 (Migrate — sibling tier, rows 1–9 + Acceptance); /home/node/adobe-skills/plugins/stardust/skills/migrate/reference/
migration-procedure.md § Three render branches; migrate/reference/fidelity-tiers.md § Sibling variance probe.

## Your job: deliver every sibling page of THIS template (the archetype is already live and gated)
Inputs: your slug list (in your spawn message), the archetype's gated prototype
stardust/prototypes/<archetype>-proposed.html (+ .css/.js), its delivered content/<path>.html and its blocks (the
ENCODER you reuse — never re-author or fork a block per page), each sibling's capture
stardust/current/pages/<slug>.{json,html} (the verbatim content source — never a fresh live read).

Per template, then per page:
1. Variance probe once: `sibling-variance.mjs <archetype live url> <sibling live urls…> --probe <block>=<sel> …
   --width 1440` via run-bg. Budget each delta as a block VARIANT class (never a per-page block fork).
2. Structural clone (Path A′) per sibling: fork the archetype prototype's structure into
   stardust/.work/migrate/siblings/<slug>.html with THIS page's content injected verbatim from its capture (headings,
   body, CTAs + hrefs, alt text, order, metadata); adapt only where content does not fit (drop/repeat sections, block
   variants). Then `node stardust/scripts/migrate/migrate.mjs render <slugs…> --archetype <slug>=<archetype>…
   --source <slug>=stardust/.work/migrate/siblings/<slug>.html…` (strict validation must pass), then
   `migrate.mjs modules <slug> <ids…>` and `migrate.mjs gate <slug> content-fidelity --evidence …`.
   Report the driver's final `rendered N, unchanged N, refused N, passthrough N` line for your slugs.
3. Content-count acceptance per page (§ 1 row 4) — any uncovered drop fails the page: fix and re-render.
4. Convert each sibling to content/<path>.html with the archetype's encoder (same blocks, EW node-slotting), then the
   chain: delivery-lint → `npm run lint` → media-reconcile (upload editorial media through da-media-upload.mjs with
   the shared ledger stardust/deploy/media-ledger.json when the archetype did so) → davids-model-lint → sanitise.js
   (one file per call) → qa-gate / block-roundtrip --ew (structural only).
5. Commit + push any block code changes (variants) — only YOUR files, pull --rebase first.
6. Write your DA paths (one per line) to stardust/rollout/units/<cluster>.paths, then via run-bg:
   `deploy-batch.mjs --paths stardust/rollout/units/<cluster>.paths --ledger stardust/deploy/ledger-<cluster>.json
   --log stardust/.work/rollout/<cluster>/deploy.log --concurrency 1 --token-file "$ADOBE_IMS_TOKEN_FILE"`
   (+ the org/repo/branch/content flags the archetype units used). Publish is required (no --no-publish).
7. `.plain.html` check per page, then `gate-all.mjs --only <your slugs comma-joined> --eds-host
   main--a608424f--aemcoder.aem.page` at --width 1440 and --width 360 via run-bg (one at a time). Bar per page: pixel
   ≤ 10 %, |Δh| ≤ 5 %, clipped 0, MISSING+HIDDEN 0. Failing rows: fix block/encoder/content (cap 3 rounds per page),
   re-deploy (`--force` on the batch for changed pages), re-gate; then report the residual.
8. `update-coverage.mjs <slug> --status deployed --url <preview url>` per delivered page.
9. `node stardust/scripts/replica/foundation-freeze.mjs check` must exit 0 at the end.

Never touch pages outside your slug list. Never edit blocks belonging to other templates unless the plan marks
them as reused by you AND the change is an additive variant class that leaves existing pages unchanged — otherwise
a request line. Do not write stardust/state.json (migrate.mjs writes its own keys — that is fine),
stardust/status.jsonl, stardust/journal.md, stardust/rollout/progress.json, stardust/migrate/progress.json.

## Final reply — TWO lines
`render <cluster>: rendered N, unchanged N, refused N, passthrough N`
`<cluster>: pages n/n live, blocks k, gate 1440 x% (max) / 360 y% (max), fails <slugs or none>, requests r`
