import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4003',
    trace: 'on-first-retry',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Avoid Turbopack for CI build to work around font plugin resolution issues
    command: 'next build && next start -p 4003',
    url: 'http://localhost:4003',
    reuseExistingServer: true,
    timeout: 2 * 60 * 1000,
  },
});

