# Phase 1 — Baseline browser game

T-022 reviews the full accepted T-001–T-022 scope on phase/1-baseline-browser-game, starting from published preparation merge b3b3bfcba9fef0e67a45221049073743e6ed9caf. Delivery reviews/closures 1.1–1.4 are complete through bc12f5b; production source is 4b65a9d plus verification-only T-022 scenarios. Review date: 2026-10-09.

## Delivered capability and code review

The complete classic desktop baseline is implemented: 10 × 20 board, seven tetrominoes, independent active/next selection, collision-safe movement/clockwise rotation, soft drop, chronological fractional gravity, a full independent grounded lock interval, simultaneous row clearing, pre-clear-level scoring, progression, spawn top-out, pause/resume/restart and detached snapshots. Browser control adds defined hold repeat/priority, timer-before-command order, manual focus return and disposal. Canvas/HTML presentation provides responsive/DPI geometry, preview, statistics, explicit lifecycle labels, instructions and named keyboard Restart.

Inline code review covered all engine/browser modules, composition, toolchain/lockfile, test boundaries and documentation. Cross-milestone checks focused on level changes during lock/spawn, pause/repeat remainders, game-over cleanup, rendering after restart/top-out and static browser delivery. Rule ownership remains in the engine; no browser component stores competing gameplay state. No production state-loading hook exists. The complete branch delta contains authorized baseline work; accepted design/SPEC/PLAN/layout are unchanged from preparation, and TASKS retains its accepted hierarchy/contracts with status/evidence updates. No prior closed campaign record was altered.

## Acceptance evidence

| Conditions | Evidence |
| --- | --- |
| A1–A2 geometry/collision/selection | Engine pieces/board/random/game suites: seven definitions, rotations, bounds, independent draws and restart order. |
| A3–A4 chronological gravity/grounded lock | Timing/boundary/controller suites: residual elapsed, full late landing delay, no grounded reset, airborne cancellation, ties, fractional partitions and new-spawn timers. |
| A5 clearing/score/progression | Board/progression/session scenarios: 1–4-row compaction/awards, pre-clear level, successful drop points, thresholds/floor; native Firefox clears two rows and displays Lines 2/Score 390. |
| A6–A7 lifecycle/API/isolation | Lifecycle/game suites: post-clear obstruction, paused/game-over rejection, fresh restart, invalid elapsed atomicity and retained/mutable detached snapshots. |
| A8–A9 controls/focus | Input/controller and production browser suites: repeat/priority/release, default suppression, Space hold, inactive wait/manual resume, native Firefox tab blur/visibility. |
| A10 presentation/disposal | Renderer/view/controller and browser tests: all 200 cells/preview/statistics, keyboard Restart, explicit states, square backing at fractional sizes, no event/frame effects after disposal. |
| A11 static/compatible delivery | Strict typecheck/build, browser-free engine tests, production static serving and official stable desktop engines in headless Linux automation. |

Final working-branch checks: npm test passed 57 tests (39 engine, 18 browser; 12 suites); npm run typecheck/build passed. npm run test:e2e:stable passed seven Playwright production checks on official Stable Chromium 155.0.8059.39 headless desktop engine, and two unpatched Mozilla Firefox 157.0.1/geckodriver 0.37.1 sessions including native row clear, keys, tab visibility, top-out, rotation/lock/spawn and DPR 1/2 desktop resize. Minimum/resized screenshots and native row-clear screenshot were inspected. T-020's clean npm ci and 14 standard Playwright checks remain valid for unchanged production/control suites. Formatting-only final test changes preserve the checked behavior; merged-state checks are additionally required by integration.

## Findings and rechecks

M1.2-01 (early timer tolerance), M1.4-01 (fractional-axis backing rounding) and M1.4-02 (Firefox fixture capture/realm) are resolved with behavioral regressions and dependent checks; see the milestone reports. P1-01 strengthened direct evidence for a level transition *inside* a partitioned elapsed update: the final test crosses 8→10 lines, verifies level-2 successor gravity and continued remainder equivalence. Existing production behavior passes; no engine repair was necessary. A native-key built-page row-clear scenario further strengthens integrated evidence. No unresolved required defect or missing accepted-target evidence remains.

## Delivery and integration boundary

Per-task commits and reports are published on the retained phase branch; managed issues/milestones are reconciled after their verified results. This report establishes phase acceptance before target integration. T-022 then closes its review issue/milestone, reconciles parents, explicitly merges the pinned phase tip into refreshed main, verifies the merged state, publishes main and confirms remote containment. The explicit merge commit records both parent tips and actual merged checks; this report alone is not a claim that publication already occurred.

Chromium acceptance uses Google's official current-Stable headless desktop engine because full Chrome's Unix-socket ProcessSingleton is unavailable in the sandbox. Chrome browser UI/graphical OS focus is not claimed. Native Firefox tab switching verifies real focus/visibility transitions. External browser provisioning and process-scoped recovery are documented in README. Requested ChatGPT Work/model context is disclosed without independently attesting the active model.

## Findings / Blockers

None unresolved. All required phase acceptance conditions and final target integration/publication are verified; see the integration recheck below.

## TODO

None. Milestone 1.1–1.4 TODO sections are empty; resolved IDs/provenance are retained above. Modern features are outside this baseline, not deferred required defects. Stop after verified main publication; do not start their separate campaign automatically.

## Integration recheck — 2026-10-09

The preintegration review above is retained as the acceptance history. Explicit two-parent merge [29d247b](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Work-TS/commit/29d247b742885d225fa71fedeb2c60aeeaa8a935) integrated the complete phase into actual main without conflicts. Its first parent is preparation/main b3b3bfcba9fef0e67a45221049073743e6ed9caf; its second parent is verified phase tip efc625a6254a3222383cdd6fba78082bbf723b82. The phase branch is retained.

On the prospective merged tree, npm test passed all 57 tests in 12 suites; npm run typecheck and npm run build passed; npm run test:e2e:stable passed seven Chromium production checks and two native Firefox sessions. These are the same documented headless desktop methods and limits described above. No source changes followed those merged checks.

The merge was committed and pushed to main; GitHub's main reference was read back as 29d247b742885d225fa71fedeb2c60aeeaa8a935. All 22 managed tasks and five milestones are closed with verified evidence. This documentation follow-up records the publication receipt under T-022. Baseline workflow complete; remaining work: None. The separate modern-feature campaign remains unstarted.
