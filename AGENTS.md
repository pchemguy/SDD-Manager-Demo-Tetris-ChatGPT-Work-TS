# Agent orientation

## Project and governing documents

This repository develops a single-player desktop browser Tetris game in TypeScript and demonstrates SDD Manager.

Read [PROJECT](docs/dev/PROJECT.md), [ARCHITECTURE](docs/dev/ARCHITECTURE.md), [DECOMPOSITION](docs/dev/DECOMPOSITION.md), [SPEC](docs/dev/SPEC.md), its [review report](docs/dev/SPEC-REVIEW-REPORT.md), [PLAN](docs/dev/PLAN.md), [layout](docs/dev/layout.md), the [plan review](docs/dev/PLAN-REVIEW-REPORT.md), [TASKS](docs/dev/TASKS.md), and the [task review](docs/dev/TASKS-REVIEW-REPORT.md). Read applicable nested AGENTS.md files before changing selected paths. Explicitly load this file when the host does not discover it automatically.

## Current ownership

The completed baseline remains published with T-001–T-022 and closed historical records. Modern-feature T-023–T-040 and delivery milestones 2.1–2.4 are verified/published/closed; T-041 is the active final review/incorporation/integration task on feature/001_2606a72-modern-features, targeting main. [TASKS](docs/dev/TASKS.md) is now the sole executable owner of both phases. Accepted feature deltas and adjacent QC are [historical package sources](docs/dev/features/001_2606a72-modern-features/README.md); archived checkboxes never drive selection. Main PROJECT/ARCHITECTURE/DECOMPOSITION/SPEC/PLAN/layout and adjacent reviews govern the complete game. Preserve the full-gravity-interval lock rule and prior closed records. Full Phase 2 inline execution/tracking/publication is authorized, stopping after verified main integration; no later campaign is selected.

## Workflow

Use SDD Manager's preparation, acceptance, verification, and Git publication procedures. Preserve unrelated work. Keep preimplementation documents on the designated design-docs branch; explicitly integrate accepted preparation into the actual default branch and publish it before creating dependent implementation branches. Respect the user's selected execution boundary.

Repository publication is already authorized; do not request repeated push permission. This does not settle unresolved product decisions or bypass readiness gates. Never commit credentials.

Maintain current navigation and actual setup/check commands as the project develops. Declared commands are npm ci, npm run dev/typecheck/build/preview, npm test, npm run test:e2e, and npm run test:e2e:stable. Setup/typecheck/build and stable production browser acceptance are verified; engine/input/controller/presentation suites exercise progression, chronological repeat scheduling, lifecycle cleanup and rendering. Browser tests serve the production build; build before running them. Browser checks spawn their server in the same command/process tree because separate tool executions do not share loopback listeners. Stable acceptance uses externally provisioned official Chromium headless and unpatched Firefox/geckodriver executables; see README for paths and process-scoped sandbox environment. Bundled browsers do not establish stable-version acceptance. Consult closed campaign records only for a specific current need and leave them unchanged.
