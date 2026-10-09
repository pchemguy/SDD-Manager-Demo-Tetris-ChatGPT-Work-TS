# Modern-feature specification

> Historical snapshot archived by T-041 on 2026-10-09. Current authority is [main TASKS](../../TASKS.md), [SPEC](../../SPEC.md), [PLAN](../../PLAN.md) and [layout](../../layout.md). Archived checkboxes are not executable owners or current completion claims.

## Scope and authority

This scoped delta belongs to [campaign 001_2606a72-modern-features](README.md). Its accepted design is [FEATURE_DECOMPOSITION](FEATURE_DECOMPOSITION.md), accepted by the user at `a4185c2f586388171c4ef12314fb26e6a83ce8aa` on 2026-10-09. [PROJECT](../../PROJECT.md), [ARCHITECTURE](../../ARCHITECTURE.md), and [DECOMPOSITION](../../DECOMPOSITION.md) supply the retained purpose and ownership. The user accepted this specification at `2999f0fbaaa46813c97e2fed035dfab3b1b279fc` on 2026-10-09.

The feature adds hold, ghost projection, seven-bag selection, horizontal wall kicks, and hard drop to the desktop browser game. It retains full-gravity-interval grounded locking, the 10 × 20 board without hidden rows, seven canonical geometries, clockwise-only rotation, one-piece next preview, line scoring/progression, pause/focus/restart lifecycle, detached snapshots, and static delivery. Multiplayer, touch controls, audio, persistence, expanded next queues, counterclockwise rotation, vertical floor kicks, spin/combo bonuses, and exact commercial-standard conformance are outside scope.

## F1 — Main contract disposition

| Main SPEC owner | Feature delta |
| --- | --- |
| S1, rotation paragraph | F4 permits the first fitting horizontal kick after clockwise orientation change. Board bounds, spawn geometry, occupied-cell collision, and O geometry remain unchanged. |
| S2, selection/restart | F2 defines bag selection and restart reset. F3 defines hold state and replacement spawn; post-lock promotion and blocked-next behavior remain applicable. |
| S3, gameplay actions | F3 adds hold; F4 refines clockwise rotation; F5 adds hard drop and its row points. Ordinary movement and soft drop retain their contracts. |
| S4, grounding/timing | F3 resets timers for a hold replacement. F4–F5 reconcile grounding without refreshing an existing grounded countdown. Chronology and full-delay locking remain applicable. |
| S5, scoring/lock | F5 adds hard-drop row points. Lock, compaction, pre-clear-level line awards, level thresholds, and next-spawn top-out remain applicable. |
| S6, engine commands/snapshots | F6 adds typed commands and detached hold/ghost values; explicit time, random source domain, command-result semantics, and browser independence remain applicable. |
| S7, key mapping | F7 assigns C to hold, Space to hard drop, and P to pause/resume, including manual focus return. Arrow repeat, chronological scheduling, and cleanup guarantees remain applicable. |
| S8, presentation | F8 adds held preview/text/availability and ghost geometry within the accepted desktop/static/browser obligations. |

This document governs only the declared delta while active. Unaffected behavior remains owned by [main SPEC](../../SPEC.md). Incorporation into the complete main documents belongs to sdd-integrate-feature; preparation does not change implemented product behavior.

## F2 — Seven-bag selection

Each game instance owns its selection state. To create a bag, copy the canonical order `[I, O, T, S, Z, J, L]`. For i = 6, 5, …, 1, obtain one conforming random value r, set j = floor((i + 1) * r), and swap elements i and j. Consume the completed array from index 0 through 6. Each bag contains each kind exactly once. Two identical kinds may occur across a bag boundary; independent per-piece selection is not supported.

Create a bag lazily whenever another kind is requested and the current bag has no remaining kinds. A shuffle consumes exactly six random values; consuming a prepared kind consumes none. No speculative second bag or extra random value is consumed for rendering, snapshots, rejected commands, or occupied-hold swaps. Callers still supply finite values in [0,1); out-of-domain sources remain caller contract violations.

A fresh session discards all remaining bag state, creates a fresh bag, consumes its first kind as active, then its second as next. Restart uses the current random source without rewinding it. A successful post-lock spawn promotes next and requests one replacement next. A blocked post-lock spawn keeps the blocked next kind visible and requests no replacement, as in S2. F3 specifies hold consumption. Identical source values and command/time sequences produce identical sessions, including bag boundaries; separate games never share bag state.

## F3 — Hold and replacement lifecycle

A fresh session has held kind null and hold unused. While running with an active piece and hold unused, `hold` stores the outgoing active kind and consumes hold availability. Stored kinds retain no position, orientation, gravity age, or lock countdown. Progress and locked board do not change.

| Held state before hold | Incoming kind | Next/bag effect |
| --- | --- | --- |
| Empty | The visible next kind | On successful spawn, request one replacement next from F2. |
| Occupied | The stored held kind | Visible next and bag cursor remain unchanged. |

