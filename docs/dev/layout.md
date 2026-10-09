# Physical layout

## Status and ownership

This is the accepted physical allocation for the accepted [architecture](ARCHITECTURE.md), [components](DECOMPOSITION.md), and [delivery plan](PLAN.md). It covers both implemented phases; completion evidence belongs to TASKS and implementation reports.

## Source and verification map

| Owner | Source location | Checks/fixtures |
| --- | --- | --- |
| Shared engine types and snapshot contract | `src/engine/types.ts` | Engine session/snapshot checks under `tests/engine/` |
| Piece geometry | `src/engine/pieces.ts` | `tests/engine/pieces.test.ts` |
| Board operations | `src/engine/board.ts` | `tests/engine/board.test.ts` |
| Instance-private seven-bag selection | `src/engine/random.ts` | `tests/engine/random.test.ts` |
| Progression values and calculation | `src/engine/progression.ts` | `tests/engine/progression.test.ts` |
| Landing/kick queries | `src/engine/placement.ts` | `tests/engine/placement.test.ts` and public-command consumers |
| Session/hold/drop rules and timing coordinator | `src/engine/game.ts` | `tests/engine/game.test.ts` and focused timing/lifecycle suites in `tests/engine/` |
| Key state/repeat policy | `src/browser/input.ts` | `tests/browser/input.test.ts` |
| Browser scheduling/lifecycle and engine/presentation coordination | `src/browser/controller.ts` | `tests/browser/controller.test.ts` |
| Canvas locked/ghost/active and next/held rendering | `src/browser/renderer.ts` | Focused renderer checks under `tests/browser/`; actual pixels/resize/device ratio checked under `tests/e2e/` |
| HTML statistics/status/controls view | `src/browser/view.ts` | `tests/browser/view.test.ts` and `tests/e2e/` |
| Application composition | `src/main.ts`, root `index.html`, `src/styles.css` | Production-build/browser checks under `tests/e2e/` |
| Deterministic fixture helpers | No production allocation | `tests/helpers/` for random.ts conforming bag draws, fixtures.ts immutable placement traces, scenarios.ts public command helpers; shared by unit/production suites |

Session timing remains with the game coordinator or its focused engine implementation. Extract a dedicated timing file only if implementation identifies a cohesive independent boundary; do not duplicate state. Likewise, logical view/renderer components can share small presentation helpers without introducing a framework.

The engine may depend on engine modules; it may not import browser modules or require browser globals. Browser modules may consume engine types/operations and presentation collaborators. `src/main.ts` is the composition root. Test helpers cannot be imported by product sources. Avoid public mutable scenario-loading APIs solely to simplify tests.

## Tooling and artifacts

| Location | Owner and disposition |
| --- | --- |
| `package.json`, `package-lock.json` | Application dependencies, scripts, exact resolved versions; lockfile is committed. |
| `tsconfig*.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts` when needed | Type checking/static build/unit/browser configuration; do not create redundant configs without a consumer. |
| `node_modules/`, `dist/`, `coverage/`, `test-results/`, `playwright-report/` | Generated dependency/build/test output; ignored by Git. Required evidence is summarized or selected into owning reports rather than committing all transient output. |
| Root `.gitignore` and ignored repository credential file | Repository maintenance; credential exclusion remains effective and secrets never enter commits/reports. |

Script interface: `dev`, `build`, `preview`, `typecheck`, `test`, `test:e2e` and `test:e2e:stable`. README records verified setup/check commands, exact stable browser versions, external provisioning and sandbox method limits. Production feature paths live in tests/e2e/features.spec.ts; stable-firefox.mjs owns unpatched Firefox native acceptance and preloads randomness before startup. The built site lives in `dist/` and must operate from static HTTP serving without a backend.

## Documentation and execution ownership

Root `README.md` owns product introduction, user controls, setup/build/test instructions, demo-context disclosure, and navigation. Root `AGENTS.md` owns concise agent orientation and current governing links/command evidence. Root `AI_DISCLOSURE.md`, `SDD-MANAGER.md`, and `LICENSE` retain repository-wide roles.

`docs/dev/PROJECT.md`, `ARCHITECTURE.md`, `DECOMPOSITION.md`, `SPEC.md`, `PLAN.md`, and `layout.md` are the canonical main owners. Adjacent SPEC/PLAN/TASKS review reports cover their roots and applicable children. No document children are needed for this scope.

[TASKS](TASKS.md) owns the complete Phase 1/2 milestone/task hierarchy; do not maintain a second executable checklist. Baseline milestone reports belong at `docs/dev/reports/phases/1/<milestone-id>.md`; the phase report belongs at `docs/dev/reports/phases/1/PHASE-REPORT.md`; the final baseline report belongs at `docs/dev/reports/IMPLEMENTATION-REPORT.md`. Phase review milestone 1.5 produces the phase/final reports, not an additional delivery-milestone report.

Modern-feature accepted sources/QC are historical snapshots under docs/dev/features/001_2606a72-modern-features/ with basenames retained. Feature milestone reports remain reports/2.1.md–2.4.md; PHASE-REPORT.md is in that reports child and IMPLEMENTATION-REPORT.md directly under the package. These reports do not move into the baseline phase tree. Closed records remain unchanged and outside routine current validation.

## Placement gate

Every significant logical component has a source/check home, and browser integration has one composition root. TASKS may choose bounded touched paths from this map; a genuine new ownership need requires a scoped layout amendment and affected conformance recheck. No placement choice blocks current task ownership under the accepted layout.
