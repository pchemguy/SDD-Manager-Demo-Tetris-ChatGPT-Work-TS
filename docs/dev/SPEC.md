# Baseline Tetris specification

## Scope and authority

This specification defines the complete baseline browser game described in [PROJECT](PROJECT.md), using the boundaries in [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). It is independently readable as the behavioral contract for construction from scratch.

The design and specification refinements are accepted by the user. This specification owns the baseline behavioral contracts. Acceptance and conformance readiness do not independently authorize implementation.

The game is single-player, desktop, and keyboard operated. Hold, ghost projection, seven-bag selection, wall kicks, and hard drop are reserved for a subsequent feature campaign. Multiplayer, accounts, backend storage, leaderboards, touch controls, audio, and persisted high scores are outside this baseline. No exact commercial-standard conformance is claimed.

## S1 — Board and geometry

The playable board contains 10 columns and 20 rows. Coordinates use x = 0..9 left to right and y = 0..19 top to bottom. Board cells are empty or contain a locked piece kind. The active piece is separate from locked cells. Every active occupied cell must be in bounds and disjoint from locked cells. There are no hidden rows or negative-y occupied cells.

The kinds, selection order, local matrix size, and initial occupied coordinates are:

| Kind | Matrix size | Spawn-orientation cells (x, y) |
| --- | --- | --- |
| I | 4 × 4 | (0,1), (1,1), (2,1), (3,1) |
| O | 2 × 2 | (0,0), (1,0), (0,1), (1,1) |
| T | 3 × 3 | (1,0), (0,1), (1,1), (2,1) |
| S | 3 × 3 | (1,0), (2,0), (0,1), (1,1) |
| Z | 3 × 3 | (0,0), (1,0), (1,1), (2,1) |
| J | 3 × 3 | (0,0), (0,1), (1,1), (2,1) |
| L | 3 × 3 | (2,0), (0,1), (1,1), (2,1) |

Each piece spawns in this orientation with its matrix origin at x = floor((10 - size)/2), y = 0. Clockwise rotation maps each occupied local cell to (size - 1 - y, x); O remains unchanged. Four rotations restore each kind's initial geometry. Empty matrix cells do not collide. Rotation does not translate the matrix origin, and there are no wall kicks.

## S2 — Selection and lifecycle

A new game immediately starts in `running` state with an empty board, score 0, cleared lines 0, level 1, one active piece, and one next piece. Each selection independently maps a random value r in [0,1) to index floor(7*r) in the S1 order. Repeated kinds are permitted. Initialization draws the active kind first, then next. Each successful post-lock spawn promotes next and draws one replacement next.

Restart from any lifecycle state clears board, statistics, active/next state, held inputs, and gameplay timers, then initializes a running game with two fresh draws. It uses the current supplied random source; it does not rewind that source. It is the only baseline action that resets accumulated progress.

If the initial or post-lock spawn cannot place all occupied cells, state becomes `gameOver`, the active piece is absent, and locked board/statistics remain visible. The blocked next kind remains visible without drawing a replacement. No movement, rotation, soft drop, or elapsed-time update changes a game-over session. Restart remains available.

Pause changes running to `paused`. Resume changes paused to running and preserves all gameplay state and timer remainders. Pause/resume are ineffective in game over. Paused sessions ignore movement, rotation, soft drop, and elapsed gameplay time. Restart always starts running.

## S3 — Movement and input actions

Left/right attempt exactly one column of movement. Soft drop attempts exactly one row downward. Clockwise rotation attempts one orientation change. A valid attempt takes effect atomically; a collision or out-of-bounds attempt leaves geometry, score, and timer state unchanged. An O rotation changes no geometry or timer. Movement and drop do not rotate pieces.

Each successful soft-drop row adds 1 point. Blocked soft drop adds no points and cannot force a lock. Gravity descent adds no points. Soft drop does not reset gravity accumulation.

## S4 — Gravity and grounded locking

