import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 50_000,
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: 'list',
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5197',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5197', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 960 } } },
    { name: 'mobile-webkit', testIgnore: '**/touch.spec.ts', use: { browserName: 'webkit', viewport: { width: 402, height: 874 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } },
  ],
});
