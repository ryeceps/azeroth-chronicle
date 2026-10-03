import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: Boolean(process.env.CI),
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'acceptance',
      testIgnore: '**/rendererPerformance.spec.ts',
    },
    {
      name: 'renderer-performance',
      testMatch: '**/rendererPerformance.spec.ts',
      dependencies: ['acceptance'],
      workers: 1,
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_SKIP_BUILD === '1'
      ? `pnpm preview --host 127.0.0.1 --port ${port}`
      : `pnpm build && pnpm preview --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
