import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Dashboard', () => {
  test('EW_09: Validate that the Dashboard is displaying correctly after login', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await expect(dash.header()).toBeVisible();
  });
  test('EW_10: Validate that the Total Orders card is visible and showing actual number', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.validateTotalOrders();
  });
  test('EW_11: Validate that the Total Volume Sent card is visible and showing actual number', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.validateTotalVolumeSent();
  });
  test('EW_12: Validate that Net Profit card is visible', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.validateNetProfit();
  });
  test('EW_13: Validate that Pending Orders card is visible', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
  });
  test('EW_14: Validate that clicking "Click to see breakdown" opens details', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.validateUnmatchedSendRequests();
    await dash.clickToSeeBreakdown();
  });
  test('EW_15: Validate that "Manage Delayed Orders" button navigates correctly', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.manageDelayedOrdersButton();
  });
  test.skip('EW_16: Validate Mismatch Transactions card and link', async ({ page, loginAsAdmin }) => {
    //need to fix this test
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.validateMismatchTransactionsCard();
  });
  test('EW_17: Validate that “Add New Order” button is visible and functional', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.validateAddNewOrderButton();
  });
  test('EW_18:Validate "Add New Order" page loads successfully', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    await dash.addNewOrderButtonAndValidate();
  });
});
