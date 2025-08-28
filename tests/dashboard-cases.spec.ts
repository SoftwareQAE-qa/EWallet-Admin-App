import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TwoFAPage } from '../pages/TwoFAPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TOTPUtils } from '../utils/totpUtils';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('Dashboard Test Cases', () => {
  let loginPage: LoginPage;
  let twoFAPage: TwoFAPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects for each test
    loginPage = new LoginPage(page);
    twoFAPage = new TwoFAPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Perform login for each test (simplified approach)
    await loginPage.navigateToLogin();
    await loginPage.fillEmail(process.env.EMAIL!);
    await loginPage.fillPassword(process.env.PASSWORD!);
    await loginPage.clickSignIn();
    
    // Complete 2FA authentication
    await loginPage.waitFor2FAPage();
    const twoFACode = TOTPUtils.generateCurrentTOTP(process.env.TOTP_SECRET!);
    await twoFAPage.submitOTP(twoFACode);
    
    // Wait for dashboard and verify it's loaded
    await twoFAPage.waitForDashboard();
    await dashboardPage.verifyDashboardLoaded();
  });

  test('EW_09 - Validate that the Dashboard is displaying', async ({ page }) => {
    // Step 1: Log in as Admin (handled by project config)
    // Step 2: Observe the Dashboard
    
    // Verification: Dashboard is displayed with all widgets and information
    await expect(dashboardPage.isDashboardVisible()).toBeTruthy();
    await expect(dashboardPage.isTotalOrdersCardVisible()).toBeTruthy();
    await expect(dashboardPage.isTotalVolumeSentCardVisible()).toBeTruthy();
    await expect(dashboardPage.isNetProfitCardVisible()).toBeTruthy();
    await expect(dashboardPage.isPendingOrdersCardVisible()).toBeTruthy();
    await expect(dashboardPage.isUnmatchedSendRequestsCardVisible()).toBeTruthy();
    await expect(dashboardPage.isDelayedOrdersCardVisible()).toBeTruthy();
    await expect(dashboardPage.isMismatchTransactionsCardVisible()).toBeTruthy();
    await expect(dashboardPage.isAddNewOrderButtonVisible()).toBeTruthy();
  });

  test('EW_10 - Validate that the Total Orders card is visible and showing actual number', async ({ page }) => {
    // Step 1: Log in as Admin (handled by project config)
    // Step 2: Check the "Total Orders" card on Dashboard
    
    // Verification: "Total Orders" card is visible and displays actual number counting from the table
    await expect(dashboardPage.isTotalOrdersCardVisible()).toBeTruthy();
    const totalOrders = await dashboardPage.getTotalOrdersValue();
    expect(totalOrders).toBeGreaterThan(0);
  });

  test('EW_11 - Validate that the Total Volume Sent card is visible', async ({ page }) => {
    // Step 1: Log in as Admin (handled by project config)
    // Step 2: Check "Total Volume Sent" card
    
    // Verification: Displays correct currency and value (e.g., $500.00)
    await expect(dashboardPage.isTotalVolumeSentCardVisible()).toBeTruthy();
    const totalVolume = await dashboardPage.getTotalVolumeSentValue();
    expect(totalVolume).toMatch(/^\$[\d,]+\.\d{2}$/);
  });

  test('EW_12 - Validate that Net Profit card is visible', async ({ page }) => {
    // Step 1: Log in as Admin (handled by project config)
    // Step 2: Check "Net Profit" card
    
    // Verification: "Net Profit" card is visible and value is shown
    await expect(dashboardPage.isNetProfitCardVisible()).toBeTruthy();
    const netProfit = await dashboardPage.getNetProfitValue();
    expect(netProfit).toMatch(/^\$[\d,]+\.\d{2}$/);
  });

  test('EW_13 - Validate that Pending Orders card is visible', async ({ page }) => {
    // Step 1: Log in as Admin (handled by project config)
    // Step 2: View "Pending Orders" card
    
    // Verification: Displays number of pending orders correctly
    await expect(dashboardPage.isPendingOrdersCardVisible()).toBeTruthy();
    const pendingOrders = await dashboardPage.getPendingOrdersValue();
    expect(pendingOrders).toBeGreaterThanOrEqual(0);
  });

  test('EW_14 - Validate Unmatched Send Requests card and link', async ({ page }) => {
    // Step 1: Log in as Admin (handled by project config)
    // Step 2: Locate "Unmatched Send Requests" card
    await expect(dashboardPage.isUnmatchedSendRequestsCardVisible()).toBeTruthy();
    
    // Step 3: Click on "Click to see breakdown"
    await dashboardPage.clickUnmatchedSendRequestsBreakdown();
    
    // Verification: Redirects to breakdown page or displays modal
    await expect(dashboardPage.isBreakdownModalVisible()).toBeTruthy();
  });

  test('EW_15 - Validate Delayed Orders card and link', async ({ page }) => {
    // Step 1: Log in as Admin (already done in beforeEach)
    // Step 2: Click "Manage Delayed Orders"
    await expect(dashboardPage.isDelayedOrdersCardVisible()).toBeTruthy();
    await dashboardPage.clickManageDelayedOrders();
    
    // Verification: Navigates to Delayed Orders management page
    await expect(page).toHaveURL(/\/admin\/sub-orders/);
  });

  test('EW_16 - Validate Mismatch Transactions card and link', async ({ page }) => {
    // Step 1: Log in as Admin (already done in beforeEach)
    // Step 2: Click "View Over/Under Sends"
    await expect(dashboardPage.isMismatchTransactionsCardVisible()).toBeTruthy();
    await dashboardPage.clickViewOverUnderSends();
    
    // Verification: Navigates to mismatch details page
    await expect(page).toHaveURL(/\/admin\/mismatch-transactions/);
  });

  test('EW_17 - Validate that "Add New Order" button is visible', async ({ page }) => {
    // Step 1: Log in as Admin (already done in beforeEach)
    // Step 2: Locate the orange "Add New Order" button
    
    // Verification: Button is visible and clickable
    await expect(dashboardPage.isAddNewOrderButtonVisible()).toBeTruthy();
  });
});
