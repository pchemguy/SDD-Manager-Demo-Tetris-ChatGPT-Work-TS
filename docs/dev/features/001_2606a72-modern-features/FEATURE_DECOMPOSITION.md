# Modern-feature component design

> Historical snapshot archived by T-041 on 2026-10-09. Current authority is [main TASKS](../../TASKS.md), [SPEC](../../SPEC.md), [PLAN](../../PLAN.md) and [layout](../../layout.md). Archived checkboxes are not executable owners or current completion claims.

## Scope and decision state

This accepted feature design belongs to [campaign 001_2606a72-modern-features](README.md), based on `2606a7213d4ddcf18497fafabb6cc5c349a26178`. The user accepted the complete proposed design at `a4185c2f586388171c4ef12314fb26e6a83ce8aa` on 2026-10-09. The five capabilities, behavior policies below, and retained full-interval locking rule govern feature specification. Design acceptance does not establish implementation.

The [main architecture](../../ARCHITECTURE.md) remains applicable. The engine owns rules and session state; browser control sends commands and elapsed time; presentation reads detached snapshots. This delta refines the affected [components](../../DECOMPOSITION.md). FEATURE-SPEC will own precise contracts and acceptance; FEATURE-PLAN and layout will own delivery order and physical allocation.

## Accepted behavior

| Capability | Accepted design |
| --- | --- |
| Seven-bag selection | Shuffle the canonical seven kinds using Fisher–Yates and the supplied conforming random source. Consume each bag once before generating another. Retain the one-piece next preview; a fresh session starts a new bag without rewinding the random source. |
| Hold | Store a kind, not its position or orientation. Permit one effective hold per active-piece lifecycle, re-enable after lock and successor spawn. Empty hold promotes next and obtains a replacement; occupied hold swaps kinds without consuming selection. Incoming pieces use canonical spawn geometry and fresh timers. Spawn obstruction ends play. |
| Ghost | Compute the greatest collision-free downward displacement of the active piece. Expose detached landing cells in the snapshot; show an outline beneath the solid active piece. Projection is read-only, consumes no randomness, and is absent when there is no active piece. |
| Wall kicks | For clockwise rotation, test horizontal origin offsets in the order 0, -1, +1, -2, +2; accept the first fitting candidate atomically. Use the existing matrices and orientation rules; O remains ineffective. This project-defined policy adds horizontal wall kicks without vertical floor kicks or a commercial-standard claim. |
| Hard drop | Move directly to the ghost landing and add two points per row moved. It does not lock immediately or repeatedly score an already grounded piece. First landing starts one full current gravity interval; an already running grounded countdown is retained. Movement and rotation remain available during the delay, and becoming airborne cancels it. |
| Keyboard mapping | Retain arrow movement/clockwise rotation/soft drop and existing repeat schedules. Add C for hold and Space for hard drop; use P for pause/resume. Hold, hard drop, rotation, and pause are one-shot actions requiring release; prevent their browser defaults. Restart remains a keyboard-accessible button. |

The project-defined horizontal kick policy keeps rotation deterministic and bounded while preserving the custom locking principle. Space invokes hard drop and P invokes pause/resume. Vertical floor kicks, SRS fidelity, and the baseline Space-pause mapping are outside the accepted feature behavior.

Scoring, progression, line clearing, pause/focus handling, snapshot isolation, chronological time, and supported desktop delivery remain governed by the baseline except for accepted explicit deltas. No added hold/rotation/drop action bypasses timer-before-command ordering. A hold replacement is a different active piece with fresh spawn timers; its availability remains consumed until lock. Successful kicks reconcile grounding through the existing engine rule.

## Component ownership and collaboration

| Component | Feature responsibility | Interface and verification seam |
| --- | --- | --- |
| Piece selection | Own one remaining bag per game and produce successive kinds; reset on fresh session. | Supplied random source and deterministic draws; permutation, rollover, independent sessions, restart, and preview/hold consumption checks. |
| Board and geometry queries | Provide reusable downward landing geometry and fitting rotation candidates. | Pure board/piece inputs; empty/crowded board, occupied-cell collision, wall rejection, kick precedence, and projection immutability. |
| Session rules | Own held kind and availability; coordinate hold spawn/top-out, kick acceptance, and hard-drop displacement/score. | Commands and detached snapshots; blocked/effective actions, empty/full hold, availability through lock, timer retention/cancellation, and rejected inactive commands. |
| Timing and progression | Apply existing chronological timers and line/level scoring with hard-drop row points. | Controlled command/time sequences, late landing, grounded repeat, equal-time boundaries, and partition equivalence through successor pieces. |
| Input and controller | Map new one-shot actions and pause key; preserve repeat priority and timer-before-command ordering. | Controlled events/time plus real keyboard acceptance; held-key suppression and cleanup across focus, pause, restart, and game over. |
| Renderer and HTML view | Draw ghost and held preview; expose held kind/availability text and current controls. | Detached observations, rendering order/pixels, readable status, keyboard Restart, and minimum desktop/DPR geometry. |

Selection's bag and session's hold state belong to the engine instance. Ghost projection and hard drop use one landing calculation so displayed landing and actual drop cannot disagree. Rotation candidate selection shares existing collision queries; the browser cannot choose kicks. The existing `Game.apply`, `advance`, and `snapshot` boundaries remain; commands and snapshot values gain the accepted feature data. No production state-injection hook, plugin framework, global random state, or alternate baseline mode is needed.

Snapshot additions include held kind or null, hold availability, and ghost occupied coordinates or null. They inherit detached-value guarantees. Paused presentation retains the board, ghost, and hold information; game-over presentation retains held/next information and has neither active nor ghost geometry. Restart clears hold and creates fresh selection/session state. FEATURE-SPEC must settle precise failed hold/top-out effects, random draw counts, zero-distance command results, case-insensitive key handling, and all acceptance IDs before dependent planning.

## Design review and next gate

Inspection of the current Game, selection, piece geometry, input, and renderer confirms these changes fit their existing ownership. The bag is the only new selection state; hold is session state; projection is a pure query. Engine/browser dependency direction remains unchanged. No separate architecture overlay is needed. The design introduces no unrelated restructuring or new runtime dependencies.

Design acceptance is established for the hold, shuffle, horizontal-kick, scoring, and control policies. [FEATURE-SPEC](FEATURE-SPEC.md) refines their contracts and acceptance conditions. This review establishes the accepted component arrangement; it does not establish specification readiness, implemented functionality, or browser compatibility.
