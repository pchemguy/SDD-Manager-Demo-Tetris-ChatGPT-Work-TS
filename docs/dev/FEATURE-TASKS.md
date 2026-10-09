# Modern-feature implementation tasks

## Governing inputs and execution gate

This is the sole executable feature owner for [campaign 001_2606a72-modern-features](features/001_2606a72-modern-features/README.md), based on published baseline `2606a7213d4ddcf18497fafabb6cc5c349a26178`. It derives from accepted [FEATURE_DECOMPOSITION](FEATURE_DECOMPOSITION.md), [FEATURE-SPEC](FEATURE-SPEC.md), [FEATURE-PLAN](FEATURE-PLAN.md), and [feature layout](layout/modern-features.md), with current [SPEC review](FEATURE-SPEC-REVIEW-REPORT.md) and [PLAN review](FEATURE-PLAN-REVIEW-REPORT.md). The [adjacent task review](FEATURE-TASKS-REVIEW-REPORT.md) assesses derivation quality. PLAN/layout were accepted at `9d77973073110aaf07ed899685bbd931e8ed6657` on 2026-10-09. The user accepted TASKS at a29696df319f3763fd547cb082ff3a7bf36b99b2 on 2026-10-09 and authorized full Phase 2 inline execution with GitHub tracking through verified publication to main. Every task is initially unchecked.

Project Phase 2 and milestones 2.1–2.5 retain accepted FEATURE-PLAN identities. New IDs T-023–T-041 follow completed baseline [TASKS](TASKS.md) T-001–T-022; baseline items are prerequisites/affected work, not feature completion claims. Feature work affects selection/session from T-003–T-004/T-008–T-010, input/presentation from T-005–T-006/T-012–T-018, and delivery from T-019–T-022. Do not duplicate or reopen those completed items merely to implement this delta. Parent checkboxes below measure only this feature scope.

Preparation lives on `design-docs/001_2606a72-modern-features`. Before execution, explicitly merge accepted preparation and required QC into actual default `main`, verify/publish and read back containment, then create `feature/001_2606a72-modern-features` from that checkpoint. GitHub tracking is enabled for the complete feature phase; activate eligible Phase 2's phase label, all five milestones and every task issue with associations before its first task. No feature issue association is guessed from task IDs or baseline issue numbers.

Verification below is planned, not performed. Existing commands are `npm run typecheck`, `npm test -- <suite/path>`, `npm run build`, `npm run test:e2e -- --project=chromium <spec>`, and `npm run test:e2e:stable`. Build before production browser checks; use documented externally provisioned stable executables/process-scoped environment where needed. Each substantive implementation includes focused behavioral evidence, relevant regressions and professional module/API documentation. Browser sources/fixtures must remain coherent after each contract change. No product package installation, test execution or hosted projection occurs during task preparation.

## Phase 2 — Modern browser features

