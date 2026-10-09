/** Unit-check configuration: browser-free engine and controlled browser collaborators. */
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/engine/**/*.test.ts', 'tests/browser/**/*.test.ts'] } });
