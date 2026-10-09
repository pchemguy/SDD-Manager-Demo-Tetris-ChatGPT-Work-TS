# Baseline delivery plan

## Objective and readiness

Deliver the complete accepted baseline in [SPEC](SPEC.md), following [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). [PROJECT](PROJECT.md) establishes demonstration context and non-goals. The specification was accepted by the user on 2026-10-09; its [conformance review](SPEC-REVIEW-REPORT.md) is the planning prerequisite.

This is a proposed delivery strategy awaiting acceptance. It contains capability outcomes and verification boundaries, not executable tasks or implementation status. [Physical layout](layout.md) assigns the corresponding source, check, and artifact ownership.

## Strategy

One baseline phase delivers a playable end-to-end slice first, grows it through progression and complete browser control, and concludes with desktop compatibility and delivery evidence. Each increment keeps the earlier game path working. Full SPEC remains authoritative; milestone deferrals restrict the increment, not the final requirements.

The earliest useful result is a real browser game in milestone 1.1: pieces spawn, move, rotate, descend, lock after a full grounded interval, clear rows, eventually top out, and restart. A standalone skeleton or engine-only simulation does not meet that exit. The minimal TypeScript/static-app/test setup is a prerequisite within this milestone, not an earlier infrastructure-only milestone.

Modern features have no implementation scope in this plan. After baseline integration and acceptance, their separate feature campaign prepares its own deltas and execution boundaries.

## Phase 1 — Baseline browser game

Outcome: a complete playable baseline, documented and verified against S1–S8/A1–A11. No prior implementation phase is required. Four delivery milestones precede one dedicated final phase review milestone.

| Milestone | Outcome and scope | Dependency | Objective exit evidence |
| --- | --- | --- | --- |
| 1.1 — Playable end-to-end core | Static TypeScript application and deterministic engine checks; all piece geometry, independent active/next selection, collisions, clockwise rotation, gravity, full-interval grounded lock, simultaneous row clearing, spawn top-out, restart, isolated snapshots; Canvas board and HTML preview/status; discrete arrow controls. Show level-1 scoring and statistics with progression deferred. | Accepted preparation integrated and published; eligible phase activated; minimum app/test setup. | Browser play demonstrates spawn → move/rotate/drop → lock → row-clear/new spawn → game over/restart. Engine evidence covers geometry, selection, lock timing, collision, row compaction, snapshots, and residual elapsed time. Static app loads; discrete controls and visible state agree. Milestone code review, regressions, blocker repair, and committed report complete. |
| 1.2 — Progression and complete engine contracts | Exact soft-drop/line scores, level thresholds and gravity progression; complete pause/resume/restart and invalid-time semantics; deterministic edge-case coverage including lock/gravity ties, airborne cancellation, post-clear spawn obstruction, and partitioning across spawns and level changes. | 1.1 complete and reviewed. | S1–S6/A1–A7 pass deterministic checks; a running browser session visibly reflects engine progression and lifecycle state. Earlier play path still works. Milestone code review/testing/repair/report complete. |
| 1.3 — Complete browser controls and lifecycle | Defined key repeat, opposing-key priority, timer/command ordering, Space pause, focus/visibility pause, held-input cleanup, frame rebasing, and safe disposal. | 1.2 complete and reviewed. | S7/A8–A9 plus disposal obligations in A10 pass controlled controller checks and browser integration. Pause/resume excludes inactive time; stalls process foreground elapsed time; restart/focus transitions cannot leak held controls. Relevant engine/browser regressions pass. Milestone code review/testing/repair/report complete. |
| 1.4 — Desktop presentation and delivery | Complete textual status/instructions, accessible Restart, square-cell responsive/high-DPI Canvas, static build/serve, user/setup documentation, and supported-browser evidence. | 1.3 complete and reviewed. | S8/A10–A11 pass at the specified desktop minimum and resized/high-DPI configurations. Verify accepted browser targets, production static output, controls and lifecycle in the built app, and current README commands. Full baseline regression suite passes. Milestone code review/testing/repair/report complete. |
| 1.5 — Phase review | One final phase code review/testing/report outcome, including the final baseline implementation report and TODO aggregation. No additional delivery capability. | Every delivery milestone 1.1–1.4 is complete; all corresponding hosted milestones closed if tracking is active. | Cross-milestone code review, all applicable A1–A11 checks, build/type checks and browser evidence pass; blockers repaired; phase/final reports committed and pushed; review issue/milestone reconciled if active. Explicit integration, merged-state checks, target publication and remote containment establish the completed baseline boundary. |

