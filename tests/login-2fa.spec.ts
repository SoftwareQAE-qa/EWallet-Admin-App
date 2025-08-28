import { test, expect } from '@playwright/test';
import { authenticator } from 'otplib';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const EMAIL = process.env.EMAIL!;
const PASSWORD = process.env.PASSWORD!;
const TOTP_SECRET = process.env.TOTP_SECRET!;

test('Google2FA login - submit OTP', async ({ page }) => {
  // Step 1: Go to login page
  await page.goto('https://staging.ewalletcashier.com/admin/login');
  console.log('Reached login page');

  // Step 2: Fill credentials and login
  await page.getByLabel(/email address/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Step 3: Wait for 2FA page
  await page.waitForURL(/\/admin\/2fa/);

  // Step 4: Generate current OTP from your pre-shared TOTP secret
  const twoFACode = authenticator.generate(TOTP_SECRET);

  // Step 5: Enter OTP
  await page.locator('input[type="text"], input[type="tel"]').first().fill(twoFACode);
  await page.getByRole('button', { name: /verify/i }).click();

  // Step 6: Wait for dashboard
  await page.waitForURL(/\/admin(\/dashboard)?/);
  // Step 7: Verify dashboard content
  await expect(page.getByText(/dashboard/i)).toBeVisible();
});