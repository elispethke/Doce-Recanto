import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "bash scripts/emulators.sh",
      url: "http://127.0.0.1:4000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: `next dev --port ${PORT}`,
      url: BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        NEXT_PUBLIC_USE_FIREBASE_EMULATOR: "true",
      },
    },
  ],
});
