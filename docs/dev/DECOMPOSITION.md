# Component decomposition

## Scope

This document refines the [architecture](ARCHITECTURE.md) into logical responsibilities. It is not a source-file inventory or delivery checklist. Components may be cohesive functions or data types; separate classes are not required.

## Game engine

| Component | Responsibility | Dependencies and verification seam |
| --- | --- | --- |
| Board operations | Occupied cells, bounds/collision queries, placement, complete-row removal | Piece geometry; explicit board scenarios |
| Piece geometry | Seven tetromino definitions, clockwise orientations, positioned occupied cells | No browser dependency; geometry consumed by collision and views |
| Piece selection | Independent random selection and next-piece preparation | Supplied random source; reproducible selection |
| Session rules | Active/next pieces, movement/rotation decisions, spawn, lock, game-over transitions | Board, geometry, selection; commands and read-only session view |
| Timing | Gravity accumulation, grounded interval, chronological advancement | Session transitions and supplied elapsed time; deterministic boundary checks |
| Progression | Score, cleared lines, level, gravity interval | Row-clear results; precise values owned by SPEC |

Session rules coordinate board, selection, timing, and progression. Timing and progression may be internal functions rather than independently stateful objects. One engine owns mutable session state; components cannot maintain competing copies.

Commands express left/right movement, clockwise rotation, soft drop, pause/resume, and restart. SPEC owns exact return values and rejected-command behavior. The view exposes occupied cells, active geometry, next piece, statistics, and lifecycle status without exposing mutable internals.

Restart clears timing and establishes a fresh session. Pause prevents advancement. Game over prevents active play until restart. These transitions are observable and independently verifiable.

## Browser controller

Input maps accepted key/button events to commands. Scheduling supplies elapsed gameplay time. Focus handling pauses the session and clears held-input state. Lifecycle coordination prevents stale elapsed time or held keys after pause, resume, or restart. Disposal releases browser subscriptions.

The controller consumes engine commands/views and presentation entry points. It owns neither board state nor score. SPEC defines repeat cadence and simultaneous-input policy.

## Presentation

The board renderer draws cells and the active piece in Canvas from a view. The status/controls view updates HTML statistics, preview, pause/game-over status, and restart controls. Presentation does not mutate the engine or maintain a separate gameplay state.

## Verification and contract refinements

Board/geometry scenarios verify collisions and clearing. Controlled commands/time verify transitions and full-interval locking. Supplied randomness makes selection deterministic. Browser scenarios verify input, visible state, focus pause, and restart.

SPEC must settle initial gravity and progression formula, score awards, spawn positions and top-out rules, ordering at equal timer boundaries, input repeat, and restart/random-source semantics. These refine behavior within the accepted component arrangement.
