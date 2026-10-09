# Modern-feature campaign

## Identity and scope

Campaign: `001_2606a72-modern-features` (feature workflow).

Baseline: `2606a7213d4ddcf18497fafabb6cc5c349a26178`, the published, completed classic browser baseline on `main`. The user opened this campaign on 2026-10-09 to implement the five deferred capabilities: hold, ghost piece, seven-bag randomization, wall kicks, and hard drop. The full-gravity-interval grounded lock rule is an established constraint.

Preparation branch: `design-docs/001_2606a72-modern-features`.
Preparation and final integration target: `main` on the existing `origin` remote.
Implementation branch: `feature/001_2606a72-modern-features`, created from the published preparation checkpoint.

## Current sources and readiness

- [PROJECT](../../PROJECT.md) identifies the feature scope and retained constraints.
- [ARCHITECTURE](../../ARCHITECTURE.md) remains sufficient: engine rules, browser controller, and presentation keep their dependency direction.
- [FEATURE_DECOMPOSITION](../../FEATURE_DECOMPOSITION.md) records the accepted affected components, interactions, behavior choices, and verification seams.
- [FEATURE-SPEC](../../FEATURE-SPEC.md) defines the exact behavior delta; its [review](../../FEATURE-SPEC-REVIEW-REPORT.md) assesses design conformance and readiness.
- [FEATURE-PLAN](../../FEATURE-PLAN.md), [feature layout](../../layout/modern-features.md), and [plan review](../../FEATURE-PLAN-REVIEW-REPORT.md) define the accepted delivery strategy and ownership.
- [FEATURE-TASKS](../../FEATURE-TASKS.md) is the feature's sole executable task owner; its [review](../../FEATURE-TASKS-REVIEW-REPORT.md) assesses conformance to the accepted strategy.
- [SPEC](../../SPEC.md), [PLAN](../../PLAN.md), [layout](../../layout.md), and [TASKS](../../TASKS.md) own the completed baseline. They do not authorize these feature tasks.

The user accepted the feature design at a4185c2f586388171c4ef12314fb26e6a83ce8aa, FEATURE-SPEC at 2999f0fbaaa46813c97e2fed035dfab3b1b279fc, and FEATURE-PLAN/layout at 9d77973073110aaf07ed899685bbd931e8ed6657 on 2026-10-09. FEATURE-TASKS and its conformance review are accepted. TASKS at a29696df319f3763fd547cb082ff3a7bf36b99b2 and full Phase 2 inline execution with GitHub tracking are accepted on 2026-10-09. Preparation was merged/published on main as 71f6275a7b77ed02e9e9f1e6f23762770866f1c5. The feature branch starts there; Phase 2 label, five milestones and 19 task associations are verified. T-023–T-038 are complete, including current-stable feature acceptance. T-039–T-041 finalize reproducibility, review, incorporation and publication; follow the live owner for current progress.

The request establishes the objective of implementing this feature set. Before execution, accepted preparation must be explicitly merged, checked, and published to the actual default branch; the implementation branch then starts from that checkpoint. Active FEATURE-TASKS will own feature execution. Complete implementation includes accepted document incorporation, verification, source archival in this package, and explicit integration/publication to main under SDD Manager.

## Retained scope and boundaries

Repository publication authorization remains active; do not request repeated push permission. Existing GitHub tracking belongs to the completed baseline phase. GitHub tracking is confirmed for Phase 2; project its objects only after preparation integration and eligible-phase activation.

Keep the completed baseline reports and closed tracking records unchanged. Preserve its gameplay, deterministic engine boundary, desktop support, static delivery, and disclosures except for explicitly accepted feature deltas. Multiplayer, touch controls, audio, persistence, expanded previews, counterclockwise rotation, spin/combo bonuses, and exact conformance to a commercial rule standard are outside this campaign.
