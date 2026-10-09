# Modern-feature campaign

## Identity and scope

Campaign: `001_2606a72-modern-features` (feature workflow).

Baseline: `2606a7213d4ddcf18497fafabb6cc5c349a26178`, the published, completed classic browser baseline on `main`. The user opened this campaign on 2026-10-09 to implement the five deferred capabilities: hold, ghost piece, seven-bag randomization, wall kicks, and hard drop. The full-gravity-interval grounded lock rule is an established constraint.

Preparation branch: `design-docs/001_2606a72-modern-features`.
Preparation and final integration target: `main` on the existing `origin` remote.
Intended implementation branch: `feature/001_2606a72-modern-features`; not created yet.

## Current sources and readiness

- [PROJECT](../../PROJECT.md) identifies the feature scope and retained constraints.
- [ARCHITECTURE](../../ARCHITECTURE.md) remains sufficient: engine rules, browser controller, and presentation keep their dependency direction.
- [FEATURE_DECOMPOSITION](../../FEATURE_DECOMPOSITION.md) records the accepted affected components, interactions, behavior choices, and verification seams.
- [FEATURE-SPEC](../../FEATURE-SPEC.md) defines the exact behavior delta; its [review](../../FEATURE-SPEC-REVIEW-REPORT.md) assesses design conformance and readiness.
- [SPEC](../../SPEC.md), [PLAN](../../PLAN.md), [layout](../../layout.md), and [TASKS](../../TASKS.md) own the completed baseline. They do not authorize these feature tasks.

The user accepted the feature design at a4185c2f586388171c4ef12314fb26e6a83ce8aa on 2026-10-09. FEATURE-SPEC and its conformance review are prepared; specification acceptance is pending. FEATURE-PLAN and FEATURE-TASKS have not been authored. No product implementation has started. Delivery planning and task derivation follow their applicable readiness gates.

The request establishes the objective of implementing this feature set. Before execution, accepted preparation must be explicitly merged, checked, and published to the actual default branch; the implementation branch then starts from that checkpoint. Active FEATURE-TASKS will own feature execution. Complete implementation includes accepted document incorporation, verification, source archival in this package, and explicit integration/publication to main under SDD Manager.

## Retained scope and boundaries

Repository publication authorization remains active; do not request repeated push permission. Existing GitHub tracking belongs to the completed baseline phase. Recommend GitHub tracking for the feature during its implementation handoff; do not project feature objects before scope confirmation and eligible-phase activation.

Keep the completed baseline reports and closed tracking records unchanged. Preserve its gameplay, deterministic engine boundary, desktop support, static delivery, and disclosures except for explicitly accepted feature deltas. Multiplayer, touch controls, audio, persistence, expanded previews, counterclockwise rotation, spin/combo bonuses, and exact conformance to a commercial rule standard are outside this campaign.
