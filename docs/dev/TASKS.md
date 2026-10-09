# Baseline implementation tasks

## Governing inputs and execution gate

This is the sole executable owner of the full baseline hierarchy. It derives from accepted [PROJECT](PROJECT.md), [ARCHITECTURE](ARCHITECTURE.md), [DECOMPOSITION](DECOMPOSITION.md), [SPEC](SPEC.md), [PLAN](PLAN.md), and [layout](layout.md). [TASKS review](TASKS-REVIEW-REPORT.md) assesses generation quality; task checkboxes below record verified implementation progress.

PLAN/layout were accepted by the user on 2026-10-09 at `3b9f97b554611b0bad5841361bd13b4e36d0aedd`. The user accepted this list and selected full Phase 1 (T-001–T-022), inline execution, and GitHub tracking on 2026-10-09. The selected stopping boundary is complete baseline integration/publication; modern features remain outside this run. Phase activation is verified: phase label, five milestones and issues #1–#22 with exact task markers/associations. Working branch phase/1-baseline-browser-game starts at published preparation merge b3b3bfcba9fef0e67a45221049073743e6ed9caf.

Before execution, integrate accepted preparation through the required explicit merge/check/push into actual default `main`, verify remote containment, and create `phase/1-baseline-browser-game`. Establish the hosted choice and eligible phase objects before its first task if tracking is enabled. No product dependency installation occurs during task preparation.

Verification commands below are planned. T-001 declares compatible pinned tooling and scripts; later commands use that actual interface. `npm test -- <path>` means a one-shot Vitest run restricted to the indicated suite/directory; `npm run test:e2e` means the browser suite. Required browser targets/versions must be recorded, not inferred from automation availability. Focused tests accompany implementation; review tasks additionally review code, integrated exits, regressions, and blockers. Maintain relevant docstrings/API documentation and current README/AGENTS commands with each substantive result.

## Phase 1 — Baseline browser game

