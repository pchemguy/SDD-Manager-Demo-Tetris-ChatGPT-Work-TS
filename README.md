# Tetris — SDD Manager demonstration

A greenfield browser game in TypeScript demonstrating practical use of SDD Manager. The accepted design covers a classic baseline MVP, followed by a separate modern-feature expansion. The classic desktop baseline is implemented with progression, held-key controls, pause/focus handling, Restart and DPI-aware Canvas presentation. The complete baseline is verified and published on main; the final implementation report records its integration evidence.

The demonstration targets ChatGPT Work web with 6.1 Sol Medium and the standard ChatGPT cloud computer sandbox. These are requested conditions; the repository does not independently attest the active model configuration.

The conversation context includes other available and activated plugins/skills and information from prior Tetris conversations. This is not an isolated assessment of SDD Manager alone.

Development uses [SDD Manager](SDD-MANAGER.md). See the [AI-assisted development disclosure](AI_DISCLOSURE.md).

## Design

- [Project brief](docs/dev/PROJECT.md)
- [Architecture](docs/dev/ARCHITECTURE.md)
- [Component decomposition](docs/dev/DECOMPOSITION.md)
- [Behavioral specification](docs/dev/SPEC.md)
- [Specification conformance review](docs/dev/SPEC-REVIEW-REPORT.md)
- [Delivery plan](docs/dev/PLAN.md)
- [Physical layout](docs/dev/layout.md)
- [Plan conformance review](docs/dev/PLAN-REVIEW-REPORT.md)
- [Executable tasks](docs/dev/TASKS.md)
- [Task conformance review](docs/dev/TASKS-REVIEW-REPORT.md)

The specification and PLAN/layout are accepted. TASKS and full Phase 1 inline execution with GitHub tracking are accepted. The live browser loop, Canvas board/preview, statistics, arrow controls and Restart are present. The [modern-feature campaign](docs/dev/features/001_2606a72-modern-features/README.md) has accepted design, specification, plan and layout. [FEATURE-TASKS](docs/dev/FEATURE-TASKS.md) and its [conformance review](docs/dev/FEATURE-TASKS-REVIEW-REPORT.md) are accepted for full Phase 2 inline execution with GitHub tracking. Preparation is integrated and published as 71f6275; all 19 task associations are verified. Ghost and delayed hard drop are implemented on the feature branch; bag, hold and kicks remain pending.

## Development setup

Use Node 24 or later and npm. In the repository directory (Windows CMD or a terminal):

```text
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
npx playwright install chromium firefox
npm run test:e2e
```

Run dev or preview in its own terminal. Dev serves http://127.0.0.1:5173; preview serves http://127.0.0.1:4173.

Arrow Left/Right move (hold to repeat), Arrow Up rotates clockwise, Arrow Down soft-drops (hold to repeat), and Space hard-drops once per press and P pauses/resumes after release. The most recent horizontal key wins. Focus loss/hidden page pauses; return requires P. Restart starts fresh and clears held controls. Restart also works by Tab then Enter. The desktop layout adapts to viewport height and device pixel ratio. Serving requires HTTP (use dev/preview), rather than opening index.html directly. After build, dist is the complete static deployment directory; it requires no application backend. Vite binds loopback by default.

