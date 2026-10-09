# Project brief

## Purpose and audience

Build a playable single-player Tetris game for desktop browser users while demonstrating a greenfield SDD Manager workflow in ChatGPT Work. The demonstration targets TypeScript, ChatGPT Work web with 6.1 Sol Medium, and the standard cloud sandbox. This is a learning-by-doing development demonstration; design-stage documents do not establish implemented maturity.

## Accepted baseline

The baseline has a 10 × 20 playable board, seven tetrominoes, independent random selection, a one-piece preview, keyboard movement, clockwise rotation without wall kicks, gravity, soft drop, line clearing, scoring, level progression, pause, restart, and game over.

A grounded piece receives one full gravity interval before locking. Grounded movement and rotation do not reset that timer; becoming airborne cancels it. Soft drop cannot force early locking. Every ten cleared lines increases the level and gravity speed. Arrow keys control movement, rotation, and soft drop; Space pauses. A Restart button starts a fresh game. Loss of browser focus pauses play.

## Subsequent feature campaign

After the baseline MVP, a separate SDD feature expansion adds hold, ghost piece, seven-bag randomization, wall kicks, and hard drop. The full-gravity-interval locking principle remains a feature-design constraint. Exact added behavior is settled in that campaign's accepted contracts.

## Constraints and non-goals

Use a browser-independent TypeScript engine, Canvas board rendering, HTML controls/statistics, and deterministic engine verification. The baseline is desktop and keyboard oriented. Multiplayer, accounts, backend services, online leaderboards, mobile touch controls, and exact conformance to a named commercial rule standard are outside scope.

## Success evidence

A playable baseline must demonstrate coherent movement, rotation, gravity, locking, line clearing, scoring, pause, restart, and game over. Deterministic engine tests and browser checks provide evidence. Design acceptance does not establish implementation completion.

## Navigation

[Architecture](ARCHITECTURE.md) defines major blocks; [decomposition](DECOMPOSITION.md) defines logical components. [SPEC](SPEC.md) owns the proposed behavioral contracts; PLAN and layout will own delivery order and physical organization; TASKS will own executable work. PLAN, layout, and TASKS are not present yet.
