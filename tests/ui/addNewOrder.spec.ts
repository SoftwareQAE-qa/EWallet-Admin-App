import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Add New Order Test cases', () => {
  test('EW_18: Validate "Add New Order" page loads successfully', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.validateCreateNewOrderForm()
  });
});
