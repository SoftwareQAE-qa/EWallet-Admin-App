import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TwoFAPage } from '../pages/TwoFAPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TOTPUtils } from '../utils/totpUtils';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('Login Test Cases', () => {
  let loginPage: LoginPage;
  let twoFAPage: TwoFAPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects for each test
    loginPage = new LoginPage(page);
    twoFAPage = new TwoFAPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('EW_01 - Verify Successful log in with valid credentials', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Enter the valid "email" in the email field
    await loginPage.fillEmail(process.env.EMAIL!);
    
    // Step 3: Enter the valid "password" in the password field
    await loginPage.fillPassword(process.env.PASSWORD!);
    
    // Step 4: Click the "Sign-in" button
    await loginPage.clickSignIn();
    
    // Verification: User is redirected to the admin dashboard
    await loginPage.waitFor2FAPage();
    
    // Additional verification: Check if we're on the 2FA page
    await expect(page).toHaveURL(/\/admin\/2fa/);
  });

  test('EW_02 - Validate Log in fails with incorrect password', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Enter the valid "email" in the email field
    await loginPage.fillEmail(process.env.EMAIL!);
    
    // Step 3: Enter an invalid password in the password field
    await loginPage.fillPassword('wrongpassword');
    
    // Step 4: Click the "Sign-in" button
    await loginPage.clickSignIn();
    
    // Verification: An error message is displayed which will indicate the email or password is incorrect
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('EW_03 - Validate Log in fails with empty field', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Leave "email" & password field empty
    // Fields are already empty, no action needed
    
    // Step 3: Click the "Sign-in" button
    await loginPage.clickSignIn();
    
    // Verification: System will display validation messages prompting user to fill the required fields
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('EW_04 - Validate "Remember me" checkbox functionality', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Enter valid "email" and "password"
    await loginPage.fillEmail(process.env.EMAIL!);
    await loginPage.fillPassword(process.env.PASSWORD!);
    
    // Step 3: Select "Remember me" checkbox
    await loginPage.selectRememberMe();
    
    // Step 4: Click "Sign in"
    await loginPage.clickSignIn();
    
    // Verification: Check if remember me checkbox is selected
    await expect(loginPage.isRememberMeSelected()).toBeTruthy();
  });

  test('EW_05 - Validate "Forgot password?" field navigation is working', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login page
    await loginPage.navigateToLogin();
    
    // Step 2: Click on "Forgot password?" link
    await loginPage.clickForgotPassword();
    
    // Verification: User is redirected to a password recovery/reset link
    await expect(page).toHaveURL(/\/admin\/password-reset\/request/);
  });

  test('EW_06 - Validate Email field validation', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Enter "admin" without "@" or domain into the email field
    await loginPage.fillEmail('admin');
    
    // Step 3: Enter "password" into the password field
    await loginPage.fillPassword('password');
    
    // Step 4: Click "sign in"
    await loginPage.clickSignIn();
    
    // Verification: System should display an error message "Please include an "@" in the email address"
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('EW_07 - Validate Password field masking', async ({ page }) => {
    // Step 1: Go to ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Enter any value in password field
    await loginPage.fillPassword('testpassword');
    
    // Verification: Characters typed into the password field should be masked (hidden visually)
    await expect(loginPage.isPasswordMasked()).toBeTruthy();
  });

  test('EW_08 - Validate Successful Admin log in', async ({ page }) => {
    // Step 1: Navigate to log-in page ewallet.walletwhisper.io/admin/login
    await loginPage.navigateToLogin();
    
    // Step 2: Enter Valid Admin Credentials
    await loginPage.fillEmail(process.env.EMAIL!);
    await loginPage.fillPassword(process.env.PASSWORD!);
    
    // Step 3: Click "Sign-in"
    await loginPage.clickSignIn();
    
    // Verification: Admin panel dashboard loads, user is authenticated and sees all admin sections and widgets
    await loginPage.waitFor2FAPage();
    const twoFACode = TOTPUtils.generateCurrentTOTP(process.env.TOTP_SECRET!);
    await twoFAPage.submitOTP(twoFACode);
    await twoFAPage.waitForDashboard();
    await dashboardPage.verifyDashboardLoaded();
    await expect(dashboardPage.isDashboardVisible()).toBeTruthy();
  });
});
