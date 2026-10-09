# Tetris specification

## Scope and authority

This specification defines the complete desktop browser game described in [PROJECT](PROJECT.md), using the boundaries in [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). It is independently readable as the behavioral contract for construction from scratch.

The design and specification refinements are accepted by the user. This specification owns all current behavioral contracts, including the accepted modern-feature design and specification. Acceptance and conformance readiness do not independently authorize implementation.

The game is single-player, desktop, and keyboard operated. Seven-bag selection, hold, ghost, horizontal clockwise kicks and delayed hard drop are supported. Multiplayer, accounts, backend storage, leaderboards, touch controls, audio, persistence, expanded queues, counterclockwise rotation, vertical floor kicks and spin/combo bonuses are outside scope. No exact commercial-standard conformance is claimed.

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

Each piece spawns in this orientation with its matrix origin at x = floor((10 - size)/2), y = 0. Clockwise rotation maps each occupied local cell to (size - 1 - y, x); O remains unchanged. Four rotations restore each kind's initial geometry. Empty matrix cells do not collide. Rotation tests the horizontal candidate policy in S3, with no vertical kicks or negative-y occupied cells.

## S2 — Selection and lifecycle

A new game immediately starts running with an empty board, score/lines 0, level 1, one active and one next piece, held kind null and hold unused.

Each game instance owns its selection state. To create a bag, copy the canonical order `[I, O, T, S, Z, J, L]`. For i = 6, 5, …, 1, obtain one conforming random value r, set j = floor((i + 1) * r), and swap elements i and j. Consume the completed array from index 0 through 6. Each bag contains each kind exactly once. Two identical kinds may occur across a bag boundary.

Create a bag lazily whenever another kind is requested and the current bag has no remaining kinds. A shuffle consumes exactly six random values; consuming a prepared kind consumes none. No speculative second bag or extra random value is consumed for rendering, snapshots, rejected commands, or occupied-hold swaps. Callers supply finite values in [0,1); out-of-domain sources remain caller contract violations.

A fresh session discards all remaining bag state, creates a fresh bag, consumes its first kind as active, then its second as next. Restart uses the current random source without rewinding it. A successful post-lock spawn promotes next and requests one replacement next. A blocked post-lock spawn keeps the blocked next kind visible and requests no replacement. S3 specifies hold consumption. Identical source values and command/time sequences produce identical sessions, including bag boundaries; separate games never share bag state.

Restart from any lifecycle state clears board, progress, hold, gameplay timers and browser holds. It discards unused bag kinds, creates a fresh six-draw shuffle and consumes active then next without rewinding the source. It is the only action that resets accumulated progress.

An obstructed post-lock spawn ends play after row removal: active/ghost are absent, locked board/statistics and blocked next remain visible, with no replacement draw. S3 defines hold replacement failure. Game-over sessions reject gameplay/time until Restart.

Pause changes running to paused; resume preserves gameplay and timer remainders. Pause/resume are ineffective in game over. Paused sessions reject movement, rotation, soft/hard drop, hold and elapsed gameplay time. Restart always starts running.

## S3 — Movement and input actions

Left/right attempt exactly one column of movement. Soft drop attempts exactly one row downward. Clockwise rotation attempts one orientation change with the ordered candidate policy below. A valid attempt takes effect atomically; a collision or out-of-bounds attempt leaves geometry, score, and timer state unchanged. An O rotation changes no geometry or timer. Movement and drop do not rotate pieces.

Each successful soft-drop row adds 1 point. Blocked soft drop adds no points and cannot force a lock. Gravity descent adds no points. Soft drop does not reset gravity accumulation.

### Hold and replacement lifecycle

A fresh session has held kind null and hold unused. While running with an active piece and hold unused, `hold` stores the outgoing active kind and consumes hold availability. Stored kinds retain no position, orientation, gravity age, or lock countdown. Progress and locked board do not change.

| Held state before hold | Incoming kind | Next/bag effect |
| --- | --- | --- |
| Empty | The visible next kind | On successful spawn, request one replacement next from S2. |
| Occupied | The stored held kind | Visible next and bag cursor remain unchanged. |

The incoming piece uses S1's canonical spawn origin/orientation, gravity age zero, and no carried lock countdown. Immediately evaluate grounding: a grounded-at-spawn replacement receives the current full G(L). Hold remains consumed for this replacement. It becomes unused only after that piece locks and a successor successfully spawns. Pausing/resuming, moving, rotating, dropping, or becoming airborne does not re-enable hold. Restart clears held state and availability usage.

