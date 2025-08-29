// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: parseInt(process.env.TIMEOUT_DEFAULT || '60000'),
  // Remove global setup from here - we'll handle it per project
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
        // Use stored authentication state for authenticated tests
        storageState: 'playwright/.auth/user.json',
      },
      // Global setup only for authenticated tests
      globalSetup: require.resolve('./global-setup'),
    },
    {
      name: 'chrome-no-auth',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        storageState: 'playwright/.auth/empty.json', // No authentication for login tests
      },
      // No global setup for login tests
    }
  ],
});
