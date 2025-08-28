import { test, expect } from '@playwright/test';

import * as dotenv from 'dotenv';
dotenv.config(); // Load .env variables
import { LoginPage } from '../../src/pages/LoginPage';
// If Login2FA is not exported at all, ensure it is exported from '../login-2fa.spec'

test.describe('Admin Login', () => {
  test('EW_01: Valid login using 2FA takes admin to dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWith2FA(process.env.EMAIL!, process.env.PASSWORD!);
  });

  test('EW_02: Invalid email, valid password shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('invalid@example.com', process.env.PASSWORD!);
    //await expect(page.getByText(/These credentials do not match our records.|credentials|not found/i)).toBeVisible();
    await expect(page.getByText(/These credentials do not match our records./i)).toBeVisible();

  });
  test('EW_03: Valid email, invalid password shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(process.env.EMAIL!, 'wrongpass123!');
    await expect(page.getByText(/These credentials do not match our records./i)).toBeVisible();
  });

  test('EW_04: Empty fields show validation', async ({ page }) => {
    const login = new LoginPage(page);
    const password = page.getByLabel('Password');
    await login.open();
    await login.signInButton().click();
    // Grab the browser validation message for password field
    const message = await password.evaluate(el => (el as HTMLInputElement).validationMessage);

    // Assert exact text (depends on browser + locale)
    expect(message).toBe('Please fill out this field.');
  });

  test('EW_05: Forgot password link navigates to reset page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.forgotPasswordLink().click();
    await expect(page).toHaveURL(/password-reset/i);
  });

  test('EW_06: Show/Hide password toggle works', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.passwordInput().fill('secret123!');
    await login.showPasswordToggle().click();
    await expect(login.passwordInput()).toHaveAttribute('type', /text/i);
    await login.showPasswordToggle().click();
    await expect(login.passwordInput()).toHaveAttribute('type', /password/i);
  });

  test('EW_07: Remember me checkbox can be toggled', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    const cb = login.rememberMeCheckbox();
    await cb.check();
    await expect(cb).toBeChecked();
    await cb.uncheck();
    await expect(cb).not.toBeChecked();
  });
});