If incoming spawn is obstructed, the accepted hold still stores the outgoing kind and consumes availability, then enters game over with no active/ghost geometry. Locked board, statistics, and visible next remain unchanged, and no replacement next is requested. For an empty hold, next remains the obstructed incoming kind; for an occupied hold, next remains its unrelated existing kind. Spawn failure does not restore the outgoing piece. Game over still requires restart.

An accepted hold reports true, including a same-kind swap or a replacement ending in game over, because hold state/availability or lifecycle changes. A consumed hold, paused/game-over hold, or hold without active geometry reports false and changes no state, timers, selection, or randomness.

### Clockwise horizontal kicks

For a running non-O active piece, obtain the clockwise orientation using S1 geometry. From the current matrix origin, test horizontal offsets in this exact order: 0, -1, +1, -2, +2. Keep y unchanged for every candidate. Accept the first whose occupied cells are within the board and disjoint from locked cells. Candidate tests do not mutate session state.

Success applies orientation and x atomically, reports true, and reconciles grounding through S4: remaining grounded retains the existing countdown; becoming airborne cancels it; becoming grounded starts a full interval. Gravity age remains unchanged. If every candidate fails, report false with geometry, timers, score, hold, and bag state unchanged. O rotation reports false without testing translations. No vertical kick or hidden-row exception is permitted.

### Landing projection and delayed hard drop

For an active piece, landing displacement d is the largest nonnegative integer such that every occupied cell remains collision-free when translated downward by each integer from 0 through d. Translation by d + 1 fails. Projection keeps kind, x, and orientation unchanged. It queries locked board cells, not the displayed ghost, and changes no session state, timers, selection, or randomness. A grounded piece has d = 0.

`hardDrop` is effective only while running with an active piece and d > 0. Translate y by d atomically, add exactly 2 * d points, and report true. Those points do not depend on level, change line totals, or cause progression. Do not award intermediate soft-drop points. With d = 0 or an inactive/no-active session, return false with no state or timer changes.

Hard drop does not lock, clear rows, spawn, reset gravity age, or consume/re-enable hold. An airborne piece first landing by hard drop starts the current level's complete G(L), irrespective of gravity age. An already grounded piece retains its countdown. Repeated hard-drop commands cannot refresh the countdown or score the same stationary landing again. If intervening movement or a kick makes the piece airborne, a later positive-distance hard drop is a distinct translation and scores its own distance.

The piece remains movable/rotatable/holdable during its delay subject to the hold and kick policies above. S4 chronology is unchanged: a timer expiring at the input boundary is processed before the hard-drop command, so the command may operate on the successor. Only timer expiry locks the piece. At a lock, S5's row removal and line awards apply in addition to accumulated drop points.

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

Line-clear points equal base points multiplied by the level immediately before this clear. Total cleared lines increases by the cleared-row count. Level then becomes 1 + floor(total cleared lines / 10). The next piece uses the resulting gravity interval. There are no combo, back-to-back, spin, or perfect-clear bonuses. Existing soft-drop and hard-drop points are retained.

Top-out is evaluated by the next spawn after row removal; filling a top-row cell alone does not end the game if the spawn still fits.

## S6 — Engine boundary and data contracts

The engine is usable without browser globals or real timers. It accepts a supplied random function, synchronous gameplay commands, and explicit nonnegative finite elapsed milliseconds. The production default random source may be Math.random. Callers supplying randomness must return finite values in [0,1); reproducibility is guaranteed for conforming sources and identical command/time sequences.

Game supplies the following operations through its constructor, apply, advance and snapshot:

- Create a fresh session with an optional random source.
- Apply `left`, `right`, `rotateClockwise`, `softDrop`, `hold`, `hardDrop`, `pause`, `resume`, or `restart`.
- Advance elapsed gameplay time.
- Obtain a snapshot.

Command application reports whether observable state changed; rejected or ineffective commands report false. Restart reports true even if its fresh visible state matches a former state. Timer advancement has no required return value. Invalid elapsed time raises RangeError before mutation in every lifecycle state. A zero update does not advance timers. Out-of-domain random sources and impossible typed command values are caller contract violations, not supported gameplay inputs.

