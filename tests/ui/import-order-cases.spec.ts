import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { ImportOrdersPage } from '../../src/pages/ImportOrdersPage';
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';

test.describe('Import Orders Test Cases', () => {

  test('EW_19: Validate an "Import orders" Button is visible and clickable', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();
  });

  test('EW_20: Validate "Import orders" modal and content', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Validate the modal content
    await importOrdersPage.validateModalContent();
  });

  test('EW_21: Validate "Download Template" button is visible and clickable', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Click the download template button
    await importOrdersPage.clickDownloadTemplate();
  });

  test('EW_22: Validate file upload with valid Excel file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload Excel file
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await importOrdersPage.uploadFile(filePath);
  });

  test('EW_23: Validate file upload with valid CSV file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload CSV file
    const filePath = path.resolve(__dirname, '../../src/fixtures/multi-platform-order.csv');
    await importOrdersPage.uploadFile(filePath);
  });

  test('EW_24: Validate "Import Orders" button after valid file upload', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload file and click Import Orders button
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await importOrdersPage.completeFileUpload(filePath);
  });

  test('EW_25: Validate optional fields are accepted in Import Orders', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload file with optional fields and complete import
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-with-optional-fields.xlsx');
    await importOrdersPage.completeFileUpload(filePath);
  });

  test('EW_26: Validate multiple platforms under same orders', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload multi-platform file
    const filePath = path.resolve(__dirname, '../../src/fixtures/multi-platform-order.csv');
    await importOrdersPage.uploadFile(filePath);
  });

  test('EW_27: Validate order grouping by order_name', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Validate order grouping functionality
    const filePath = path.resolve(__dirname, '../../src/fixtures/multi-platform-order.csv');
    await importOrdersPage.validateOrderGrouping(filePath);
    
    // Click the Import Orders button to complete the process
    await importOrdersPage.clickImportOrdersAfterUpload();
  });

  test('EW_28: Validate max file size is accepted', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Validate file size acceptance (≤ 5MB)
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await importOrdersPage.validateFileSizeAcceptance(filePath);
    
    // Click the Import Orders button to complete the process
    await importOrdersPage.clickImportOrdersAfterUpload();
  });

  test('EW_29: Validate drag-and-drop upload', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload file (simulates drag-and-drop) and complete import
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    await importOrdersPage.completeFileUpload(filePath);
    
    // Wait for file recognition
    await page.waitForTimeout(2000);
  });

});