// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: process.env.BASE_URL,                 // ✅ so relative paths work
    headless: false,                               // ✅ Run in headed mode (see browser)
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { 
      name: 'chrome', 
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',                         // ✅ Use Chrome specifically
      }, 
    },
  ],
});
