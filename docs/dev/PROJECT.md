# Project brief

## Purpose and audience

Build a playable single-player desktop browser Tetris game while demonstrating SDD Manager in ChatGPT Work. The demonstration targets TypeScript, ChatGPT Work web with 6.1 Sol Medium and the standard cloud sandbox. Requested model/platform conditions are context, not independently attested runtime facts.

## Product scope

The game has a 10 × 20 board, seven tetrominoes, seven-bag selection, one-piece next preview, once-per-lock hold, outlined ghost projection, keyboard movement, clockwise horizontal wall kicks, gravity, soft drop, delayed hard drop, simultaneous line clearing, scoring, level progression, pause/focus handling, Restart and game over.

A grounded piece gets one full current gravity interval before locking, including after hard drop. Grounded movement/rotation retain the timer; becoming airborne cancels it. Hard drop moves to the first-obstruction landing and scores two points per row without immediately locking. Hold replaces geometry at canonical spawn with fresh timers; availability returns only after lock and successful successor spawn. Every ten cleared lines increases level and gravity speed. Arrow keys move/rotate/soft-drop, C holds, Space hard-drops and P pauses/resumes. Focus return requires manual P; Restart starts fresh.

## Constraints and non-goals

Use a browser-independent TypeScript engine, Canvas board/next/held rendering, HTML controls/statistics and deterministic verification. Support keyboard desktop viewports from 1024 × 768, resizing/DPI and current stable desktop Chromium/Firefox at verification time. Deliver static HTTP output without an application backend. Multiplayer, accounts, online leaderboards, touch controls, audio, persistence, expanded next queues, counterclockwise rotation, vertical floor kicks, spin/combo bonuses and exact commercial-rule-standard conformance are outside scope.

## Success evidence

Public command/time scenarios and production native keyboard paths must demonstrate coherent bag/hold/ghost/kicks/drop, full-delay locks, clearing/progression, lifecycle/top-out and Restart. Unit/type/build checks, recorded supported browser versions and inspected desktop/DPI presentation establish acceptance. Reports distinguish implemented capabilities, verified branch state and published target integration.

## Navigation

[Architecture](ARCHITECTURE.md) defines blocks; [decomposition](DECOMPOSITION.md) defines components. [SPEC](SPEC.md) owns complete behavior; [PLAN](PLAN.md) and [layout](layout.md) define delivery/physical ownership; [TASKS](TASKS.md) is the sole executable task owner. The [modern-feature package](features/001_2606a72-modern-features/README.md) retains accepted source history and feature implementation evidence.
