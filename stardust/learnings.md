# Learnings — diva-e replica run (2026-11-14)

- `rollout/lib.mjs publicUrl` appends a folder-index slash when a page's `migratedHtml` is `…/index.html`; this run's 8 archetypes were rendered that way while their DA documents are leaves, so `verify.mjs` and `optimize.mjs --base` request `/x/` and get 404. Verified at the coverage path instead and ran optimize through a slash-dropping local proxy. Fix upstream: derive the public URL from the deployed URL when present.
- `inventory.mjs` keeps the captured path case (`/en/insights/edge/QA_SAP_AI`) while deploy lowercases it; the served-sitemap verify caught it. Re-apply the coverage path after any inventory re-run.
- `verify.mjs` counts `/widgets/<name>.html` code references as broken internal links (26 pages).
- A fixed page scope makes most internal link targets scope extension (292 here): repoint them to the source before verify, not after.
- Site search parity against a whole-site Algolia index is only meaningful restricted to the run's page scope; pick terms whose in-scope hit set is small and exact.
- `autofix-aem` title drafts conflict with replica's verbatim-content rule; under replica only deterministic fixers apply.