### MVP inclusions and deferrals

Milestone 1.1 uses the real engine and full lock-delay rule from the start. Its provisional progression remains at level 1 with level-1 score awards. Level changes and full numeric/error/lifecycle edge-case acceptance belong to 1.2. Held-key repeat, pause/focus behavior, and scheduling/disposal completeness belong to 1.3. Full resize/device-ratio/accessibility/browser-target/documentation evidence belongs to 1.4. These deferrals must be visible in checkpoint reports; 1.1 cannot claim complete baseline acceptance.

### Demonstrations and human decisions

At 1.1, demonstrate actual play and record whether board readability, movement, and the full grounded interval produce a useful playable slice. At 1.3, demonstrate repeat, pause/focus, and restart behavior and expose usability concerns or temporal defects. At 1.4, show the finished desktop interface and supported-browser evidence. These results inform the human's continue/amend/simplify/stop decision. Routine progression within an explicitly authorized range requires no repeated approval; amendments and continuation beyond the selected boundary remain human-directed.

## Verification and delivery gates

Establish engine checks with controlled randomness and explicit time alongside the first slice. Add focused regressions with each capability. Engine tests must not depend on browser globals; controller checks control clock/event inputs; actual browser checks cover visible integration and rendering. Boundary tests must distinguish full delay from a remaining gravity tick and test grounded movement, blocked soft drop, airborne cancellation, and equal-time ordering. Avoid redundant test layers that assert the same internal implementation.

Use TypeScript strict checking, a static browser build, an engine/controller unit runner, and browser automation where available. The intended toolchain is TypeScript/Vite, Vitest, and Playwright; choose compatible pinned versions and record them during implementation after checking official package requirements. No dependencies are installed during preparation. Node and npm are available in the sandbox; dependency and browser availability still require execution evidence.

Every delivery milestone ends with a separate code review/testing/report task derived by TASKS. Passing tests alone does not complete code review. Repair bugs and SPEC/PLAN violations before closure. Each report lists findings/blockers and a TODO section (None when empty); only non-critical contract-consistent code findings may be deferred with evidence, rationale, options, and follow-up ownership. The final report aggregates unresolved/deferred milestone and phase TODOs with provenance.

Phase exits require the complete baseline, current documentation, demonstrated production build, supported-browser evidence, and no unresolved required blocker. Phase 1.5 begins after delivery reviews and closures, not before. Its single task also produces the full task-list final report. Missing required browser evidence is a blocker, not a passed compatibility claim.

## Git and hosted coordination

Preparation stays on `design-docs/main` until accepted preparation and required QC are committed and pushed. Before implementation, explicitly merge that accepted tip into the repository's actual default branch (`main`, confirmed by remote evidence), verify and publish the two-parent preparation merge, then create `phase/1-baseline-browser-game` from that published checkpoint. Retain design-docs; it is not the implementation branch.

Tasks commit/push evidence on the phase branch. A partial range pauses there. Full verified phase completion permits one explicit merge to main, merged-state verification, publication, and remote containment confirmation. Do not merge partial milestone work automatically or create another phase to evade a blocker.

Git publication is authorized by the user. GitHub issue/label/milestone tracking is recommended for this demonstration but confirmation is pending; no hosted objects have been created. If confirmed, activate only eligible Phase 1 before its first task: create its phase label, all five milestones, and every derived task issue with its phase/milestone associations. Close/read back tasks and milestones only after local verification/commit/publication evidence. If tracking is declined, preserve identical local review/report gates. Confirm the choice before phase activation; a token alone is not recorded as activation.

## Risks and decision boundaries

- Chronological gravity/lock/key-repeat ordering is the principal correctness risk. Deterministic partition/boundary checks must exist before dependent control complexity grows.
- Browser engines/packages may be unavailable under sandbox network restrictions. Verify actual versions and availability early enough to resolve access; record missing evidence and retain a blocked delivery gate rather than substituting a different browser silently.
- Scenarios for line-count thresholds/top-out may require valid deterministic fixtures. Keep fixture construction in tests and avoid a production state-mutation API solely for testing.
- Setup/docs must support ordinary Node/npm use and Windows CMD. Do not hardcode PowerShell launch commands or change the user's preconfigured Python environment.

No unresolved product requirement is delegated to TASKS. PLAN/layout acceptance, hosted-tracking choice, executable-range selection, and concrete toolchain/browser availability remain their respective preparation/execution gates.
