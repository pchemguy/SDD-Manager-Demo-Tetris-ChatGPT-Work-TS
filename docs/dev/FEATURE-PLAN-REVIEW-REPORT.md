# Modern-feature plan and layout review

## Current gate

State: **Ready for PLAN/layout acceptance**. FEATURE-PLAN conforms to accepted FEATURE-SPEC, and the focused physical layout supports the accepted design and delivery route. FPR-01 is resolved; no confirmed issue remains. User acceptance of this strategy/layout is pending, so FEATURE-TASKS derivation has not started. This report does not authorize product implementation or hosted projection.

Reviewed scope: [FEATURE-PLAN](FEATURE-PLAN.md) and [layout/modern-features](layout/modern-features.md); no plan children. The focused layout is an active feature delta, not an implicit rewrite of main layout. Campaign: [001_2606a72-modern-features](features/001_2606a72-modern-features/README.md); preparation checkpoint: `2999f0fbaaa46813c97e2fed035dfab3b1b279fc`. The user accepted FEATURE-SPEC at that checkpoint on 2026-10-09; [specification review Revision 1](FEATURE-SPEC-REVIEW-REPORT.md#revision-1--specification-acceptance) records acceptance-only reconciliation with unchanged F1–F8/FA1–FA10.

Current reviewed/governing source identities (SHA-256):

| Source | Content identity |
| --- | --- |
| `docs/dev/FEATURE-PLAN.md` | `07a3886c1b8b3acccbc71778471db5cf62ce5498ca78f371e4772bf03f2d287d` |
| `docs/dev/layout/modern-features.md` | `e1f5e87c915bc1bc0c2dc8fd385055ffe8febf33c3b5b95547c94cd46283cbc0` |
| `docs/dev/FEATURE-SPEC.md` | `c4c58e297e4a9e9005f45c750745e97f577b7f9fa36f1c01e7d8da2fec0c9e0b` |
| `docs/dev/FEATURE_DECOMPOSITION.md` | `adf882732ae0b53bc9e4a282d7fc59bea6b2acbfb2f9256f7b74b6b6a00f5cc8` |
| `docs/dev/PROJECT.md` | `fb92cb94be795c4e5a4bf3e81b40c772f0c329fd24a7e12018110bb5a088e143` |
| `docs/dev/ARCHITECTURE.md` | `4ce927e133be43bdf2b40461bd11960340e76857314db629cc5b2687d4f7149b` |
| `docs/dev/DECOMPOSITION.md` | `71cbbe32339eebceb926e09c328cd788f73301291855f307d37943db372ebd47` |
| `docs/dev/SPEC.md` | `720af17025651563232a1dcc9a0daa46fc603b7d993fd69bb01b1a103f7f112f` |
| `docs/dev/PLAN.md` | `e96a1fd75365d88307ffd2292b020efcb217577d7e21c5b687bf6d273efc182a` |
| `docs/dev/layout.md` | `ddbd7fd96c8fbb56a31a2ab9dfbc4466a1b1eec7b45c80921b384a69b1bbddf4` |

## Initial review

Date: 2026-10-09. Reviewer: the authoring agent applying sdd-plan and shared development-document QC; this is an inline assessment, not an independent-agent review.

Compared all feature contracts and retained baseline obligations with milestone inclusions, dependencies, exits and phase closure. Assessed earliest actual browser usefulness, fixture adaptation timing, honest deferrals, code-review/verification/report boundaries, accepted document incorporation and Git publication. Inspected existing source/tests/package scripts/browser configuration for physical placement and feasible use of the existing toolchain; no application check or browser launch was executed during preparation.

Initial draft identities: FEATURE-PLAN `0d7795444d398722a2ee7a0bf27e95320ed7bfd68630184240dea533548fb724`; feature layout `5d7ba983d8544d0d611fce8b9a53dc0faa294a1971c6e259f753445cc576318a`. Current corrected identities appear above.

| Contract/acceptance group | Delivery route | Assessment |
| --- | --- | --- |
| F2 / FA1: exact bag, reset/draw/session state | 2.2; stable/regression recheck 2.4 | Full bag behavior arrives with valid fixtures, preview integration and hold consumption; no unlimited repeated-O assumption survives the bag milestone. |
| F3 / FA2–FA3: hold/replacement/failure/availability | 2.2; interactions 2.3 | Usable browser hold follows exact engine semantics, including empty/full/same-kind and obstruction/no-draw paths. |
| F4 / FA4: first-fit clockwise horizontal kicks | 2.3 | Candidate ordering and rejected/floor cases have integrated grounding evidence without introducing vertical kicks. |
| F5–F6 / FA5–FA7: projection, row points, delay and snapshots | 2.1; complete cross-feature checks 2.3 | Shared query establishes real ghost/drop usefulness early; full G and timer chronology precede later engine/control complexity. |
| F7 / FA8: mapping/repeat/case/lifecycle/resource | Space/P in 2.1, C in 2.2, full interactions 2.3, supported targets 2.4 | Every introduced action has immediate relevant checks; comprehensive latches, timer ties, cleanup and native interaction remain assigned. |
| F8 / FA9–FA10: visible/accessible desktop/static delivery | Real slices 2.1–2.3; complete 2.4 | Explicit minimum/resized/DPR, Restart, snapshots/pixels, native focus and current-stable engines; baseline evidence is not used as feature proof. |
| F1 and unchanged A1–A11 obligations | Each affected increment plus full 2.3–2.4 regressions | Fixture changes preserve contract evidence; no unsupported mode or production loader is required. |
| Review/TODO, incorporation, archive and final target publication | Delivery review outcomes and 2.5 | Delivery closures precede phase review; final integration includes coherent main docs/task transfer/QC and merged-state verification. |

| Phase | Delivery milestone count | Excluded review milestones | Scope/count rationale |
| --- | --- | --- | --- |
| 2 — Modern browser features | 4: 2.1–2.4 | 1: 2.5, exactly one final phase review outcome | Retained. Landing/drop is a meaningful browser increment; bag/hold shares state/fixture concerns; kicks/full interaction has a distinct correctness boundary; desktop/stable/reproducible acceptance has a distinct delivery boundary. No padding or setup-only stage. |

The four-delivery count fits the shared heuristic, but semantic scope was assessed separately. Each increment contains working integration and its own final review/testing/report outcome; no delayed all-features integration is hidden at the end. 2.1 has several close consumers of the shared landing/drop contract; task derivation must split bounded query/session/input/presentation work without expanding milestone scope. Task counts and executable granularity cannot be assessed until FEATURE-TASKS exists. No task IDs or task checklist are invented by this plan.

Physical ownership assessment: existing engine/session/input/controller/render/view/composition homes are retained. A pure placement-query module is justified by shared landing and candidate consumers; it introduces no competing state or browser dependency. Test-only bag/scenario helpers and production/static/browser checks have clear homes. New paths are labelled planned. The focused delta is discoverable from FEATURE-PLAN/package/root orientation, while unchanged main layout remains the baseline owner until accepted incorporation. No placement decision blocks task derivation.

## Findings

| ID | Location and consequence | Correction/recheck | Current disposition |
| --- | --- | --- | --- |
| FPR-01 | Feature layout, Documents/reports paragraph: initial allocation put the final feature IMPLEMENTATION-REPORT inside `reports/`, conflicting with the backend lifecycle's direct feature-prefix final report placement. Derived tasks could publish it to the wrong canonical location. | sdd-plan corrected the final report to the feature-package root, retaining milestone/phase reports under its `reports/` child; rechecked the lifecycle rule and linked ownership. | Resolved in Revision 1. |

## Revision 1 — Report location and final plan recheck

sdd-plan corrected FPR-01 in the feature layout and clarified the plan's code-review wording to distinguish review from test execution. No feature behavior, milestone boundary/dependency, acceptance condition, source allocation, or stage authorization changed. The final feature report belongs directly at `docs/dev/features/001_2606a72-modern-features/IMPLEMENTATION-REPORT.md`; milestone and phase reports stay within that feature prefix. This aligns with the shared backend lifecycle and preserves baseline report locations.

Rechecked the corrected layout against report ownership, the plan's final incorporation/closure route, and grouped F1–F8/FA1–FA10 coverage. Source hashes, local document targets, Phase 2/milestone identities, four delivery plus one review count, scoped edits and whitespace checks pass. FEATURE-SPEC's accepted contracts and all baseline product/governing/report contents are unchanged. Root/package navigation reflects accepted specification and pending plan/layout acceptance. FPR-01 is resolved; no remaining confirmed issue. Gate: Ready for PLAN/layout acceptance, then dependent task derivation after acceptance.

No installs, tests, builds, browser execution, compatibility passes or hosted objects are claimed. Actual browser availability and feature evidence are execution gates. Tracking confirmation remains a separate implementation-handoff choice. Main document incorporation and affected QC occur on the feature branch before final merge; this preparation checkpoint neither performs that incorporation nor invalidates unchanged baseline review evidence.