Level L has gravity interval G(L) = max(100, 1000 * 0.8^(L - 1)) milliseconds. Fractional values are retained; durations are not rounded to frame counts. A newly spawned piece begins with gravity age 0. While running, each gravity event attempts one row downward. An event consumes one interval whether the descent succeeds or is blocked; surplus elapsed time is retained and processed chronologically.

A piece is grounded whenever a one-row downward attempt would collide. Grounding is evaluated immediately after spawning and every successful translation or rotation. On transition from airborne to grounded, its lock countdown starts at the current level's full G(L), independently of the remaining gravity age. A piece grounded at spawn also gets this full interval. Movement/rotation that leaves it grounded retains the countdown. Becoming airborne cancels the countdown; subsequent grounding starts a new full interval. Rejected actions cannot start, reset, or cancel it.

When the countdown expires, the piece locks. If gravity and lock expiry occur at the same instant, locking occurs first. Locking, clearing, progression, game-over detection, and a possible new spawn occur before later events. A newly spawned piece starts fresh timers; residual elapsed time in the same update may advance it. Engine updates must produce equivalent gameplay state for one elapsed-time interval or its partition into smaller intervals when no intervening command occurs, allowing ordinary floating-point tolerance in timer comparisons.

Commands are instantaneous at the current gameplay time. For a command scheduled at an elapsed-time boundary, advance engine timers to that time first, then apply the command. Paused/unfocused wall time never contributes. Neither fast rendering nor repeated blocked soft drops shorten the full grounded interval.

## S5 — Lock, line clearing, score, and level

Locking transfers the active piece's four cells to the board exactly once. All complete rows are removed simultaneously. Remaining rows retain their relative order and shift downward; empty rows fill the top. Progress is updated before the next spawn.

| Rows cleared by one lock | Base points |
| --- | --- |
| 0 | 0 |
| 1 | 100 |
| 2 | 300 |
| 3 | 500 |
| 4 | 800 |

Line-clear points equal base points multiplied by the level immediately before this clear. Total cleared lines increases by the cleared-row count. Level then becomes 1 + floor(total cleared lines / 10). The next piece uses the resulting gravity interval. There are no combo, back-to-back, spin, or perfect-clear bonuses. Existing soft-drop points are retained.

Top-out is evaluated by the next spawn after row removal; filling a top-row cell alone does not end the game if the spawn still fits.

## S6 — Engine boundary and data contracts

The engine is usable without browser globals or real timers. It accepts a supplied random function, synchronous gameplay commands, and explicit nonnegative finite elapsed milliseconds. The production default random source may be Math.random. Callers supplying randomness must return finite values in [0,1); reproducibility is guaranteed for conforming sources and identical command/time sequences.

The engine provides these logical operations; concrete exported TypeScript names are chosen consistently during implementation:

- Create a fresh session with an optional random source.
- Apply `left`, `right`, `rotateClockwise`, `softDrop`, `pause`, `resume`, or `restart`.
- Advance elapsed gameplay time.
- Obtain a snapshot.

Command application reports whether observable state changed; rejected or ineffective commands report false. Restart reports true even if its fresh visible state matches a former state. Timer advancement has no required return value. Invalid elapsed time raises RangeError before mutation in every lifecycle state. A zero update does not advance timers. Out-of-domain random sources and impossible typed command values are caller contract violations, not supported gameplay inputs.

Snapshots contain lifecycle status, 20 × 10 board cells, active kind/origin/orientation/occupied coordinates or null, next kind, score, total lines, level, and current gravity interval. Consumers cannot mutate the engine through any snapshot array or object, and retained snapshots remain unchanged after later engine updates. Timer internals need not be public.

Board/geometry/session/timing/progression own S1–S5. Selection owns S2 random mapping. Browser control consumes these operations; presentation consumes snapshots. No browser component may maintain a competing score, collision rule, or game state.

## S7 — Browser controls and time

