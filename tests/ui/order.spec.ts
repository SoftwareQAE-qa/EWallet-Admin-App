import { test, expect } from '../../src/fixtures/auth';
import { OrderPage } from '../../src/pages/OrderPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';

test.describe('Order', () => {
  test('EW_19:Validate an "Import orders" button is visible and clickable', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);
    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();
  });
  test('EW_20:Validate "Import orders" page loads', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);
    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();
    await orderPage.assertImportOrdersPageLoaded();
  });

  test('EW_21: Validate "Download Template" button is visible and clickable', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);

    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();

    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();
    await orderPage.validateDownloadTemplateButton();
  });


  test('EW_22: Validate file upload with valid Excel file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);

    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();

    // Steps 2–5
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();

    // Step 6: upload Excel file
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await orderPage.uploadValidExcelFile(filePath);
  });

  test('EW_23: Validate file upload with valid CSV file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);

    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();

    // Steps 2–5
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();

    // Step 6: upload CSV file
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await orderPage.uploadValidCsvFile(filePath);
  });

  test('EW_24: Validate "Import Orders" button after valid file upload', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);

    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();

    // Steps 2–5
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();

    // Steps 6–7
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx'); // or valid-orders.csv
    await orderPage.completeImportOrders(filePath);
  });


  test('EW_25: Validate optional fields are accepted in Import Orders', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);

    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();

    // Steps 2–5
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();

    // Steps 6–7: upload file with optional fields //src\fixtures\valid-orders-with-optional-fields.xlsx
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await orderPage.completeImportOrdersWithOptionalFields(filePath);
  });


  test('EW_26: Validate multiple platforms under same orders', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const orderPage = new OrderPage(page);
    const dash = new DashboardPage(page);

    await orderPage.assertLoaded();
    await expect(dash.header()).toBeVisible();
    await dash.addNewOrderButtonAndValidate();
    await orderPage.validateImportOrdersButton();
    await orderPage.uploadMultiPlatformFile();
  });







});