Snapshots contain lifecycle status, 20 × 10 board cells, active kind/origin/orientation/occupied coordinates or null, ghost landing coordinates or null, held kind or null, canHold, next kind, score, total lines, level, and current gravity interval. Consumers cannot mutate the engine through any snapshot array or object, and retained snapshots remain unchanged after later engine updates. Timer internals need not be public.

`held` remains present during pause/game over. `canHold` is true exactly for a running active piece with unused hold. `ghost` contains four detached first-obstruction landing cells, remains present while paused and is null exactly when active is absent. Overlap at zero displacement is valid. Repeated snapshots consume neither selection nor time; added arrays/points are detached from engine state and other snapshots. Bag and timer internals remain private.

Board/geometry/session/timing/progression own S1–S5. Selection owns S2 bag/shuffle state. Browser control consumes these operations; presentation consumes snapshots. No browser component may maintain a competing score, collision rule, or game state.

## S7 — Browser controls and time

The page loads into running play; native repeat never drives commands. Left/right/down act on initial keydown. Held horizontal movement first repeats after 150 ms, then every 50 ms; held down repeats every 50 ms. With opposing horizontal keys, the most recent wins; releasing it reactivates the survivor with a fresh 150 ms delay and no immediate move. At coincident repeats, horizontal precedes down; engine timers run before commands.

| Keyboard event key | Action | Repeat policy |
| --- | --- | --- |
| ArrowLeft / ArrowRight | Move | Initial action, 150 ms delay then 50 ms repeat/priority. |
| ArrowDown | Soft drop | Initial action and 50 ms repeat. |
| ArrowUp | Clockwise rotation with S3 kicks | One shot per press/release. |
| C or c | Hold | One shot per press/release. |
| Space (`event.key` is one space) | Hard drop | One shot per press/release. |
| P or p | Pause/resume | One shot per press/release. |

C/c and P/p are equivalent physical holds: changing letter case while held cannot produce another action without keyup. Browser native-repeat keydowns and duplicate held-key keydowns produce no action. Recognized keys suppress their default actions, including when gameplay is inactive. Other keys retain normal browser behavior, including Tab/Enter access to Restart. Space does not pause or resume; P is the explicit resume key after focus return.

Advance engine time to a recognized actionable input boundary before applying it. No elapsed-time replay or discarded foreground delay is introduced. Horizontal-before-down repeat order remains unchanged. Hold and hard drop preserve arrow-repeat deadlines across an accepted running-session action, including successor input after a hold, unless that action ends play. Engine timers and hold state determine which piece receives any later repeat.

Pause/resume, restart, game over, blur, and hidden-document transitions clear gameplay holds/deadlines under this policy. P's press latch must survive its own pause/resume transition until P keyup, so a held or duplicate P cannot immediately toggle again. Blur/hidden/restart clear that latch without synthesizing input; native-repeat keydowns remain ineffective. Paused arrow/C/Space events cannot arm actions or repeats for resume. Focus return remains paused until a fresh effective P press. Disposal remains idempotent and prevents all later event/frame effects.

The HTML Restart button starts fresh. Frame clock rebases after resume/restart to exclude inactive time; foreground delays are processed without silent caps. Disposal removes subscriptions/cancels frames, is idempotent and prevents later effects.

## S8 — Presentation and compatibility

Canvas renders ghost outlines between locked-board geometry and the solid active piece. Ghost is visibly distinguishable from both, not solely by kind color; active cells cover overlapping ghost cells at d = 0. Its coordinates match S3 and remain visible during pause. Game over has neither active nor ghost cells. Rendering and resizing cannot affect gameplay.

The page displays a held-piece preview with canonical orientation, held-kind text, an explicit empty state, and textual hold availability consistent with `canHold` and lifecycle. Paused/game-over information does not imply a hold action is available. Keep the next preview, statistics, status, readable instructions for all S7 keys, and named keyboard-accessible Restart. The additional panel must preserve square-cell/DPI geometry and an unclipped full board/controls at 1024 × 768 CSS pixels and larger/resized desktop viewports.

Current-stable desktop Chromium/Firefox verification, static HTTP serving without an application backend, and browser-free deterministic engine guarantees remain acceptance obligations. Provisioning methods and actual versions must be recorded at feature verification; baseline browser results are not feature evidence.

