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
- [FEATURE_DECOMPOSITION](../../FEATURE_DECOMPOSITION.md) proposes affected components, interactions, behavior choices, and verification seams for design acceptance.
- [SPEC](../../SPEC.md), [PLAN](../../PLAN.md), [layout](../../layout.md), and [TASKS](../../TASKS.md) own the completed baseline. They do not authorize these feature tasks.

The campaign is open at feature design. Scope is authorized; the new behavior refinements are proposed and await acceptance. FEATURE-SPEC, FEATURE-PLAN, and FEATURE-TASKS have not been authored. No product implementation has started. Exact behavioral contracts and their conformance review follow design acceptance; delivery planning and task derivation follow their applicable readiness gates.

The request establishes the objective of implementing this feature set. Before execution, accepted preparation must be explicitly merged, checked, and published to the actual default branch; the implementation branch then starts from that checkpoint. Active FEATURE-TASKS will own feature execution. Complete implementation includes accepted document incorporation, verification, source archival in this package, and explicit integration/publication to main under SDD Manager.

## Retained scope and boundaries

Repository publication authorization remains active; do not request repeated push permission. Existing GitHub tracking belongs to the completed baseline phase. Recommend GitHub tracking for the feature during its implementation handoff; do not project feature objects before scope confirmation and eligible-phase activation.

Keep the completed baseline reports and closed tracking records unchanged. Preserve its gameplay, deterministic engine boundary, desktop support, static delivery, and disclosures except for explicitly accepted feature deltas. Multiplayer, touch controls, audio, persistence, expanded previews, counterclockwise rotation, spin/combo bonuses, and exact conformance to a commercial rule standard are outside this campaign.
