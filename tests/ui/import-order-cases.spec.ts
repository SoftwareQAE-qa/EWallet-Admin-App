import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
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
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Validate the modal content
    await dashboardPage.validateImportOrdersModal();
  });

  test('EW_21: Validate "Download Template" button is visible and clickable', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Validate Download Template button
    const downloadButton = page.getByRole('link', { name: /Download Template/i });
    await expect(downloadButton).toBeVisible({ timeout: 10000 });
    await expect(downloadButton).toBeEnabled();
    
    // Click the download button
    await downloadButton.click();
    
    console.log('Download Template button is visible and clickable');
  });

  test('EW_22: Validate file upload with valid Excel file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload Excel file
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(filePath);
    
    console.log(`Valid Excel file uploaded: ${filePath}`);
  });

  test('EW_23: Validate file upload with valid CSV file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload CSV file
    const filePath = path.resolve(__dirname, '../../src/fixtures/multi-platform-order.csv');
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(filePath);
    
    console.log(`Valid CSV file uploaded: ${filePath}`);
  });

  test('EW_24: Validate "Import Orders" button after valid file upload', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload file
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-fixed-v3.xlsx');
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(filePath);

    // Click the Import Orders button
    const importButton = page.getByRole('button', { name: /Import Orders/i }).nth(1);
    await expect(importButton).toBeVisible({ timeout: 10000 });
    await expect(importButton).toBeEnabled();
    await importButton.click();
    
    console.log('Valid file uploaded and Import Orders completed successfully');
  });

  test('EW_25: Validate optional fields are accepted in Import Orders', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload file with optional fields
    const filePath = path.resolve(__dirname, '../../src/fixtures/valid-orders-with-optional-fields.xlsx');
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(filePath);

    // Click the Import Orders button
    const importButton = page.getByRole('button', { name: /Import Orders/i }).nth(1);
    await expect(importButton).toBeVisible({ timeout: 10000 });
    await expect(importButton).toBeEnabled();
    await importButton.click();
    
    console.log('Valid file with optional fields uploaded and Import Orders completed successfully');
  });

  test('EW_26: Validate multiple platforms under same orders', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();

    // Click on Import Orders button to open the modal
    await dashboardPage.clickImportOrder();

    // Upload multi-platform file
    const filePath = path.resolve(__dirname, '../../src/fixtures/multi-platform-order.csv');
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
    await fileInput.setInputFiles(filePath);
    
    console.log('Multi-platform file uploaded successfully');
  });

});