The incoming piece uses S1's canonical spawn origin/orientation, gravity age zero, and no carried lock countdown. Immediately evaluate grounding: a grounded-at-spawn replacement receives the current full G(L). Hold remains consumed for this replacement. It becomes unused only after that piece locks and a successor successfully spawns. Pausing/resuming, moving, rotating, dropping, or becoming airborne does not re-enable hold. Restart clears held state and availability usage.

If incoming spawn is obstructed, the accepted hold still stores the outgoing kind and consumes availability, then enters game over with no active/ghost geometry. Locked board, statistics, and visible next remain unchanged, and no replacement next is requested. For an empty hold, next remains the obstructed incoming kind; for an occupied hold, next remains its unrelated existing kind. Spawn failure does not restore the outgoing piece. Game over still requires restart.

An accepted hold reports true, including a same-kind swap or a replacement ending in game over, because hold state/availability or lifecycle changes. A consumed hold, paused/game-over hold, or hold without active geometry reports false and changes no state, timers, selection, or randomness.

## F4 — Clockwise horizontal wall kicks

For a running non-O active piece, obtain the clockwise orientation using S1 geometry. From the current matrix origin, test horizontal offsets in this exact order: 0, -1, +1, -2, +2. Keep y unchanged for every candidate. Accept the first whose occupied cells are within the board and disjoint from locked cells. Candidate tests do not mutate session state.

Success applies orientation and x atomically, reports true, and reconciles grounding through S4: remaining grounded retains the existing countdown; becoming airborne cancels it; becoming grounded starts a full interval. Gravity age remains unchanged. If every candidate fails, report false with geometry, timers, score, hold, and bag state unchanged. O rotation reports false without testing translations. No vertical kick or hidden-row exception is permitted.

## F5 — Landing projection and hard drop

For an active piece, landing displacement d is the largest nonnegative integer such that every occupied cell remains collision-free when translated downward by each integer from 0 through d. Translation by d + 1 fails. Projection keeps kind, x, and orientation unchanged. It queries locked board cells, not the displayed ghost, and changes no session state, timers, selection, or randomness. A grounded piece has d = 0.

`hardDrop` is effective only while running with an active piece and d > 0. Translate y by d atomically, add exactly 2 * d points, and report true. Those points do not depend on level, change line totals, or cause progression. Do not award intermediate soft-drop points. With d = 0 or an inactive/no-active session, return false with no state or timer changes.

Hard drop does not lock, clear rows, spawn, reset gravity age, or consume/re-enable hold. An airborne piece first landing by hard drop starts the current level's complete G(L), irrespective of gravity age. An already grounded piece retains its countdown. Repeated hard-drop commands cannot refresh the countdown or score the same stationary landing again. If intervening movement or a kick makes the piece airborne, a later positive-distance hard drop is a distinct translation and scores its own distance.

The piece remains movable/rotatable/holdable during its delay subject to F3–F4. S4 chronology is unchanged: a timer expiring at the input boundary is processed before the hard-drop command, so the command may operate on the successor. Only timer expiry locks the piece. At a lock, S5's row removal and line awards apply in addition to accumulated drop points.

## F6 — Engine interface and snapshot values

`Game.apply` accepts existing engine commands plus `hold` and `hardDrop`; `rotateClockwise` follows F4. The engine pause/resume commands remain available, irrespective of browser key mapping. Boolean results follow S6 and the specific F3–F5 effective/ineffective rules. `advance` retains finite/nonnegative validation, invalid-input atomicity in all lifecycle states, paused/game-over behavior, and partition equivalence through lock/spawn/level changes.

The detached snapshot retains all S6 fields and adds:

| Field | Contract |
| --- | --- |
| `held` | Stored Kind, or null when empty. Retained in paused/game-over state. |
| `canHold` | True exactly when status is running, active is present, and hold is unused. False while paused/game over or after hold use; resume restores eligibility if hold remains unused. |
| `ghost` | Array of the four occupied landing coordinates from F5, or null when active is absent. Present during pause; overlapping active geometry is valid at d = 0. |

All added arrays/point objects are detached from engine state and other snapshots. Repeated snapshots cannot consume selection, advance timers, or change availability. Ghost cells match the next positive-distance hard-drop endpoint for the same board/active state. Bag internals, displacement, and timer state need not be public. Rules, source state, hold, and projection remain browser-independent.

## F7 — Browser controls and lifecycle

| Keyboard event key | Action | Repeat policy |
| --- | --- | --- |
| ArrowLeft / ArrowRight | Move | S7's initial action, 150 ms initial delay, then 50 ms repeat/priority. |
| ArrowDown | Soft drop | S7's initial action and 50 ms repeat. |
| ArrowUp | Clockwise rotation with F4 kicks | One shot per press/release. |
| C or c | Hold | One shot per press/release. |
| Space (`event.key` is one space) | Hard drop | One shot per press/release. |
| P or p | Pause/resume | One shot per press/release. |

