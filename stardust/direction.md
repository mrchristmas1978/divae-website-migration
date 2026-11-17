---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-13T10:59:00Z
  againstInput: https://www.diva-e.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.diva-e.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-13T10:59:00Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(2 entries, both deferred — effectively a pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Scope: the 100 pages of stardust/.labs/site-plan.json; uncaptured /en targets (62) are scope debt.
Gate breakpoints: 1440, 360 (run.json "desktop,mobile").

## Decision — link targets outside the run scope (E2, 2026-11-14)

The page scope of this run is fixed at the 100 pages of `stardust/.labs/site-plan.json`; every internal link target outside it is SCOPE EXTENSION and is repointed to the source origin (`https://www.diva-e.com/<path>/`), never authored from a live read: 292 distinct targets at repoint time (en insights articles/news/webinars/events/downloads, services and partner sub-pages, further customer stories, the /de/* locale tree beyond the German home), 351 distinct absolute source links now in the content tree. Two legacy targets that the source 301s into delivered pages (`/en/home`, `/en/kampagnen/next-gen-crm-pharma`) point at the delivered pages and carry redirect rows. The source's own broken `/en/mailto:…/` links on /en/data-privacy are kept as captured (repointed to the source URL); fixing them is the owner's call. No captured page was repointed.