- [ ] Phase 2 — Modern browser features
    - [ ] Milestone 2.1 — Ghost and delayed hard drop
        - [ ] T-023 — Add shared landing projection and detached ghost snapshots
            Scope: planned src/engine/placement.ts and tests/engine/placement.test.ts; src/engine/game.ts/types.ts and affected typed unit/browser fixtures.
            Depends on: accepted published preparation, completed baseline T-022, and eligible phase activation. Contracts: F5–F6/FA5; retained collision/snapshot guarantees.
            Outcome: pure first-obstruction landing query; Game snapshots expose detached ghost cells without state, timer or random consumption. Keep existing consumers compiling and baseline behavior intact; hold fields belong to T-030.
            Evidence: npm test -- tests/engine/placement.test.ts tests/engine/game.test.ts; empty/stacked/uneven/grounded projection, paused/no-active state, retained/mutated snapshots and nonmutation; npm run typecheck and relevant regressions. No production scenario loader.
        - [ ] T-024 — Implement scored hard drop with the full grounded delay
            Scope: src/engine/game.ts/types.ts and planned tests/engine/features.test.ts, collaborating timing/progression tests.
            Depends on: T-023. Contracts: F5–F6/FA6–FA7, retained S4–S5.
            Outcome: hardDrop translates to shared landing, scores two points per positive row, rejects zero/inactive drop, preserves gravity age and full independent lock countdown. No command-time lock/clear/spawn.
            Evidence: npm test -- tests/engine; positive/zero/inactive score/result atomicity, late-cycle landing, just-below/at G, grounded repeats, movement/airborne cancellation and successor timer ordering; npm run typecheck. Keep baseline line awards and soft-drop behavior verified.
        - [ ] T-025 — Integrate Space hard drop and P pause without stale input
            Scope: src/browser/input.ts/controller.ts, index.html current instructions, focused browser unit tests and affected tests/e2e controls/accessibility fixtures.
            Depends on: T-024. Contracts: Space/P portions of F7/FA8; retained repeat/focus/resource obligations.
            Outcome: Space invokes one-shot drop, P/p invokes one-shot pause/resume with its latch retained through its own transition; timers run before actions. Preserve horizontal/down deadlines across drop and exclude inactive time; C remains deferred.
            Evidence: npm test -- tests/browser; mapping, case equivalence, native/duplicate suppression, P release/pause latch, repeat continuity, blur/hidden/manual return, restart and disposal; npm run typecheck/build. Update existing Space-pause browser assertions in the same change.
        - [ ] T-026 — Render ghost and demonstrate the delayed-drop browser slice
            Scope: src/browser/renderer.ts, tests/browser/renderer.test.ts, planned tests/e2e/features.spec.ts and affected presentation fixtures; README/AGENTS current behavior and browser setup evidence.
            Depends on: T-025. Contracts: FA5–FA6, hard-drop portions of FA7–FA9; milestone 2.1 exit.
            Outcome: ghost outline under active geometry, paused/no-active rendering, readable current Space/P instructions and real built-page drop/lock/spawn/restart. Inspect existing external browser availability early without claiming final supported-target acceptance.
            Evidence: focused renderer checks, npm run typecheck/build, built-page Chromium feature/play/control smoke and screenshot/pixel inspection. Observe ghost/drop endpoint agreement, full late landing interval, grounded movement, pause/focus and Restart; hold/bag/kick/final-DPR evidence stays explicitly deferred.
        - [ ] T-027 — Review, test and report milestone 2.1
            Depends on: T-023–T-026 verified, committed and published.
            Scope: integrated query/session/input/render slice and dependencies; sdd-verify code review, milestone exits/regressions, required repairs and real-play/readability evidence.
            Evidence: npm test, npm run typecheck/build and relevant production checks pass; report scoped functionality, usability/timing risks and honest 2.2–2.4 deferrals. Reconcile issue/milestone closure if tracking is active.
            Report: docs/dev/features/001_2606a72-modern-features/reports/2.1.md; concise implemented features, Findings/Blockers and TODO (None when empty).
    - [ ] Milestone 2.2 — Seven-bag and usable hold
        - [ ] T-028 — Build per-game seven-bag selection and controlled shuffle helpers
            Scope: src/engine/random.ts, tests/engine/random.test.ts and planned tests/helpers/random.ts.
            Depends on: T-027. Contracts: F2/FA1.
            Outcome: instance-owned selector with descending Fisher–Yates, exact six-value shuffle, forward/lazy consumption and reset without rewinding caller randomness. Add test-only sources for chosen valid bag permutations. Do not activate bag selection in Game until its consumers are reconciled by T-029.
            Evidence: npm test -- tests/engine/random.test.ts; loop/draw counts, deterministic permutations, rollover/boundary duplicates, reset and isolated selectors; npm run typecheck and relevant regressions. Transitional independent selection remains internal baseline behavior, not an exported product mode.
        - [ ] T-029 — Activate bag-backed sessions and reconcile affected fixtures atomically
            Scope: src/engine/game.ts/random.ts, tests/helpers/scenarios.ts/random.ts, affected tests/engine and tests/browser fixtures, tests/e2e suites and stable-firefox.mjs preload/source scenarios.
            Depends on: T-028. Contracts: F2/FA1, FA10 fixture obligation; retained A1–A11 portions.
            Outcome: Game owns its selector, resets it on fresh session and uses exact active/next/post-lock consumption. Replace unlimited repeated-O and independent-draw assumptions with valid controlled bags/public-command scenarios across all affected consumers. Retain meaningful clearing/progression/top-out/timing evidence; no product loader or alternate random mode.
            Evidence: npm test and npm run typecheck/build; session draw/no-draw/restart/isolation and all adapted regressions pass. Built-page checks preload randomness before app startup and verify intended pieces rather than assume them; required stable runner scenarios remain coherent. Limit edits to the selection contract and its dependent fixtures/assertions.
        - [ ] T-030 — Implement hold state, replacement timers and spawn failures
            Scope: src/engine/game.ts/types.ts, tests/engine/features.test.ts and affected snapshot/lifecycle/timing fixtures.
            Depends on: T-029. Contracts: F3/F6/FA2–FA3 and hold portions of FA7.
            Outcome: held/canHold snapshots and once-per-lock command; empty/full/same-kind swaps, canonical replacement/fresh timers, exact preview/bag use, outgoing hold retention on top-out and restart reset. Hold does not re-enable through pause/drop/kicks/airborne transitions.
            Evidence: npm test -- tests/engine; controlled valid sessions cover all hold states, consumed/inactive rejection, grounded-at-spawn replacement and empty/full obstruction/no replacement draw. Snapshot isolation, board/progress retention and timing regressions pass; npm run typecheck.
        - [ ] T-031 — Integrate C hold and held-piece presentation in the built game
            Scope: src/browser/input.ts/controller.ts/renderer.ts/view.ts, src/main.ts/index.html/styles, focused browser and production feature tests, README/AGENTS feature behavior.
            Depends on: T-030. Contracts: C/hold portions of F7–F8/FA8–FA9; milestone 2.2 exit.
            Outcome: C/c one-shot action, preserved arrow-repeat deadlines, held canonical preview/name/empty state and lifecycle-aware availability. All presentation comes from snapshots; real hold/next/drop path works without re-enabling hold or duplicating session state.
            Evidence: npm test -- tests/browser, npm run typecheck/build and built-page feature/control checks; inspect screenshots/text for empty/full/consumed/paused/game-over hold. Native C and duplicate/case behavior, bag-backed next consumption, pause/focus/Restart and prior ghost/drop path pass.
        - [ ] T-032 — Review, test and report milestone 2.2
            Depends on: T-028–T-031 verified, committed and published; 2.1 complete/closed if hosted.
            Scope: bag/session/hold, fixture migration and browser consumers; code review distinct from checks, required repairs, integrated milestone exits and prior-slice regressions.
            Evidence: FA1–FA3, relevant FA5–FA9 and retained baseline assertions pass; demonstrate usable hold/next/drop and exact no-draw failure semantics. Reconcile managed closures when active.
            Report: docs/dev/features/001_2606a72-modern-features/reports/2.2.md; implemented features, fixture/draw-state risks, Findings/Blockers and TODO.
    - [ ] Milestone 2.3 — Wall kicks and complete interactions
        - [ ] T-033 — Apply first-fitting clockwise horizontal wall kicks
            Scope: src/engine/placement.ts/game.ts, tests/engine/placement.test.ts/features.test.ts and affected rotation consumers.
            Depends on: T-032. Contracts: F4/FA4 and grounding portions of FA7.
            Outcome: ordered offsets 0,-1,+1,-2,+2 with fixed y, first-fit atomic rotation and O/all-failed rejection. Reuse board collision/geometry; preserve gravity age and reconcile grounding exactly.
            Evidence: focused placement/session tests and engine regressions; both walls, stacked cells, precedence, all-candidate/floor failure, O, retained grounded countdown and airborne/new-grounding behavior; npm run typecheck/build and actual browser wall-rotation demonstration.
        - [ ] T-034 — Verify complete engine interactions across locks, holds and progression
            Scope: tests/engine/features.test.ts and existing timing/boundaries/lifecycle/progression/game suites and test helpers; targeted engine repairs if required.
            Depends on: T-033. Contracts: complete F2–F6/FA1–FA7; unchanged engine A1–A7 portions.
            Outcome: close cross-feature acceptance gaps using public command/time scenarios; validate ghost/drop agreement and detached snapshots through hold, kicks, pause, top-out and restart. No redundant implementation-mirroring tests or source mutation hook.
            Evidence: npm test -- tests/engine; late drop/hold replacement, just-before/at expiry, equal-time command on successor, clear/level transitions, residual/partition equivalence, source consumption and effective/ineffective atomicity; npm run typecheck/build. Retain existing valid evidence where sufficient.
        - [ ] T-035 — Verify complete browser one-shot, repeat and lifecycle interactions
            Scope: tests/browser/input.test.ts/controller.test.ts, affected production feature/control tests and browser input/controller repairs where needed.
            Depends on: T-034. Contracts: complete F7/FA8; retained focus/resource obligations.
            Outcome: native/controlled C/Space/P, case/physical-hold identity, P latch, timer-before-command ties and arrow-repeat survival across hold/drop pass. Inactive keys, blur/hidden/manual resume, restart/top-out and disposal cannot replay time or leak controls.
            Evidence: npm test -- tests/browser, npm run typecheck/build and built-page feature/control checks with real keys plus controlled clock boundaries; wall rotation and grounded adjustment remain usable. Update current controls/API notes if repairs change implementation details without changing contracts.
        - [ ] T-036 — Review, test and report milestone 2.3
            Depends on: T-033–T-035 verified, committed and published; earlier delivery milestones complete/closed if hosted.
            Scope: complete engine/browser temporal and command integration; sdd-verify code review, FA4–FA8 and applicable baseline exits, regressions and required repairs.
            Evidence: npm test, npm run typecheck/build and relevant built-page checks pass; demonstrate kick success/failure and full-delay cancellation/retention with actual input. Final supported-target/presentation completion remains 2.4; reconcile managed closures when active.
            Report: docs/dev/features/001_2606a72-modern-features/reports/2.3.md; implemented interactions, usability/timing findings, Findings/Blockers and TODO.
    - [ ] Milestone 2.4 — Desktop acceptance and reproducible delivery
        - [ ] T-037 — Complete held/ghost desktop rendering and accessible state
            Scope: src/browser/renderer.ts/view.ts, index.html/styles, focused renderer/view tests and production presentation/accessibility/feature checks.
            Depends on: T-036. Contracts: F8/FA9; retained S8/A10.
            Outcome: full board/next/held panels, ghost/active layering, kind/empty/availability text, all instructions/status and named keyboard Restart are coherent and unclipped at minimum/resized/DPR desktop geometry.
            Evidence: focused unit checks, npm run typecheck/build and production screenshots/pixels/geometric assertions at 1024x768 and larger/resized viewports with DPR 1/2; paused/game-over/empty/full/overlapping-ghost states and Tab/Enter Restart. Inspect readable output, not merely DOM presence.
        - [ ] T-038 — Establish current-stable production browser feature acceptance
            Scope: tests/e2e including stable-firefox.mjs, production server/browser configuration as needed, targeted integration repairs and README recorded methods/versions.
            Depends on: T-037. Contracts: FA8–FA10 and complete F1–F8 integrated acceptance.
            Outcome: recorded current-stable desktop Chromium/Firefox evidence for native controls, hold/bag/ghost/kicks/delay, focus/tab visibility, row clear/progression/top-out, Restart and resized/DPR presentation on static output. No baseline or bundled-version substitution.
            Evidence: npm run build and documented npm run test:e2e:stable plus relevant standard browser checks. Verify fixture piece identity before scenarios; preload sources before startup. Record actual engine/provisioning/method limits and inspect screenshots. Required access or compatibility gaps block completion; unit/type regressions pass after repairs.
        - [ ] T-039 — Verify reproducibility and finalize feature user/API documentation
            Scope: README/AGENTS, substantive source docstrings/API documentation, package/lock/scripts only if necessary, current active feature navigation and check evidence.
            Depends on: T-038. Contracts: F6/F8/FA10; desktop delivery exits.
            Outcome: current bag/hold/drop/kick/snapshot/control semantics and Node/npm/CMD setup are documented; fresh install/type/unit/build/stable-browser workflow works. Generated outputs/secrets remain excluded, disclosures remain accurate, and no preconfigured Python environment is changed.
            Evidence: npm ci, npm run typecheck, npm test, npm run build and documented browser checks; inspect local links, module/API documentation, CMD-compatible environment instructions and Git exclusions. Reconcile only active/current documents; closed baseline reports remain unchanged.
        - [ ] T-040 — Review, test and report milestone 2.4
            Depends on: T-037–T-039 verified, committed and published; earlier delivery milestones complete/closed if hosted.
            Scope: complete feature desktop/static/tooling/documentation delivery; code/dependency review, full FA9–FA10/required target evidence, regressions and blocker repairs.
            Evidence: current complete F1–F8 acceptance, unit/type/build/browser checks, inspected screenshots and reproducible documented workflow; report published and managed milestone closure read back if active.
            Report: docs/dev/features/001_2606a72-modern-features/reports/2.4.md; delivered features, actual browser/method limits, Findings/Blockers and TODO.
    - [ ] Milestone 2.5 — Phase review and integration
        - [ ] T-041 — Review, incorporate and publish the complete modern-feature phase
            Depends on: T-027, T-032, T-036 and T-040; all delivery milestones 2.1–2.4 complete, reviewed and published, with their hosted milestones closed if tracking is enabled. It does not depend on closure of its own milestone 2.5.
            Scope: full phase/cross-component code/dependency review, FA1–FA10 and retained baseline acceptance, current documents and all required repairs. Through sdd-integrate-feature incorporate accepted PROJECT/ARCHITECTURE/DECOMPOSITION/SPEC/PLAN/layout targets and reconcile TASKS/FEATURE-TASKS ownership with stable IDs/statuses/issue associations.
            Outcome: coherent current main documents and phase/task ownership; affected main QC rechecked; eligible feature sources/reviews archived with repaired links and historical markers. Transfer the final task's live completion owner coherently before archival; archived checkboxes never become a second executable owner. Aggregate findings/TODOs with provenance and no unrecorded required defect.
            Evidence: full unit/type/build/stable-production/visual acceptance and code review; reports committed/pushed, review issue/milestone closure verified if active, local parent claims reconciled. Explicitly merge the verified feature into refreshed main, verify the merged tree, publish and read back remote containment. Preserve closed baseline reports and retained branches; start no later campaign.
            Reports: docs/dev/features/001_2606a72-modern-features/reports/PHASE-REPORT.md and docs/dev/features/001_2606a72-modern-features/IMPLEMENTATION-REPORT.md; concise delivered features, actual evidence/limits, Findings/Blockers, TODO aggregation and final integration/publication receipt.

## Current boundary

All 19 tasks are planned and unchecked. No feature task, package install, product edit or host object is completed by preparation. Full feature execution spans T-023–T-041 and includes final accepted document incorporation, archive, explicit merge/check/push and remote readback. A selected partial range commits/pushes and pauses on the feature branch. The task list must be accepted and the execution/tracking handoff established before dependent implementation; publication authorization remains retained.
