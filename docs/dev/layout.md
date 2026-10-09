# Physical layout

## Status and ownership

This is the accepted physical allocation for the accepted [architecture](ARCHITECTURE.md), [components](DECOMPOSITION.md), and [delivery plan](PLAN.md). Only root repository records and the design/specification/planning documents exist at preparation time. Product/test/tooling paths below are planned; their mention does not claim implementation.

## Source and verification map

| Owner | Planned source location | Planned checks/fixtures |
| --- | --- | --- |
| Shared engine types and snapshot contract | `src/engine/types.ts` | Engine session/snapshot checks under `tests/engine/` |
| Piece geometry | `src/engine/pieces.ts` | `tests/engine/pieces.test.ts` |
| Board operations | `src/engine/board.ts` | `tests/engine/board.test.ts` |
| Independent selection | `src/engine/random.ts` | `tests/engine/random.test.ts` |
| Progression values and calculation | `src/engine/progression.ts` | `tests/engine/progression.test.ts` |
| Session rules and timing coordinator | `src/engine/game.ts` | `tests/engine/game.test.ts` and focused timing/lifecycle suites in `tests/engine/` |
| Key state/repeat policy | `src/browser/input.ts` | `tests/browser/input.test.ts` |
| Browser scheduling/lifecycle and engine/presentation coordination | `src/browser/controller.ts` | `tests/browser/controller.test.ts` |
| Canvas board/preview rendering | `src/browser/renderer.ts` | Focused renderer checks under `tests/browser/`; actual pixels/resize/device ratio checked under `tests/e2e/` |
| HTML statistics/status/controls view | `src/browser/view.ts` | `tests/browser/view.test.ts` and `tests/e2e/` |
| Application composition | `src/main.ts`, root `index.html`, `src/styles.css` | Production-build/browser checks under `tests/e2e/` |
| Deterministic fixture helpers | No production allocation | `tests/helpers/` for controlled random/time/scenario builders shared by suites |

Session timing remains with the game coordinator or its focused engine implementation. Extract a dedicated timing file only if implementation identifies a cohesive independent boundary; do not duplicate state. Likewise, logical view/renderer components can share small presentation helpers without introducing a framework.

The engine may depend on engine modules; it may not import browser modules or require browser globals. Browser modules may consume engine types/operations and presentation collaborators. `src/main.ts` is the composition root. Test helpers cannot be imported by product sources. Avoid public mutable scenario-loading APIs solely to simplify tests.

## Tooling and artifacts

| Location | Owner and disposition |
| --- | --- |
| `package.json`, `package-lock.json` | Application dependencies, scripts, exact resolved versions; lockfile is committed. |
| `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts` when needed | Type checking/static build/unit/browser configuration; do not create redundant configs without a consumer. |
| `node_modules/`, `dist/`, `coverage/`, `test-results/`, `playwright-report/` | Generated dependency/build/test output; ignored by Git. Required evidence is summarized or selected into owning reports rather than committing all transient output. |
| Root `.gitignore` and ignored repository credential file | Repository maintenance; credential exclusion remains effective and secrets never enter commits/reports. |

Planned script interface: `dev`, `build`, `preview`, `typecheck`, `test`, and `test:e2e`. TASKS defines concrete setup/check commands after the toolchain has a declared implementation. No command is claimed validated here. The built site lives in `dist/` and must operate from static HTTP serving without a backend.

## Documentation and execution ownership

Root `README.md` owns product introduction, user controls, setup/build/test instructions, demo-context disclosure, and navigation. Root `AGENTS.md` owns concise agent orientation and current governing links/command evidence. Root `AI_DISCLOSURE.md`, `SDD-MANAGER.md`, and `LICENSE` retain repository-wide roles.

`docs/dev/PROJECT.md`, `ARCHITECTURE.md`, `DECOMPOSITION.md`, `SPEC.md`, `PLAN.md`, and `layout.md` are the canonical main owners. Adjacent SPEC/PLAN/TASKS review reports cover their roots and applicable children. No document children are needed for this scope.

[TASKS](TASKS.md) owns the full baseline phase/milestone/task hierarchy; do not maintain a second executable checklist. Main milestone reports belong at `docs/dev/reports/phases/1/<milestone-id>.md`; the phase report belongs at `docs/dev/reports/phases/1/PHASE-REPORT.md`; the final baseline report belongs at `docs/dev/reports/IMPLEMENTATION-REPORT.md`. Phase review milestone 1.5 produces the phase/final reports, not an additional delivery-milestone report.

A later feature campaign allocates its active root FEATURE documents and descriptive package/branch association under SDD Manager's feature conventions when that campaign starts. No speculative feature package is created now. Closed records remain unchanged and outside routine current validation.

## Placement gate

Every significant logical component has a source/check home, and browser integration has one composition root. TASKS may choose bounded touched paths from this map; a genuine new ownership need requires a scoped layout amendment and affected conformance recheck. No placement choice blocks baseline task derivation under the accepted layout.