C/c and P/p are equivalent physical holds: changing letter case while held cannot produce another action without keyup. Browser native-repeat keydowns and duplicate held-key keydowns produce no action. Recognized keys suppress their default actions, including when gameplay is inactive. Other keys retain normal browser behavior, including Tab/Enter access to Restart. Space does not pause or resume; P is the explicit resume key after focus return.

Advance engine time to a recognized actionable input boundary before applying it. No elapsed-time replay or discarded foreground delay is introduced. Horizontal-before-down repeat order remains unchanged. Hold and hard drop preserve arrow-repeat deadlines across an accepted running-session action, including successor input after a hold, unless that action ends play. Engine timers and hold state determine which piece receives any later repeat.

Pause/resume, restart, game over, blur, and hidden-document transitions clear gameplay holds/deadlines under S7. P's press latch must survive its own pause/resume transition until P keyup, so a held or duplicate P cannot immediately toggle again. Blur/hidden/restart clear that latch without synthesizing input; native-repeat keydowns remain ineffective. Paused arrow/C/Space events cannot arm actions or repeats for resume. Focus return remains paused until a fresh effective P press. Disposal remains idempotent and prevents all later event/frame effects.

## F8 — Presentation and supported delivery

Canvas renders ghost outlines between locked-board geometry and the solid active piece. Ghost is visibly distinguishable from both, not solely by kind color; active cells cover overlapping ghost cells at d = 0. Its coordinates match F5 and remain visible during pause. Game over has neither active nor ghost cells. Rendering and resizing cannot affect gameplay.

The page displays a held-piece preview with canonical orientation, held-kind text, an explicit empty state, and textual hold availability consistent with `canHold` and lifecycle. Paused/game-over information does not imply a hold action is available. Keep the next preview, statistics, status, readable instructions for all F7 keys, and named keyboard-accessible Restart. The additional panel must preserve square-cell/DPI geometry and an unclipped full board/controls at 1024 × 768 CSS pixels and larger/resized desktop viewports.

S8's current-stable desktop Chromium/Firefox verification, static HTTP serving without an application backend, and browser-free deterministic engine guarantees remain acceptance obligations. Provisioning methods and actual versions must be recorded at feature verification; baseline browser results are not feature evidence.

## Feature acceptance

| ID | Required observable evidence |
| --- | --- |
| FA1 | Controlled shuffles follow F2's exact loop/draw count and forward consumption; consecutive bags are permutations, boundary duplicates are legal, restart discards remaining bag, sessions are isolated, and snapshots/rejections do not consume draws. |
| FA2 | Empty/full/same-kind hold follows F3; canonical replacement/fresh timers, next consumption, once-per-lock availability, and restart reset are correct through public commands. |
| FA3 | Empty/full hold spawn obstruction produces exact retained held/next/board/statistics and no replacement draw; inactive/consumed hold is atomic and ineffective. |
| FA4 | Rotation selects the first valid offset on both walls and around locked cells; all-candidate and floor failures are atomic; O is ineffective; grounded retention, airborne cancellation, and fresh grounding follow S4. |
| FA5 | Ghost projects exactly to the first obstruction on empty/stacked/uneven boards, matches hard drop, is present during pause/absent without active, and exposes only detached nonmutating cells. |
| FA6 | Positive hard-drop distance awards exactly twice its rows; zero/inactive drop is ineffective, preserves timers and points, and neither locks nor clears at the command. |
| FA7 | Late hard-drop landing gets a full G; grounded repeats do not refresh it; movement/kicks/hold during delay have exact effects; just-before/at expiry, timer-before-command ties, residual updates, and partition equivalence through clear/level/successor are covered. |
| FA8 | Native and controlled keys implement F7, including letter case, one-shot latches, Space drop/P pause, timer ordering, arrow-repeat survival across hold/drop, inactive rejection, focus/manual resume, restart, game-over cleanup, and disposal. |
| FA9 | Built-page hold/next/status/instructions and ghost/active rendering agree with snapshots, remain readable/unclipped at minimum/resized viewports and DPR values, and Restart operates by keyboard in supported targets. |
| FA10 | Production static feature gameplay passes on recorded current-stable desktop Chromium and Firefox; unit/type/build regressions pass and every unaffected A1–A11 obligation remains represented with fixtures consistent with F2. |

Accepted deltas refine baseline A1/A2/A4/A5/A6/A7/A8/A9/A10 through F2–F8; A3/A11 and unchanged portions remain applicable. Baseline tests assuming an unlimited repeated-O draw from a constant source are not valid F2 scenarios. Verification must use controlled bag permutations and valid public gameplay commands, with randomness installed before browser startup; no production state-loading hook or alternate randomization mode is authorized.

## Readiness and limits

The [adjacent review](FEATURE-SPEC-REVIEW-REPORT.md) assesses design conformance and contract quality. Specification acceptance is established; no consequential design or behavior question is open for FEATURE-PLAN/layout preparation. This specification is not executable evidence, a task list, or permission to project hosted feature tasks. Product implementation has not started.
