# Modern-feature physical layout delta

## Scope and authority

This proposed allocation supports accepted [FEATURE_DECOMPOSITION](../FEATURE_DECOMPOSITION.md), [FEATURE-SPEC](../FEATURE-SPEC.md), and the proposed [FEATURE-PLAN](../FEATURE-PLAN.md) for [campaign 001_2606a72](../features/001_2606a72-modern-features/README.md). It supplements [main layout](../layout.md) for active feature preparation; it does not silently incorporate feature scope into the main documents. PLAN/layout acceptance is pending. Existing paths below were inspected; new locations are labelled planned. Path allocation does not establish implementation.

## Affected source and check homes

| Owner | Source home | Focused checks/fixtures |
| --- | --- | --- |
| Engine command/snapshot contract | Existing `src/engine/types.ts` | Existing session/snapshot suites; affected browser fixtures/consumers. |
| Per-game seven-bag selector | Existing `src/engine/random.ts`; Game owns one selector instance | Existing `tests/engine/random.test.ts`; planned test-only bag source helper at `tests/helpers/random.ts`. |
| Shared landing and fitting clockwise kick queries | Planned `src/engine/placement.ts`, depending on existing board/piece queries and types | Planned `tests/engine/placement.test.ts`; public session scenarios verify its consumers. |
| Hold, drop, spawn, score and timer coordination | Existing `src/engine/game.ts`; retain progression and geometry owners | Planned `tests/engine/features.test.ts`, plus existing game/timing/boundaries/lifecycle/progression suites. |
| Valid deterministic session construction | No production home | Existing `tests/helpers/scenarios.ts` and planned random helper; adapt affected tests using public commands. |
| Key normalization, one-shot controls and repeat deadlines | Existing `src/browser/input.ts` | Existing `tests/browser/input.test.ts`. |
| Chronological/lifecycle event integration and P latch | Existing `src/browser/controller.ts` | Existing `tests/browser/controller.test.ts`; built-page controls checks. |
| Ghost and held preview rendering | Existing `src/browser/renderer.ts`; one small private piece-preview painter may serve next/held canvases | Existing `tests/browser/renderer.test.ts`; actual pixels/geometry under `tests/e2e/`. |
| Held/availability/status text and controls | Existing `src/browser/view.ts`, `index.html`, `src/styles.css` | Existing view/accessibility/presentation checks. |
| Composition and hold-canvas binding | Existing `src/main.ts` | Production build and browser integration. |
| Production feature paths and stable Firefox acceptance | Planned `tests/e2e/features.spec.ts`; adapt existing play/controls/presentation/accessibility suites and `tests/e2e/stable-firefox.mjs` | Same production static-server lifecycle; randomness preloaded before app startup. |

`placement.ts` owns pure board/piece queries shared by ghost/drop and rotation. It owns no board copy, bag, score, timers or session transitions; Game decides whether/how to apply a candidate. Bag storage is private to a selector instance owned by one Game. No engine module imports DOM/browser code, and no product source imports test helpers. Use existing types/board/geometry rather than a duplicate collision model.

No runtime package, framework, alternate product mode, generated artifact convention or build entry point is required. Existing package/lock/config files retain tooling ownership; amend only when a verified implementation need exists. Existing scripts, generated-output/credential ignores and `dist/` static output retain their roles.

## Documents, reports and ownership

Active feature design, specification, planning and task roots live in `docs/dev/`; adjacent feature QC reports cover their roots and this layout delta. This file owns feature physical placement while active, and FEATURE-PLAN links it directly. Main layout remains the unchanged baseline allocation until accepted feature incorporation. Incorporation will update the main ownership map, link/retain this child as needed or fold its content into the root, and recheck affected current document QC.

FEATURE-TASKS will be the sole feature executable owner. Project Phase 2 does not move feature reports into the completed baseline phase directory. Feature milestone reports are planned at `docs/dev/features/001_2606a72-modern-features/reports/2.<delivery-milestone>.md`; the phase report belongs at that reports directory's `PHASE-REPORT.md`. The final feature report belongs at `docs/dev/features/001_2606a72-modern-features/IMPLEMENTATION-REPORT.md`, directly under the feature prefix. The final phase review milestone produces phase/final reports rather than an extra delivery report.

Eligible completed feature roots and adjacent QC reports are archived under the feature package with repaired links and historical markers through sdd-integrate-feature. This focused layout child must remain discoverable from the resulting current layout if retained; it must not remain a contradictory active delta after incorporation. Current root README/AGENTS links follow actual active/canonical owners. Completed baseline reports remain unchanged.

## Placement readiness

Every affected engine/browser component, fixture, check, artifact and document has one physical owner. The focused query module supports localized work without exposing mutable session state. There is no ambiguous placement that blocks task derivation after PLAN/layout acceptance. FEATURE-TASKS may select concrete touched paths and propose a scoped amendment if implementation reveals a genuine ownership need.
