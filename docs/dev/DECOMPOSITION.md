# Component decomposition

## Scope

This document refines the [architecture](ARCHITECTURE.md) into logical responsibilities. It is not a source-file inventory or delivery checklist. Components may be cohesive functions or data types; separate classes are not required.

## Game engine

| Component | Responsibility | Dependencies and verification seam |
| --- | --- | --- |
| Board operations | Occupied cells, bounds/collision queries, placement, complete-row removal | Piece geometry; explicit board scenarios |
| Piece geometry | Seven tetromino definitions, clockwise orientations, positioned occupied cells | No browser dependency; geometry consumed by collision and views |
| Piece selection | Instance-private lazy seven-bag shuffle, forward draws and reset | Conforming supplied source; exact draw count/permutation/consumption checks |
| Placement queries | First-obstruction landing and first-fitting horizontal clockwise candidate | Existing board/geometry; pure inputs and detached candidate, no rule state |
| Session rules | Active/next/held pieces, hold availability, movement/kicks/drop decisions, spawn, lock and game-over transitions | Board, geometry, selection; commands and read-only session view |
| Timing | Gravity accumulation, grounded interval, chronological advancement | Session transitions and supplied elapsed time; deterministic boundary checks |
| Progression | Score, cleared lines, level, gravity interval | Row-clear results; precise values owned by SPEC |

Session rules coordinate board, selection, timing, and progression. Timing and progression may be internal functions rather than independently stateful objects. One engine owns mutable session state; components cannot maintain competing copies.

Commands express left/right movement, clockwise horizontal kicks, soft/hard drop, hold, pause/resume, and restart. SPEC owns exact return values and rejected-command behavior. The view exposes occupied cells, active/ghost geometry, next/held kinds and availability, statistics, and lifecycle status without exposing mutable internals.

Restart clears timing/hold and discards unused bag kinds without rewinding its source, then establishes a fresh session. Pause prevents advancement. Game over prevents active play until restart. These transitions are observable and independently verifiable.

## Browser controller

Input normalizes one-shot letter keys and tracks arrow repeat deadlines. Controller maps accepted key/button events to commands and owns the separate P latch through its own pause transition. Running hold/drop retain arrow deadlines; inactive/top-out/focus/restart transitions clear them. Scheduling supplies elapsed gameplay time. Focus handling pauses the session and clears held-input state. Lifecycle coordination prevents stale elapsed time or held keys after pause, resume, or restart. Disposal releases browser subscriptions.

The controller consumes engine commands/views and presentation entry points. It owns neither board state nor score. SPEC defines repeat cadence and simultaneous-input policy.

## Presentation

The board renderer draws locked cells, outlined ghost and solid active piece in order, plus canonical next/held canvases from a detached view. The status/controls view updates HTML statistics, next/held kind/empty/availability labels, pause/game-over status, instructions and keyboard Restart controls. Presentation does not mutate the engine or maintain a separate gameplay state.

## Verification and contract refinements

Board/geometry scenarios verify collisions and clearing. Controlled commands/time verify transitions and full-interval locking. Supplied randomness makes selection deterministic. Browser scenarios verify input, visible state, focus pause, and restart.

[SPEC](SPEC.md) settles geometry, shuffle/reset/hold draw effects, projection/drop/kick policies, gravity/progression, spawn/top-out, equal-time ordering, snapshots, repeat/latches and resource cleanup. These refine behavior within the component arrangement.