All 200 board cells, solid active cells, one next preview, held panel, statistics/status, instructions and Restart are visibly readable. Kind colors distinguish pieces. Textual statistics do not require interpreting Canvas; status changes are announced politely only when changed. Restart retains a visible keyboard focus indicator and accessible name. Canvas scales with CSS size/DPI and preserves square cells.

## Acceptance

| ID | Observable evidence |
| --- | --- |
| A1 | Each kind spawns as S1 defines; four rotations restore geometry; bounds/collision rejection preserves state; O rotation is stable. |
| A2 | Controlled shuffles and exact draw/forward-consumption order match S2; boundary duplicates, lazy refill, instance isolation and restart reset are covered. |
| A3 | Gravity moves exactly at its interval, preserves residual time, and remains equivalent under elapsed-time partitioning across locks/spawns. |
| A4 | Newly grounded pieces survive just below G and lock at G; late-in-cycle landing still gets G; grounded motion and blocked down do not refresh/shorten it; becoming airborne cancels it. |
| A5 | Single through four simultaneous row clears preserve remaining row order, award S5 points, and update level at line-count boundaries; soft drop scores successful rows and hard drop twice its positive distance. |
| A6 | Spawn obstruction after clearing ends play; game-over and paused sessions reject gameplay; restart resets progress; invalid elapsed input preserves state and raises RangeError. |
| A7 | A retained or modified snapshot cannot change engine state or reflect later updates; equivalent controlled engine sessions are reproducible. |
| A8 | Browser controls/repeat/priority follow S7, recognized keys do not scroll, and held input cannot leak across lifecycle boundaries. |
| A9 | Focus loss/hidden document pauses; foreground return stays paused; explicit resume preserves timer remainders and excludes inactive time. |
| A10 | Board/ghost/next/held/availability/statistics/status stay consistent, resize preserves the board, Restart is accessible, and disposal stops event/frame effects. |
| A11 | Static serving works in supported browser targets with no application backend; TypeScript engine tests run without browser globals. |

These conditions define the complete product results. The following stable feature acceptance IDs additionally preserve campaign evidence attribution within the complete contract.

| ID | Required observable evidence |
| --- | --- |
| FA1 | Controlled shuffles follow S2's exact loop/draw count and forward consumption; consecutive bags are permutations, boundary duplicates are legal, restart discards remaining bag, sessions are isolated, and snapshots/rejections do not consume draws. |
| FA2 | Empty/full/same-kind hold follows S3; canonical replacement/fresh timers, next consumption, once-per-lock availability, and restart reset are correct through public commands. |
| FA3 | Empty/full hold spawn obstruction produces exact retained held/next/board/statistics and no replacement draw; inactive/consumed hold is atomic and ineffective. |
| FA4 | Rotation selects the first valid offset on both walls and around locked cells; all-candidate and floor failures are atomic; O is ineffective; grounded retention, airborne cancellation, and fresh grounding follow S4. |
| FA5 | Ghost projects exactly to the first obstruction on empty/stacked/uneven boards, matches hard drop, is present during pause/absent without active, and exposes only detached nonmutating cells. |
| FA6 | Positive hard-drop distance awards exactly twice its rows; zero/inactive drop is ineffective, preserves timers and points, and neither locks nor clears at the command. |
| FA7 | Late hard-drop landing gets a full G; grounded repeats do not refresh it; movement/kicks/hold during delay have exact effects; just-before/at expiry, timer-before-command ties, residual updates, and partition equivalence through clear/level/successor are covered. |
| FA8 | Native and controlled keys implement S7, including letter case, one-shot latches, Space drop/P pause, timer ordering, arrow-repeat survival across hold/drop, inactive rejection, focus/manual resume, restart, game-over cleanup, and disposal. |
| FA9 | Built-page hold/next/status/instructions and ghost/active rendering agree with snapshots, remain readable/unclipped at minimum/resized viewports and DPR values, and Restart operates by keyboard in supported targets. |
| FA10 | Production static feature gameplay passes on recorded current-stable desktop Chromium and Firefox; unit/type/build regressions pass and every unaffected A1–A11 obligation remains represented with fixtures consistent with S2. |

Verification uses conforming bag permutations and public commands; browser random sources are installed before application startup. No unlimited repeated-O scenario, alternate randomization mode or production state loader is supported. [PLAN](PLAN.md) selects delivery checks and [TASKS](TASKS.md) records verified evidence.
