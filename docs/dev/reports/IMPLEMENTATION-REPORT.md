# Baseline implementation report

The accepted classic browser/TypeScript Tetris baseline is implemented and verified through Phase 1/T-001–T-022. [Phase review](phases/1/PHASE-REPORT.md) maps A1–A11 to actual evidence; [milestone reports](phases/1/) record the incremental code reviews and repairs.

The game includes all seven pieces, independent next selection, movement/clockwise rotation, gravity/full-delay locking, row clearing, scoring/levels, soft drop, pause/focus handling, Restart, held-key repeat, accessible HTML state and a responsive high-DPI Canvas. It runs from a static HTTP server without an application backend. README contains install/play/check instructions and the engine API.

## Verification

57 unit tests, strict typecheck and production build pass. Stable acceptance passes on official Chromium 155.0.8059.39 headless desktop engine and unpatched Firefox 157.0.1/geckodriver 0.37.1: native/controlled controls, inactive timing, actual Firefox tab visibility, keyboard Restart, row clear/top-out, rotation/lock/spawn and minimum/resized/DPR rendering. Clean npm ci and 14 standard Playwright checks also passed during delivery. Screenshots were inspected; the native clear displayed Lines 2 and Score 390.

## Review and TODO aggregation

All four delivery reviews are complete with empty TODO sections. M1.2-01 (early deadline), M1.4-01 (backing rounding) and M1.4-02 (fixture capture/realm) were repaired and rechecked. P1-01 adds direct partition evidence through a line-clear level transition; existing engine behavior passes. No unresolved required defect, blocker or admissible deferred code finding remains.

TODO: None.

## Publication and scope

Preparation was explicitly merged/published to main at b3b3bfcba9fef0e67a45221049073743e6ed9caf before execution. Each task result/status is committed and pushed on phase/1-baseline-browser-game, with GitHub issue evidence and milestone closures. Final integrated completion is established by T-022's explicit two-parent main merge, passing merged-state checks and remote containment. This report is committed before that integration; the merge commit carries the actual parent/check evidence.

The browser method is headless Linux automation. Full Chrome browser UI/graphical OS focus was not tested because of the sandbox's Unix-socket restriction; the tested Chromium runtime is the official current-Stable desktop engine. Browser provisioning/process-scoped flags and requested Work/model context are recorded in README. No global Python environment was modified.

Hold, ghost, seven-bag, kicks and hard drop remain a separate future campaign. No such campaign was started by this baseline run.
