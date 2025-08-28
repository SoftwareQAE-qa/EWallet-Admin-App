import { test, expect } from '@playwright/test';
import { authenticator } from 'otplib';// Use environment variables for credentials and TOTP secret
const EMAIL = 'chhabra.odesk.mca1@gmail.com';
const PASSWORD = 'password';
const TOTP_SECRET = 'MGNA5HIZKTHIFEYZ';test('Google2FA login - submit OTP', async ({ page }) => {  // Step 1: Go to login page
  await page.goto('https://staging.ewalletcashier.com/admin/login');
  console.log('Reached login page');  // Step 2: Fill credentials and login
  await page.getByLabel(/email address/i).fill(EMAIL);
  await page.getByLabel(/password/i).fill(PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();  // Step 3: Wait for 2FA page
  await page.waitForURL(/\/admin\/2fa/);  // Step 4: Generate current OTP from your pre-shared TOTP secret
  const twoFACode = authenticator.generate(TOTP_SECRET);  // Step 5: Enter OTP
  await page.locator('input[type="text"], input[type="tel"]').first().fill(twoFACode);
  await page.getByRole('button', { name: /verify/i }).click();  // Step 6: Wait for dashboard
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });  // Step 7: Verify dashboard content
  await expect(page.getByText(/dashboard/i)).toBeVisible();});