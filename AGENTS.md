# Agent orientation

## Project and governing documents

This repository develops a single-player desktop browser Tetris game in TypeScript and demonstrates SDD Manager.

Read [PROJECT](docs/dev/PROJECT.md), [ARCHITECTURE](docs/dev/ARCHITECTURE.md), [DECOMPOSITION](docs/dev/DECOMPOSITION.md), [SPEC](docs/dev/SPEC.md), its [review report](docs/dev/SPEC-REVIEW-REPORT.md), [PLAN](docs/dev/PLAN.md), [layout](docs/dev/layout.md), the [plan review](docs/dev/PLAN-REVIEW-REPORT.md), [TASKS](docs/dev/TASKS.md), and the [task review](docs/dev/TASKS-REVIEW-REPORT.md). Read applicable nested AGENTS.md files before changing selected paths. Explicitly load this file when the host does not discover it automatically.

## Current ownership

The specification and PLAN/layout are accepted. TASKS is the sole baseline execution owner; the user accepted full Phase 1 inline execution with GitHub tracking. No product source tree, test suite, or active feature campaign exists. Modern features belong to a subsequent campaign.

## Workflow

Use SDD Manager's preparation, acceptance, verification, and Git publication procedures. Preserve unrelated work. Keep preimplementation documents on the designated design-docs branch; explicitly integrate accepted preparation into the actual default branch and publish it before creating dependent implementation branches. Respect the user's selected execution boundary.

Repository publication is already authorized; do not request repeated push permission. This does not settle unresolved product decisions or bypass readiness gates. Never commit credentials.

Maintain current navigation and actual setup/check commands as the project develops. No product setup/build/test commands exist yet; do not claim planned checks have run. Consult closed campaign records only for a specific current need and leave them unchanged.