Dependency versions are pinned in package.json/package-lock.json. Official requirements were checked in [Vite](https://vite.dev/guide/), [Vitest](https://vitest.dev/guide/), and [Playwright](https://playwright.dev/docs/browsers).

## Browser verification

Production static acceptance was verified on 2026-10-09 against the official current-stable versions:

| Target   | Actual runtime | Method                                                                                                                             |
| -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Chromium | 155.0.8059.39  | Official Chrome for Testing Stable headless shell, Playwright; seven production checks, DPR 1/2 and desktop resize.                |
| Firefox  | 157.0.1        | Unpatched Mozilla release, geckodriver 0.37.1/W3C WebDriver; native keys/tab visibility, two sessions, DPR 1/2 and desktop resize. |

Version sources: [Chrome for Testing stable metadata](https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json), [Mozilla product details](https://product-details.mozilla.org/1.0/firefox_versions.json). [Mozilla geckodriver guidance](https://firefox-source-docs.mozilla.org/testing/geckodriver/Usage.html) explains testing an unpatched Firefox release; Playwright's bundled Firefox is a separate engine.

The sandbox rejects Unix sockets required by full Chrome's ProcessSingleton, so Chromium acceptance uses the official stable headless desktop engine. It does not attest Chrome browser-chrome/UI integration or graphical OS focus. Native Firefox tab switching verifies actual blur/visibility behavior. Bundled Playwright engines are useful additional checks, not substitutes for current-stable acceptance.

For current-stable checks, provision those official browser binaries and geckodriver. Set TETRIS_CHROMIUM_EXECUTABLE, TETRIS_FIREFOX_EXECUTABLE and TETRIS_GECKODRIVER to absolute executable paths, then run:

```text
npm run build
npm run test:e2e:stable
```

The stable runner fails if Firefox/driver paths are missing; it does not skip compatibility checks. It serves the production build itself and writes ignored screenshots/logs to test-results. On Windows CMD use `set VARIABLE=C:\path\to\binary.exe`; on a POSIX terminal use `export VARIABLE=/path/to/binary`. Browser provisioning is external to npm ci.

In this sandbox only, Firefox needs process-scoped MOZ_DISABLE_CONTENT_SANDBOX=1, MOZ_DISABLE_RDD_SANDBOX=1 and MOZ_DISABLE_GPU_SANDBOX=1 because user-namespace sandbox operations are unavailable. Chromium uses process-scoped FONTCONFIG_PATH pointing to an owned font configuration with installed DejaVu fonts. Initial Chromium CDN downloads returned HTML; older packaged Chromium 153 and Playwright Firefox 157 probes were diagnostic setup evidence and are not the final accepted versions. No global Python or font environment was modified.

## Engine API

The browser-independent entry is `Game` in `src/engine/game.ts`:

```ts
import { Game } from "./src/engine/game";

const game = new Game(() => 0.15); // Controlled conforming source; repeated O pieces.
const changed = game.apply("left");
game.advance(1000); // Elapsed gameplay milliseconds.
const snapshot = game.snapshot();
```

`apply` accepts left, right, rotateClockwise, softDrop, hardDrop, pause, resume and restart. It returns whether observable state changed; collisions and O rotation return false. Restart returns true and takes two fresh draws from the current source. Supplied randomness must produce finite values in [0,1).

Hard drop adds two points per translated row and waits the full current gravity interval before locking. Ghost outlines predict the same landing; movement during the delay remains possible.

`advance` accepts finite nonnegative milliseconds, preserves surplus time and lock/gravity ordering, and throws RangeError before mutation for invalid values in every lifecycle state. Pause preserves timer remainders; paused/game-over updates are ignored. `snapshot` returns detached board rows and active coordinates, ghost landing coordinates, next kind, status, score, lines, level and gravity interval.

Browser modules own their external boundaries: Input exposes repeat deadlines; Controller consumes finite monotonic clock/event inputs and owns disposal; Renderer consumes snapshots and working 2D canvases; View updates textual state only when changed. None owns a second game-rule state.

## Checks and demonstration

Engine checks run without browser globals. Controller/input checks control events and time; production browser checks inspect native keys, visible state, pixels, desktop/DPI geometry and lifecycle. Stable Firefox uses a BiDi preload to install controlled randomness before engine creation; the production app exposes no state loader. See the [implementation report](docs/dev/reports/IMPLEMENTATION-REPORT.md) and [milestone reports](docs/dev/reports/phases/1/) for code review, repair and verification evidence. Generated output, screenshots/logs and credentials are excluded from Git.
