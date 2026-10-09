# Tetris — SDD Manager demonstration

A greenfield browser game in TypeScript demonstrating practical use of SDD Manager. The accepted design covers a classic baseline MVP, followed by a separate modern-feature expansion. Product implementation has not started.

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

The specification and PLAN/layout are accepted. TASKS and full Phase 1 inline execution with GitHub tracking are accepted. No product build or test commands exist yet.

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

The static setup is implemented; game modules and unit/browser suites are subsequent tasks. Unit tests are not claimed passing before suites exist. Vite binds loopback by default.

Dependency versions are pinned in package.json/package-lock.json. Official requirements were checked in [Vite](https://vite.dev/guide/), [Vitest](https://vitest.dev/guide/), and [Playwright](https://playwright.dev/docs/browsers).

In the demonstration sandbox, the Chromium CDN returned HTML rather than a ZIP. A separately provisioned packaged Chromium 153.0.8010.0 loaded the static page in two successive contexts. Playwright Firefox 157.0 downloaded and launched, but its first page crashed; Firefox page verification is pending. This is setup evidence, not accepted current-stable compatibility. The package extraction avoids archive ownership operations unsupported by the sandbox. An externally provisioned Chromium can be selected through TETRIS_CHROMIUM_EXECUTABLE; its fonts/shared libraries must be configured by that environment. Firefox remains the Playwright-provided engine.
