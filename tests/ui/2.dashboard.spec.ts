import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Dashboard Test cases', () => {
  test('EW_09: Validate that the Dashboard is displaying correctly after login', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await expect(dashboardPage.header()).toBeVisible();
  });
  test('EW_10: Validate that the Total Orders card is visible and showing actual number', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.validateTotalOrders();
  });
  test('EW_11: Validate that the Total Volume Sent card is visible and showing actual number', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.validateTotalVolumeSent();
  });
  test('EW_12: Validate that Net Profit card is visible', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.validateNetProfit();
  });
  test('EW_13: Validate that Pending Orders card is visible', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
  });
  test('EW_14: Validate that clicking "Click to see breakdown" opens details', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.validateUnmatchedSendRequests();
    await dashboardPage.clickToSeeBreakdown();
  });
  test('EW_15: Validate that "Manage Delayed Orders" button navigates correctly', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.manageDelayedOrdersButton();
  });
  test.skip('EW_16: Validate Mismatch Transactions card and link', async ({ page, loginAsAdmin }) => {
    //need to fix this test
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.validateMismatchTransactionsCard();
  });
  test('EW_17: Validate that “Add New Order” button is visible and functional', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.validateAddNewOrderButton();
  });
  test('EW_18:Validate "Add New Order" page loads successfully', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.validateCreateNewOrderForm()
  });
});
