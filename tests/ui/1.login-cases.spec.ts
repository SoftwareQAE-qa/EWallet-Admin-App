import { test, expect } from '@playwright/test';

import * as dotenv from 'dotenv';
dotenv.config()
import { LoginPage } from '../../src/pages/LoginPage';
import { authenticator } from 'otplib';

test.describe('Admin Login Test cases', () => {

  test('Get OTP', async () => {
    const twoFACode = authenticator.generate(process.env.TOTP_SECRET!);
    console.log(twoFACode)
  })
  test('EW_01: Verify Successful log in with valid credentials using 2FA', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginWith2FA(process.env.EMAIL!, process.env.PASSWORD!);
  });

  test('EW_02: Validate Log in fails with incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.EMAIL!, 'wrongpass123!');
    await expect(page.getByText(/These credentials do not match our records./i)).toBeVisible();
  });

  test('EW_03: Validate on Login Empty fields show validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const password = page.getByLabel('Password');
    await loginPage.open();
    await loginPage.signInButton().click();
    // Grab the browser validation message for password field
    const message = await password.evaluate(el => (el as HTMLInputElement).validationMessage);

    // Assert exact text (depends on browser + locale)
    expect(message).toBe('Please fill out this field.');
  });

  test('EW_04: Validate "Remember me" checkbox functionality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    const cb = loginPage.rememberMeCheckbox();
    await cb.check();
    await expect(cb).toBeChecked();
    await cb.uncheck();
    await expect(cb).not.toBeChecked();
  });

  test('EW_05: Validate Forgot password link navigates to reset page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.forgotPasswordLink().click();
    await expect(page).toHaveURL(/password-reset/i);
  });

  test('EW_06: Invalid email, valid password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('invalid@example.com', process.env.PASSWORD!);
    await expect(page.getByText(/These credentials do not match our records./i)).toBeVisible();
  });
  test('EW_07: Valid email and invalid password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.EMAIL!, 'wrongpassword');
    await expect(page.getByText(/These credentials do not match our records./i)).toBeVisible();
  });

  test('EW_08: Show/Hide password toggle works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.passwordInput().fill('secret123!');
    await loginPage.showPasswordToggle().click();
    await expect(loginPage.passwordInput()).toHaveAttribute('type', /text/i);
    await loginPage.showPasswordToggle().click();
    await expect(loginPage.passwordInput()).toHaveAttribute('type', /password/i);
  });
});