# Agent orientation

## Project and governing documents

This repository develops a single-player desktop browser Tetris game in TypeScript and demonstrates SDD Manager.

Read [PROJECT](docs/dev/PROJECT.md), [ARCHITECTURE](docs/dev/ARCHITECTURE.md), [DECOMPOSITION](docs/dev/DECOMPOSITION.md), [SPEC](docs/dev/SPEC.md), its [review report](docs/dev/SPEC-REVIEW-REPORT.md), [PLAN](docs/dev/PLAN.md), [layout](docs/dev/layout.md), the [plan review](docs/dev/PLAN-REVIEW-REPORT.md), [TASKS](docs/dev/TASKS.md), and the [task review](docs/dev/TASKS-REVIEW-REPORT.md). Read applicable nested AGENTS.md files before changing selected paths. Explicitly load this file when the host does not discover it automatically.

## Current ownership

The complete baseline and T-022 integration/publication are finished on main. TASKS records completed baseline work. The user opened [modern-feature campaign 001_2606a72](docs/dev/features/001_2606a72-modern-features/README.md) for hold, ghost, seven-bag selection, wall kicks, and hard drop. Preparation is on design-docs/001_2606a72-modern-features, based on 2606a7213d4ddcf18497fafabb6cc5c349a26178; the target is main. [FEATURE_DECOMPOSITION](docs/dev/FEATURE_DECOMPOSITION.md) is accepted. [FEATURE-SPEC](docs/dev/FEATURE-SPEC.md) and its [review](docs/dev/FEATURE-SPEC-REVIEW-REPORT.md) are prepared; specification acceptance is pending. No feature plan, task list, or implementation branch exists yet. Read the active package before feature work; baseline task completion does not establish feature readiness. Preserve full-gravity-interval locking. No task range is active.

## Workflow

Use SDD Manager's preparation, acceptance, verification, and Git publication procedures. Preserve unrelated work. Keep preimplementation documents on the designated design-docs branch; explicitly integrate accepted preparation into the actual default branch and publish it before creating dependent implementation branches. Respect the user's selected execution boundary.

Repository publication is already authorized; do not request repeated push permission. This does not settle unresolved product decisions or bypass readiness gates. Never commit credentials.

Maintain current navigation and actual setup/check commands as the project develops. Declared commands are npm ci, npm run dev/typecheck/build/preview, npm test, npm run test:e2e, and npm run test:e2e:stable. Setup/typecheck/build and stable production browser acceptance are verified; engine/input/controller/presentation suites exercise progression, chronological repeat scheduling, lifecycle cleanup and rendering. Browser tests serve the production build; build before running them. Browser checks spawn their server in the same command/process tree because separate tool executions do not share loopback listeners. Stable acceptance uses externally provisioned official Chromium headless and unpatched Firefox/geckodriver executables; see README for paths and process-scoped sandbox environment. Bundled browsers do not establish stable-version acceptance. Consult closed campaign records only for a specific current need and leave them unchanged.
