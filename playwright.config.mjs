import { defineConfig } from '@playwright/test';

// TEST_PORT – inny port serwera testów (kilka kopii repozytorium testowanych naraz)
const port = Number(process.env.TEST_PORT || 8765);

export default defineConfig({
  testDir: 'tests',
  timeout: 90000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${port}` },
  webServer: { command: `PORT=${port} node tests/server.mjs`, port, reuseExistingServer: true },
});