The page loads directly into a running game. ArrowLeft/ArrowRight move, ArrowUp rotates clockwise, ArrowDown soft-drops, and Space toggles running/paused. An HTML Restart button invokes restart. Native key-repeat events do not drive gameplay.

Left/right/down act once on initial keydown. Held horizontal movement first repeats after 150 ms and then every 50 ms. Held down repeats after 50 ms and then every 50 ms. ArrowUp and Space act only on initial keydown and require release before another action. With both horizontal keys held, the most recently pressed takes priority; releasing it reactivates the other key with a fresh 150 ms repeat delay and no immediate move. At coincident repeats, horizontal movement precedes soft drop. The controller advances engine time before applying scheduled repeat actions, according to S4.

Recognized game keys suppress scrolling/default actions. Keyup clears the relevant held state. Pause, resume, restart, game over, loss of focus, and hidden-document transitions clear held controls. Controls clear their old repeat schedules and require a fresh keydown after these boundaries. Space release is recognized across pause so holding Space cannot immediately resume.

Window blur or a hidden document pauses a running session. Returning focus does not resume automatically. Space explicitly resumes. The frame clock is rebased after resume and restart so elapsed time from those boundaries is not replayed. Foreground frame delays are processed as elapsed gameplay time rather than discarded or silently capped. Controller scheduling must preserve S4's chronological timer/command order.

Disposal removes event subscriptions and cancels animation scheduling. Repeated disposal is safe. No engine updates occur after disposal.

## S8 — Presentation and compatibility

The page visibly shows all 200 board cells, active piece, one-piece preview, score, total cleared lines, level, lifecycle status, control instructions, and Restart. Kind colors distinguish pieces; visible geometry and statistics match the current snapshot. Paused and game-over states have explicit readable labels. The active piece is absent in game over. Restart is keyboard-focusable with an accessible name, and textual statistics do not require interpreting Canvas pixels.

Canvas scales sharply for device pixel ratio and resizing while preserving square cells and the full board. Layout supports desktop viewports of at least 1024 × 768 CSS pixels without clipping the board or controls. Supported browser targets are current stable desktop Chromium and Firefox at implementation verification time. The app runs client-side from a static HTTP server without an application backend. This specification does not select dependency versions or physical source paths.

## Acceptance

| ID | Observable evidence |
| --- | --- |
| A1 | Each kind spawns as S1 defines; four rotations restore geometry; bounds/collision rejection preserves state; O rotation is stable. |
| A2 | Controlled random values select the expected kinds, including repeated kinds; active/next draw order and fresh restart draws match S2. |
| A3 | Gravity moves exactly at its interval, preserves residual time, and remains equivalent under elapsed-time partitioning across locks/spawns. |
| A4 | Newly grounded pieces survive just below G and lock at G; late-in-cycle landing still gets G; grounded motion and blocked down do not refresh/shorten it; becoming airborne cancels it. |
| A5 | Single through four simultaneous row clears preserve remaining row order, award S5 points, and update level at line-count boundaries; soft drop scores only successful rows. |
| A6 | Spawn obstruction after clearing ends play; game-over and paused sessions reject gameplay; restart resets progress; invalid elapsed input preserves state and raises RangeError. |
| A7 | A retained or modified snapshot cannot change engine state or reflect later updates; equivalent controlled engine sessions are reproducible. |
| A8 | Browser controls/repeat/priority follow S7, recognized keys do not scroll, and held input cannot leak across lifecycle boundaries. |
| A9 | Focus loss/hidden document pauses; foreground return stays paused; explicit resume preserves timer remainders and excludes inactive time. |
| A10 | Board/preview/statistics/status stay consistent, resize preserves the board, Restart is accessible, and disposal stops event/frame effects. |
| A11 | Static serving works in supported browser targets with no application backend; TypeScript engine tests run without browser globals. |

These conditions define required results. PLAN and verification owners select concrete checks and commands. No implementation or browser checks have run at this preparation stage.
