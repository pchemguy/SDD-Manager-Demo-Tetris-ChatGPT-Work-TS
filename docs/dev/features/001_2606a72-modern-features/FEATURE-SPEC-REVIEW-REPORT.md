# Modern-feature specification review

> Historical snapshot archived by T-041 on 2026-10-09. Current authority is [main TASKS](../../TASKS.md), [SPEC](../../SPEC.md), [PLAN](../../PLAN.md) and [layout](../../layout.md). Archived checkboxes are not executable owners or current completion claims.

## Current gate

State: **Ready for dependent feature planning**. Design conformance and specification QC pass; no confirmed issue remains. The user accepted the complete specification at `2999f0fbaaa46813c97e2fed035dfab3b1b279fc` on 2026-10-09. Revision 1 records the current acceptance reconciliation. This report establishes neither implementation nor product/browser verification.

Scope: [FEATURE-SPEC](FEATURE-SPEC.md), F1–F8 and FA1–FA10; no focused children. Campaign: [001_2606a72-modern-features](README.md). Preparation checkpoint: `a4185c2f586388171c4ef12314fb26e6a83ce8aa`; baseline: `2606a7213d4ddcf18497fafabb6cc5c349a26178`. The user accepted the design at the preparation checkpoint on 2026-10-09. Pending FEATURE_DECOMPOSITION changes reconcile acceptance, remove unselected alternatives, and link the specification; its accepted capability/component policies are unchanged.

Exact reviewed and governing pending contents (SHA-256):

| Source | Content identity |
| --- | --- |
| `docs/dev/FEATURE-SPEC.md` | `54a1a1ac6c91a5cf41b16fc9839563e0342234f9d1fd107886e62c12ee2d735c` |
| `docs/dev/FEATURE_DECOMPOSITION.md` | `adf882732ae0b53bc9e4a282d7fc59bea6b2acbfb2f9256f7b74b6b6a00f5cc8` |
| `docs/dev/PROJECT.md` | `fb92cb94be795c4e5a4bf3e81b40c772f0c329fd24a7e12018110bb5a088e143` |
| `docs/dev/ARCHITECTURE.md` | `4ce927e133be43bdf2b40461bd11960340e76857314db629cc5b2687d4f7149b` |
| `docs/dev/DECOMPOSITION.md` | `71cbbe32339eebceb926e09c328cd788f73301291855f307d37943db372ebd47` |
| `docs/dev/SPEC.md` | `720af17025651563232a1dcc9a0daa46fc603b7d993fd69bb01b1a103f7f112f` |

## Initial review

Date: 2026-10-09. Reviewer: the authoring agent applying sdd-specify and shared development-document QC criteria. This is an inline assessment, not an independent-agent review.

Compared the complete scoped delta with PROJECT, main architecture/decomposition, accepted feature design, and affected baseline S1–S8/A1–A11. Inspected actual selection/session/geometry, input/controller/presentation, and scenario helper interfaces to assess impact without treating implemented baseline behavior as feature approval. Checked rule ownership, draw/state mutation boundaries, lifecycle failures, observable return values, snapshot isolation, timer/command ordering, presentation/resource obligations, and acceptance completeness. No existing product source, baseline governing document, or completed baseline report is amended by this checkpoint.

| Accepted design concern | Canonical contracts | Acceptance | Assessment |
| --- | --- | --- | --- |
| Seven-bag selection, fresh session, one next preview | F1–F2 | FA1–FA3, FA10 | Per-game bag state, exact six-value shuffle/forward consumption and success-only replacement draws are assessable. |
| Once-per-lock hold and replacement spawn | F3, F6 | FA2–FA3, FA7 | Empty/full/same-kind hold, timer reset, availability, spawn obstruction and no-draw failure semantics are explicit. |
| Project-defined clockwise horizontal kicks | F4 | FA4, FA7 | Ordered offsets, first-fit atomicity, no vertical translation, O ineffectiveness and grounding effects match accepted geometry ownership. |
| Shared ghost/hard-drop landing and row points | F5–F6 | FA5–FA7 | First-obstruction displacement prevents tunneling; projection is nonmutating, drop scores only positive movement, and neither action forces lock. |
| Full grounded interval and chronology | F3–F7; retained S4 | FA4, FA6–FA8, FA10 | Hold gets fresh spawn timers; kicks/drop retain or reconcile grounding; timer-before-command and residual/partition behavior remain covered. |
| Browser controls/lifecycle/resource boundary | F7 | FA8–FA10 | Accepted C/Space/P mapping, case equivalence, pause latch, native-repeat suppression, repeat continuity, focus return and disposal are explicit. |
| Detached snapshots, desktop/static presentation | F6–F8 | FA5, FA9–FA10 | Hold/ghost data have one engine owner; readability, keyboard access, DPR/minimum viewport and recorded stable-target checks retain S8 scope. |
| Scope and affected baseline contracts | Scope, F1, acceptance/limits | FA10; unchanged A1–A11 portions | Every delta names its main owner. No extra rotation mode, floor kick, runtime backend, bonus scheme, or production state hook is introduced. |

No confirmed QC/conformance finding was identified. SPEC-stage milestone/task count assessment is not applicable. Precise shuffle iteration, failed-hold disposition, ghost field shape, zero-distance result, lowercase handling, pause latch, and repeat continuity are specification refinements within accepted design, presented for human acceptance rather than attributed to the design's earlier acceptance.

The existing constant-source repeated-O unit/browser fixtures conflict with F2 if reused unchanged. This is an explicit downstream verification impact, covered by FA10; current baseline fixtures are not defects in the completed baseline. Feature planning must allocate fixture adaptation and preserve meaningful baseline coverage without a production mutation hook. No historical campaign recheck or rewrite is required.

## Document checks and limits

The authored local Markdown links resolve. F1–F8 and FA1–FA10 are unique and complete; acceptance references resolve to their canonical feature/baseline owners. Reviewed content hashes match the actual files. Git whitespace and owned-path checks pass; product sources and baseline specification/design/plan/tasks/review/report contents are unchanged. Root navigation identifies accepted design, pending specification acceptance, and absence of executable feature tasks.

No correction/recheck cycle was necessary, so no Revision section is fabricated. No tests, builds, browser launches, compatibility checks, or external fact-checking are claimed for this documentation-only checkpoint. Future FEATURE-PLAN and FEATURE-TASKS must cover these contracts and pass their own QC; this report does not establish their readiness or host-object eligibility.

## Revision 1 — Specification acceptance

The user accepted FEATURE-SPEC at `2999f0fbaaa46813c97e2fed035dfab3b1b279fc` on 2026-10-09. Updated its authority and readiness paragraphs to record that acceptance. F1–F8 and FA1–FA10, accepted design policies, and main governing inputs are unchanged. Inspected the acceptance-only diff against the initial conformance coverage, rechecked current content identity and local navigation, and found no new issue or behavior decision. Current FEATURE-SPEC SHA-256: `c4c58e297e4a9e9005f45c750745e97f577b7f9fa36f1c01e7d8da2fec0c9e0b`. Initial reviewed-state identities/observations remain retained above. Gate: Ready for feature planning; no implementation check is claimed.
