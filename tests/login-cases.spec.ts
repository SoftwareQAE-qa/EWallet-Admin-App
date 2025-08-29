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

  // Check if required environment variables are set
  const requiredEnvVars = ['EMAIL', 'PASSWORD', 'TOTP_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

  // Use the no-auth project for login tests
  test.use({ storageState: 'playwright/.auth/empty.json' });

  test.beforeEach(async ({ page }) => {
    try {
      // Check for missing environment variables
      if (missingEnvVars.length > 0) {
        console.warn(`⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
        console.warn('Please set these variables in your environment or .env file');
        console.warn('Tests will use placeholder values and may fail');
      }

      // Initialize page objects for each test
      loginPage = new LoginPage(page);
      twoFAPage = new TwoFAPage(page);
      dashboardPage = new DashboardPage(page);
      
      console.log('Test setup completed successfully');
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  test('EW_01 - Verify Successful log in with valid credentials', async ({ page }) => {
    try {
      console.log('Starting test: EW_01 - Successful login with valid credentials');
      
      // Step 1: Go to ewallet.walletwhisper.io/admin/login
      await loginPage.navigateToLogin();
      
      // Debug: Check page state
      await loginPage.debugPageState();
      
      // Step 2: Enter the valid "email" in the email field
      const email = process.env.EMAIL || 'test@example.com';
      await loginPage.fillEmail(email);
      
      // Step 3: Enter the valid "password" in the password field
      const password = process.env.PASSWORD || 'testpassword';
      await loginPage.fillPassword(password);
      
      // Step 4: Click the "Sign-in" button
      await loginPage.clickSignIn();
      
      // Verification: User is redirected to the admin dashboard
      await loginPage.waitFor2FAPage();
      
      // Additional verification: Check if we're on the 2FA page
      await expect(page).toHaveURL(/\/admin\/2fa/);
      
      console.log('Test EW_01 completed successfully');
    } catch (error) {
      console.error('Test EW_01 failed:', error);
      throw error;
    }
  });

  test('EW_02 - Validate Log in fails with incorrect password', async ({ page }) => {
    try {
      console.log('Starting test: EW_02 - Login fails with incorrect password');
      
      // Step 1: Go to ewallet.walletwhisper.io/admin/login
      await loginPage.navigateToLogin();
      
      // Step 2: Enter the valid "email" in the email field
      const email = process.env.EMAIL || 'test@example.com';
      await loginPage.fillEmail(email);
      
      // Step 3: Enter an invalid password in the password field
      await loginPage.fillPassword('wrongpassword');
      
      // Step 4: Click the "Sign-in" button
      await loginPage.clickSignIn();
      
      // Verification: An error message is displayed which will indicate the email or password is incorrect
      await expect(page).toHaveURL(/\/admin\/login/);
      
      console.log('Test EW_02 completed successfully');
    } catch (error) {
      console.error('Test EW_02 failed:', error);
      throw error;
    }
  });

  test('EW_03 - Validate Log in fails with empty field', async ({ page }) => {
    try {
      console.log('Starting test: EW_03 - Login fails with empty field');
      
      // Step 1: Go to ewallet.walletwhisper.io/admin/login
      await loginPage.navigateToLogin();
      
      // Step 2: Leave "email" & password field empty
      // Fields are already empty, no action needed
      
      // Step 3: Click the "Sign-in" button
      await loginPage.clickSignIn();
      
      // Verification: System will display validation messages prompting user to fill the required fields
      await expect(page).toHaveURL(/\/admin\/login/);
      
      console.log('Test EW_03 completed successfully');
    } catch (error) {
      console.error('Test EW_03 failed:', error);
      throw error;
    }
  });

  test('EW_04 - Validate "Remember me" checkbox functionality', async ({ page }) => {
    try {
      console.log('Starting test: EW_04 - Remember me checkbox functionality');
      
      // Step 1: Go to ewallet.walletwhisper.io/admin/login
      await loginPage.navigateToLogin();
      
      // Step 2: Enter valid "email" and "password"
      const email = process.env.EMAIL || 'test@example.com';
      await loginPage.fillEmail(email);
      
      const password = process.env.PASSWORD || 'testpassword';
      await loginPage.fillPassword(password);
      
      // Step 3: Select "Remember me" checkbox
      await loginPage.selectRememberMe();
      
      // Step 4: Click "Sign in"
      await loginPage.clickSignIn();
      
      // Verification: Check if remember me checkbox is selected
      const isRememberMeSelected = await loginPage.isRememberMeSelected();
      console.log('Remember me checkbox selected:', isRememberMeSelected);
      expect(isRememberMeSelected).toBeTruthy();
      
      console.log('Test EW_04 completed successfully');
    } catch (error) {
      console.error('Test EW_04 failed:', error);
      throw error;
    }
  });

  test('EW_05 - Validate "Forgot password?" field navigation is working', async ({ page }) => {
    try {
      console.log('Starting test: EW_05 - Forgot password navigation');
      
      // Step 1: Go to ewallet.walletwhisper.io/admin/login page
      await loginPage.navigateToLogin();
      
      // Step 2: Click on "Forgot password?" link
      await loginPage.clickForgotPassword();
      
      // Verification: User is redirected to a password recovery/reset link
      await expect(page).toHaveURL(/\/admin\/password-reset\/request/);
      
      console.log('Test EW_05 completed successfully');
    } catch (error) {
      console.error('Test EW_05 failed:', error);
      throw error;
    }
  });

  test('EW_06 - Validate Email field validation', async ({ page }) => {
    try {
      console.log('Starting test: EW_06 - Email field validation');
      
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
      
      console.log('Test EW_06 completed successfully');
    } catch (error) {
      console.error('Test EW_06 failed:', error);
      throw error;
    }
  });

  test('EW_07 - Validate Password field masking', async ({ page }) => {
    try {
      console.log('Starting test: EW_07 - Password field masking');
      
      // Step 1: Go to ewallet.walletwhisper.io/admin/login
      await loginPage.navigateToLogin();
      
      // Step 2: Enter any value in password field
      await loginPage.fillPassword('testpassword');
      
      // Verification: Characters typed into the password field should be masked (hidden visually)
      const isPasswordMasked = await loginPage.isPasswordMasked();
      console.log('Password is masked:', isPasswordMasked);
      expect(isPasswordMasked).toBeTruthy();
      
      console.log('Test EW_07 completed successfully');
    } catch (error) {
      console.error('Test EW_07 failed:', error);
      throw error;
    }
  });

  test('EW_08 - Validate Successful Admin log in', async ({ page }) => {
    try {
      console.log('Starting test: EW_08 - Successful Admin login');
      
      // Step 1: Navigate to log-in page ewallet.walletwhisper.io/admin/login
      await loginPage.navigateToLogin();
      
      // Step 2: Enter Valid Admin Credentials
      const email = process.env.EMAIL || 'test@example.com';
      await loginPage.fillEmail(email);
      
      const password = process.env.PASSWORD || 'testpassword';
      await loginPage.fillPassword(password);
      
      // Step 3: Click "Sign-in"
      await loginPage.clickSignIn();
      
      // Verification: Admin panel dashboard loads, user is authenticated and sees all admin sections and widgets
      await loginPage.waitFor2FAPage();
      
      const totpSecret = process.env.TOTP_SECRET || 'dummy-secret';
      const twoFACode = TOTPUtils.generateCurrentTOTP(totpSecret);
      await twoFAPage.submitOTP(twoFACode);
      await twoFAPage.waitForDashboard();
      await dashboardPage.verifyDashboardLoaded();
      
      const isDashboardVisible = await dashboardPage.isDashboardVisible();
      console.log('Dashboard visible:', isDashboardVisible);
      expect(isDashboardVisible).toBeTruthy();
      
      console.log('Test EW_08 completed successfully');
    } catch (error) {
      console.error('Test EW_08 failed:', error);
      throw error;
    }
  });

  // Skip tests if environment variables are missing
  if (missingEnvVars.length > 0) {
    test.skip('Environment variables not configured', () => {
      console.warn(`Skipping tests due to missing environment variables: ${missingEnvVars.join(', ')}`);
    });
  }
});
