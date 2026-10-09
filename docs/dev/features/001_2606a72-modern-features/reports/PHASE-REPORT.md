# Phase 2 — Modern browser features

## Accepted and reviewed boundary

Campaign 001_2606a72-modern-features implements T-023–T-041 inline with GitHub tracking. T-023–T-040 and delivery milestones 2.1–2.4 are published and closed/read back. The accepted preparation checkpoint is 71f6275a7b77ed02e9e9f1e6f23762770866f1c5; the working branch is feature/001_2606a72-modern-features, target main. This phase review covers the full prospective feature delta at bd2174d plus T-041 document incorporation/reporting. Target integration/publication is a separate final gate recorded in the [implementation receipt](../IMPLEMENTATION-REPORT.md).

## Cross-component code and dependency review

The implementing agent performed a separate inline review of the complete branch difference, all product modules, affected fixtures/checks, packaging and current docs. No independent-agent review is claimed. Inspected Game's bag/hold/drop/kick/lock ordering, exact random consumption and spawn failures, placement purity and snapshot isolation; Controller's timer-before-command/repeat scheduling, case/physical holds/P latch, inactive cleanup and disposal; Renderer/View/HTML/CSS ownership, layering, previews, lifecycle labels, DPI and keyboard access. Production runners install randomness before app startup and use conforming public-command traces; no product mutation hook or alternate mode was added. Dependencies remain pinned and no new runtime package is needed.

All current rules have one owner. Ghost and hard drop share first-obstruction projection. Hold resets incoming geometry/timers without restoring its consumed availability until successful lock/spawn; failed incoming spawn retains outgoing held kind/next/board/progress without drawing. Kicks test 0,-1,+1,-2,+2 at the same y and preserve existing grounding rules. Hard drop awards 2d and waits a full G, without an immediate lock or repeated stationary scoring. P has a separate surviving pause latch; normalized C/Space holds and arrow schedules behave through locks and running replacements. No required code finding remains.

## Acceptance evidence

| Current acceptance | Actual evidence |
| --- | --- |
| A1–A7, FA1–FA7 | 59 engine tests cover geometry/collision/1–4-row compaction, exact six-draw bag/permutations/reset/isolation, empty/full/same-kind/no-draw obstructed holds, all ordered kick offsets/both walls/precedence/floor failure, detached nonmutating projection, positive/zero/inactive drop, exact/fractional deadlines, command ties and partitions through clear/level/spawn/top-out. |
| A8–A10, FA8 | 30 controlled browser tests cover repeat/priority/release, one-shot case/physical holds, P latch, timer-before-input without a frame, repeats surviving running hold/drop, inactive cleanup, native/duplicate repeats, focus/hidden/manual resume, restart, immediate hold-top-out cleanup and disposal. |
| A10–A11, FA9–FA10 | All 13 production Chromium checks and two unpatched Firefox sessions pass. Native keys verify hold/drop/kicks/one-shot latches, bag-backed eleven-line level-two trace with piece identity checked before each placement, top-out, keyboard Restart and native Firefox tab-switch pause. Minimum/resized 1024×768 and 1440×1000, DPR 1/2, pixels/geometry and inspected screenshots verify readable full board/next/held/controls/status, empty/full/paused/game-over and overlapping active/ghost states. |
| Delivery/reproducibility | Fresh T-039 npm ci on Node 24.19.0/npm 11.9.0, strict typecheck, all 89 tests in 14 files, production build and documented combined stable workflow pass. README records CMD/POSIX setup, exact versions/methods, caller/API contracts and static HTTP serving. Credentials/generated outputs remain ignored/untracked; disclosures and preconfigured Python/global environment are preserved. |

Official current-stable metadata checked in T-038 matches Chromium 155.0.8059.39 and Firefox 157.0.1; geckodriver is 0.37.1. Browser runtime/test sources are unchanged by T-041 documentation work, so those fresh stable/visual results remain applicable. T-041 additionally verifies current docs, hashes, links, task ownership, full branch scope and baseline preservation; merged-state checks and publication follow before claiming the integrated boundary.

Chromium uses Google's official stable headless desktop shell because full Chrome ProcessSingleton Unix sockets are unavailable in this sandbox. Evidence does not attest graphical browser chrome/OS focus; native Firefox tabs verify actual blur/visibility. Firefox uses documented process-scoped sandbox variables and owned fonts. Older packaged/bundled browsers are not final target evidence.

## Incorporation, QC and historical disposition

PROJECT/ARCHITECTURE/DECOMPOSITION describe the complete product and retained ownership; SPEC integrates all accepted current contracts while preserving S1–S8/A1–A11 and FA1–FA10. PLAN retains both phase identities and their delivery/review gates; layout allocates actual bag/query/hold/preview/fixture/native-runner homes. Main TASKS owns 41 stable IDs across two phases and ten milestones, with Phase 2 issue associations/evidence and T-041's live owner transferred exactly once. Affected baseline acceptance is reassessed through valid current fixtures; historical Verified observations remain identified as such.

Eight selected source/QC files moved with basenames and original review histories into the actual campaign package, including modern-features.md folded into main layout. Historical banners and repaired relative navigation retire all source checklists as executable owners. Main SPEC/PLAN/TASKS QC is assessed independently with new Revision cycles and current content identities; original cycles/findings are retained. Incorporation review repaired stale contract references and a duplicate S3 range, with no behavior decision changed. Closed baseline report paths/objects remain unchanged; branches and tracking identities are retained.

## Findings / Blockers

None remaining. Milestone 2.2 repaired MR22-01 (inherited action-map keys); 2.4 repaired paused footer clipping, frozen resize sampling and Firefox content-viewport sizing. Earlier fixture/Pixel repairs are recorded in their owning task/milestone evidence. No required compatibility gap or unrecorded defect is carried into integration.

## TODO aggregation

None. Provenance: [2.1](2.1.md), [2.2](2.2.md), [2.3](2.3.md), [2.4](2.4.md) each reports TODO None; this cross-phase review introduces none. Integration/publication receipt is required workflow completion, not a deferred code TODO. No later campaign is selected.