- [ ] Phase 1 — Baseline browser game
    - [x] Milestone 1.1 — Playable end-to-end core
        - [x] T-001 — Establish the strict TypeScript static-app and check toolchain
            Scope: package manifest/lock, TypeScript/static-build/unit/browser configuration as needed, minimal entry page/composition, generated-output ignores, README and AGENTS setup/check commands.
            Depends on: accepted published preparation and phase activation; no prior task.
            Outcome: compatible pinned TypeScript/Vite/Vitest/Playwright tooling with strict checking, declared dev/build/preview/typecheck/test/test:e2e scripts and reproducible dependency setup. Verify package requirements from official sources and inspect browser availability early; report unavailable required engines without claiming compatibility.
            Evidence: npm ci, npm run typecheck, npm run build, and static page load succeed. Record actual versions; no product-completeness claim. Existing secret exclusion remains effective; Windows instructions use CMD-compatible commands.
            Verified: npm ci, typecheck and production build passed on Node 24.19.0; Chromium 153.0.8010.0 loaded the static page in two successive contexts. Setup-only task has no game-behavior RED claim. Chromium CDN returned HTML; owned package extraction recovered launch. Firefox 157.0 page creation remains unverified after a sandbox crash and is retained as a later compatibility gate.
        - [x] T-002 — Implement tetromino geometry and board operations
            Scope: src/engine/types.ts, pieces.ts, board.ts and focused tests/engine suites.
            Depends on: T-001. Contracts: S1, A1 and row-compaction portion of S5/A5.
            Outcome: all seven kinds/orientations/spawn offsets; occupied-cell collisions; placement and simultaneous full-row removal with stable remaining-row order. Board operations own no browser or session lifecycle state.
            Evidence: npm test -- tests/engine/pieces.test.ts tests/engine/board.test.ts; verify four-rotation identity, O stability, empty matrix cells, bounds/collisions, and 1–4 row compaction; npm run typecheck.
            Verified: Observed geometry/allocation behavioral RED, then isolated board RED with six assertion failures after fixing fixture allocation. GREEN: 16 geometry/board tests and strict typecheck passed; S1 geometry, occupied-cell collisions, detached atomic placement and 1-4-row stable compaction verified. Module/API documentation inspected.
        - [x] T-003 — Implement selection, session commands, restart, and isolated snapshots
            Scope: src/engine/random.ts, game.ts, types.ts, corresponding tests/engine and test-only fixtures under tests/helpers.
            Depends on: T-002. Contracts: S2–S3, snapshot obligations in S6; A1–A2, restart/snapshot portions of A6–A7.
            Outcome: independent active/next draws; valid/blocked horizontal, clockwise, and soft-drop commands; fresh restart; snapshots isolated from engine mutation. Establish stable concrete engine API names without changing logical contracts.
            Evidence: npm test -- tests/engine/random.test.ts tests/engine/game.test.ts; deterministic draw order/repeated kinds, collision rejection, restart draws, retained/modified snapshots; npm run typecheck. No production test-state loader.
            Verified: Five behavioral RED failures observed before implementation. GREEN: 21 engine tests and strict typecheck passed; independent draws, fresh restart order, atomic movement/rotation/drop rejection, soft-drop scoring and detached retained/mutable snapshots verified. Geometry/board regressions passed; chronological advance remains T-004 scope.
        - [x] T-004 — Integrate chronological gravity, full-delay locks, row clears, and top-out
            Scope: src/engine/game.ts and focused timing/lock/session tests, collaborating board/selection contracts; level-1 score calculation only within milestone 1.1.
            Depends on: T-003. Contracts: S4 and baseline portions of S2/S5; A3–A6 within MVP scope.
            Outcome: explicit-time gravity, immediate grounded detection, independent full lock countdown, no grounded reset/soft-drop lock exception, airborne cancellation, lock-before-gravity tie order, row clear/new spawn/top-out, residual time across spawns. Keep level at 1 in this milestone while displaying correct level-1/soft-drop awards.
            Evidence: npm test -- tests/engine; exercise late-in-gravity-cycle grounding, just-before/at lock expiry, grounded movement, blocked down, airborne transitions, row clearing/top-out, and time partitioning; npm run typecheck. Verify engine runs without browser globals.
            Verified: Seven timing/integration behavioral RED failures observed. GREEN: 28 engine tests and strict typecheck passed. Verified late-cycle full lock delay, grounded movement/no drop reset, airborne cancellation/re-grounding, residual-time partitioning, two-row clear through real commands, grounded-at-spawn delay, top-out and no replacement draw on blocked spawn. Level-1 MVP progression remains explicitly bounded.
        - [x] T-005 — Render the real engine board, preview, and statistics
            Scope: src/browser/renderer.ts, view.ts, index.html/styles, focused tests/browser presentation checks.
            Depends on: T-004. Contracts: initial presentation subset of S8/A10.
            Outcome: Canvas board/active piece and next preview, HTML score/lines/level/status, instructions, and Restart element reflect snapshots. Rule ownership remains in engine; final responsive/accessibility polish is deferred to 1.4.
            Evidence: focused renderer/view tests, npm run typecheck and npm run build; inspect actual initial/locked/game-over rendering. No fabricated gameplay state maintained by presentation.
            Verified: Two behavioral RED tests became GREEN; browser component tests, typecheck and production build passed. Native Chromium Canvas pixels verified active and locked O pieces, HTML game-over state, and screenshot inspection verified readable text after task-owned font configuration repair.
        - [x] T-006 — Compose the playable browser loop and discrete controls
            Scope: src/browser/controller.ts, src/main.ts, presentation integration, tests/browser and initial tests/e2e smoke scenarios, current README scope/controls.
            Depends on: T-005. Contracts: discrete S3/S7 controls and milestone 1.1 end-to-end exit.
            Outcome: live elapsed-time engine updates, initial keydown arrow controls, suppressed native repeats/default scrolling, Restart, and browser game-over display. Preserve lock chronology; explicitly identify repeat/pause/focus/resize compatibility deferrals in checkpoint documentation.
            Evidence: npm test -- tests/browser; npm run typecheck; npm run build; focused browser smoke and an actual playable spawn/move/rotate/drop/lock/new-spawn/restart path. Gather row-clear/top-out integrated evidence with deterministic test scenarios, without adding a production mutation hook.
            Verified: Two controller RED tests became GREEN. Four browser unit tests, strict typecheck and build passed. Built-page Chromium smoke passed spawn/move/rotate/soft-drop/lock/new-spawn/Restart with no page errors; public-command controller scenarios verified two-row clearing and top-out. Missing Vite CSS declaration was repaired; pre-rebuild stale static output was not counted as acceptance.
        - [x] T-007 — Review, test, and report milestone 1.1
            Depends on: T-001–T-006 complete and published.
            Scope: complete integrated MVP and dependencies; read-only code review through sdd-verify, required repairs through implementation, focused/full available regressions, demonstration of readable board/movement/full grounded delay, and explicit deferrals.
            Evidence: milestone 1.1 PLAN exits, passing engine/browser unit checks, typecheck/build and browser evidence; repair all required blockers; commit/push report and reconcile issue/milestone closure if active. Record usability/risk observations for human continue/amend/simplify/stop decisions.
            Report: docs/dev/reports/phases/1/1.1.md; include concise implemented features, checks/results, Findings/Blockers and TODO (None if empty).
            Verified: Read-only coherent core code review found no required milestone defect. All 32 unit tests, typecheck/build and built-page Chromium play smoke passed; native public-command rendering verified row clear and top-out. Report records intentional PLAN deferrals and pending final browser compatibility.
    - [ ] Milestone 1.2 — Progression and complete engine contracts
        - [x] T-008 — Implement scoring, level thresholds, and gravity progression
            Scope: src/engine/progression.ts, game integration, tests/engine/progression.test.ts and integrated progression scenarios.
            Depends on: T-007. Contracts: S5 and G(L) in S4; A5 and level-dependent A3–A4.
            Outcome: exact pre-clear-level line awards, successful-row soft-drop points, cumulative lines, ten-line level thresholds, and fractional/minimum gravity intervals for new pieces. Retain row-clear and gameplay behavior.
            Evidence: npm test -- tests/engine; verify 1–4 clear awards, 9→10 and multi-row threshold crossings, failed-drop score stability, pre/post-clear level ordering, gravity minimum; npm run typecheck.
            Verified: Three behavioral RED failures preceded formulas/integration. GREEN: 31 engine tests and strict typecheck passed, covering 0-4-row pre-clear awards, threshold crossings, fractional/floored gravity, real ten/twelve-line sessions, failed soft-drop scoring and full level-2 lock delay. Corrected an incomplete row fixture to place its first O at column zero.
        - [x] T-009 — Complete engine lifecycle, command outcomes, and invalid-time contracts
            Scope: src/engine/game.ts/types and focused lifecycle/error tests.
            Depends on: T-008. Contracts: S2/S3/S6; A6–A7.
            Outcome: pause/resume preserve timers, inactive sessions reject gameplay, restart resets progress/timers, effective/ineffective command results match SPEC, invalid elapsed values raise RangeError before mutation in all states.
            Evidence: npm test -- tests/engine; finite/nonnegative/zero boundaries, unchanged paused/game-over sessions, restart randomness, retained snapshot integrity, and API/documentation consistency; npm run typecheck.
            Verified: Observed pause outcome and invalid-time RED failures. GREEN: 35 engine tests and typecheck passed; pause/resume preserve independent remainders, inactive commands fail atomically, restart clears pending timers/progress, and negative/nonfinite elapsed raises RangeError before mutation in running/paused/game-over states.
        - [ ] T-010 — Verify timing boundaries across lifecycle and progression integration
            Scope: focused tests/engine timing/integration scenarios and bounded engine fixes if failures expose violations.
            Depends on: T-009. Contracts: S4–S6; A3–A7.
            Outcome: deterministic evidence for partition equivalence across locks/spawns/level changes, grounded-at-spawn behavior, gravity/lock ties, late landing, cancellation/re-grounding, post-clear spawn obstruction, and pause/resume remainders. Reuse valid fixtures; do not add redundant implementation-mirroring tests.
            Evidence: npm test -- tests/engine; compare independent controlled sessions under equivalent time partitions, test failure boundaries, npm run typecheck/build, and visible browser progression/lifecycle smoke. Preserve MVP regressions.
        - [ ] T-011 — Review, test, and report milestone 1.2
            Depends on: T-008–T-010 complete and published; milestone 1.1 complete/closed if hosted.
            Scope: whole S1–S6 engine, browser consumers, focused and regression evidence; code review, required repairs, and complete engine-contract exits.
            Evidence: A1–A7 engine obligations, unit/type/build checks and browser state demonstration pass; report committed/pushed; managed milestone closure read back if active.
            Report: docs/dev/reports/phases/1/1.2.md; include implemented features, Findings/Blockers and TODO.
    - [ ] Milestone 1.3 — Complete browser controls and lifecycle
        - [ ] T-012 — Implement deterministic held-key repeat and directional priority
            Scope: src/browser/input.ts and tests/browser/input.test.ts; controller consumes its command schedule.
            Depends on: T-011. Contracts: repeat/priority portions of S7/A8.
            Outcome: initial actions, 150/50 ms horizontal and 50 ms down repeat, most-recent horizontal priority, release fallback delay, horizontal-before-down ties, and no native rotation/Space repeats.
            Evidence: npm test -- tests/browser/input.test.ts; controlled time/key events at each repeat boundary, simultaneous repeats, opposite-key release, one-shot controls; npm run typecheck. No engine rule duplication.
        - [ ] T-013 — Integrate repeat schedules with chronological browser time
            Scope: src/browser/controller.ts, input integration, tests/browser/controller.test.ts.
            Depends on: T-012. Contracts: S4/S7 timer-before-command ordering and foreground elapsed-time handling; A3–A4/A8.
            Outcome: segment elapsed updates at scheduled repeat boundaries, advance timers before each command, process foreground frame delays without dropping/capping gameplay time, render consistent snapshots.
            Evidence: npm test -- tests/browser; compare controlled frame partitions, lock/repeat equal-time boundaries and delayed frames, plus engine regressions and npm run typecheck/build.
        - [ ] T-014 — Complete pause, focus, restart input cleanup, and disposal
            Scope: src/browser/controller.ts/input.ts and focused controller/lifecycle tests.
            Depends on: T-013. Contracts: lifecycle/focus/resource obligations in S7; A8–A10.
            Outcome: Space pause/resume, blur/hidden pause with manual return, held-state/repeat cleanup at all required transitions, no Space hold toggle, clock rebasing without inactive-time replay, safe repeatable disposal.
            Evidence: npm test -- tests/browser; controlled pause/focus/visibility/restart/game-over transitions, no stale command/time leakage, no events/frames after disposal; npm run typecheck/build.
        - [ ] T-015 — Verify complete controls and lifecycle in the real browser
            Scope: tests/e2e controls/lifecycle scenarios, targeted integration repairs, current README/AGENTS behavior/check notes.
            Depends on: T-014. Contracts: S7; A8–A9 and disposal integration in A10.
            Outcome: real key handling/default suppression, sustained/opposing movement, pause/focus and restart are verified against the built working game; retain engine/control separation and earlier play path.
            Evidence: npm run test:e2e with focused scenarios and recorded actual engine versions; browser demonstration of hold/release, inactive wait, explicit resume and clean restart. Unit/type/build regressions pass. Missing required target evidence remains visible for 1.4 completion.
        - [ ] T-016 — Review, test, and report milestone 1.3
            Depends on: T-012–T-015 complete and published; earlier delivery milestones complete/closed if hosted.
            Scope: browser timing/input/lifecycle code and engine interactions; functional/usability demonstration and regression checks; required blocker repairs.
            Evidence: milestone 1.3 exits and applicable A8–A10 pass; code review distinct from tests; report published; hosted closure reconciled if active.
            Report: docs/dev/reports/phases/1/1.3.md; include implemented features, usability/risk observations, Findings/Blockers and TODO.
    - [ ] Milestone 1.4 — Desktop presentation and delivery
        - [ ] T-017 — Complete responsive square-cell and high-DPI rendering
            Scope: src/browser/renderer.ts, styles and relevant view integration; focused tests/browser and tests/e2e visual/resize checks.
            Depends on: T-016. Contracts: rendering/size obligations of S8/A10.
            Outcome: full board/preview remain correctly scaled, sharp and unclipped at 1024 × 768 and larger/resized desktop viewports; occupied geometry matches snapshots.
            Evidence: browser screenshots/inspection and geometric assertions at minimum/resized viewports and device pixel ratios, renderer unit checks where meaningful, npm run typecheck/build. Record actual observations rather than claiming visual correctness from build success.
        - [ ] T-018 — Complete accessible status, controls, and user instructions
            Scope: index.html, src/browser/view.ts/styles, README controls, tests/browser/view.test.ts and browser accessibility checks.
            Depends on: T-017. Contracts: textual/status/accessibility obligations in S8/A10.
            Outcome: all statistics/status/instructions are readable and consistent; Restart is focusable/named and operates from keyboard; game-over/paused state is explicit without relying on Canvas interpretation.
            Evidence: focused view tests, keyboard/accessible-name browser checks, visible status in all lifecycle states, layout inspection and npm run typecheck/build.
        - [ ] T-019 — Establish supported-browser and production-static acceptance
            Scope: tests/e2e, Playwright/static-server configuration, dependency/browser evidence, targeted repairs to app integration.
            Depends on: T-018. Contracts: S8/A10–A11 and complete baseline browser regression.
            Outcome: production output is served without a backend and verified against accepted current-stable desktop Chromium/Firefox targets; record versions, method and availability. A different bundled engine is not silently presented as the accepted target.
            Evidence: npm run build and npm run test:e2e against static production output; full control/lifecycle/rendering smoke and required browser acceptance. Required browser/version/access gaps block completion until resolved under accepted scope.
        - [ ] T-020 — Verify reproducible delivery and finalize setup/API documentation
            Scope: package/lock/scripts where needed, README/AGENTS, source API/docstrings, and clean build/check workflow.
            Depends on: T-019. Contracts: S6/S8/A11; delivery/documentation exits in PLAN.
            Outcome: current documented install/dev/build/preview/type/unit/e2e commands work; lockfile pins reproducible setup; generated outputs and secrets are ignored; disclosure/demo-context statements remain accurate. Support Windows CMD instructions without PowerShell requirements.
            Evidence: npm ci, npm run typecheck, npm test, npm run build and required browser checks using documented commands; inspect engine/browser API documentation and local links. Record environment-specific setup limits and do not modify the user's preconfigured Python environment.
        - [ ] T-021 — Review, test, and report milestone 1.4
            Depends on: T-017–T-020 complete and published; earlier delivery milestones complete/closed if hosted.
            Scope: complete desktop/static baseline, supported-browser evidence, packaging/documentation and regressions; code review and required repairs.
            Evidence: milestone 1.4 exits, full applicable unit/type/build/browser checks and visual inspection pass; report committed/pushed; managed task/milestone closure confirmed if active.
            Report: docs/dev/reports/phases/1/1.4.md; include implemented features, delivery/browser limits, Findings/Blockers and TODO.
    - [ ] Milestone 1.5 — Phase review
        - [ ] T-022 — Review, test, and report phase 1 and baseline completion
            Depends on: all delivery milestones 1.1–1.4 complete, reviewed, published, and closed if hosted; not on closure of its own 1.5 milestone.
            Scope: cross-milestone code/dependency review, S1–S8/A1–A11 acceptance and regressions, all required repairs, current docs, and aggregation of unresolved/deferred findings with options and provenance.
            Evidence: full unit/type/build/static/browser/visual acceptance, complete code review and no required blocker; phase and final reports committed/pushed, review issue/1.5 milestone closure read back if active. Then reconcile phase parent, explicitly merge full verified phase into main, verify merged state, push target and confirm remote containment under SDD Manager's integration procedure. Do not claim baseline completion from phase-branch publication alone.
            Reports: docs/dev/reports/phases/1/PHASE-REPORT.md and docs/dev/reports/IMPLEMENTATION-REPORT.md; concise delivered features, precise checks/results/limits, Findings/Blockers, and final TODO aggregation (None if empty).

## Progress and stopping boundary

Milestone 1.1 implementation is active; verified task checkboxes and task commits are the current progress authority. The accepted full-phase range controls execution; review tasks count toward next-N ranges. Partial ranges publish and pause on the phase branch. Full phase execution includes T-022's integration/publication boundary; it does not start the separate modern-feature campaign automatically.
