// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: parseInt(process.env.TIMEOUT_DEFAULT || '60000'),
  use: {
    baseURL: process.env.BASE_URL || 'https://ewallet.walletwhisper.io',
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
