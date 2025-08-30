import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { ImportOrdersPage } from '../../src/pages/ImportOrdersPage';
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';

test.describe('Import Orders Negative Test Cases', () => {

  test('EW_31: Validate missing required column', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate missing required column (platform)
    const filePath = path.resolve(__dirname, '../../src/fixtures/missing-platform-column.csv');
    await importOrdersPage.validateMissingRequiredColumn(filePath, "Required column 'platform' is missing");
  });

  test('EW_32: Validate empty required field in file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate empty required field (order_name)
    const filePath = path.resolve(__dirname, '../../src/fixtures/empty-order-name.csv');
    await importOrdersPage.validateEmptyRequiredField(filePath, "order_name is required");
  });

  test('EW_33: Validate unsupported file format', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate unsupported file format (TXT)
    const filePath = path.resolve(__dirname, '../../src/fixtures/test-file.txt');
    await importOrdersPage.validateUnsupportedFileFormat(filePath);
  });

  test('EW_34: Validate upload of file > 5MB', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate file size exceeds limit
    const filePath = path.resolve(__dirname, '../../src/fixtures/large-file.txt');
    await importOrdersPage.validateFileSizeExceedsLimit(filePath);
  });

  test('EW_35: Validate special characters in amount field', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate invalid number format (special characters in amount)
    const filePath = path.resolve(__dirname, '../../src/fixtures/invalid-amount-format.csv');
    await importOrdersPage.validateInvalidNumberFormat(filePath);
  });

  test('EW_36: Validate negative value in amount field', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate negative amount
    const filePath = path.resolve(__dirname, '../../src/fixtures/negative-amount.csv');
    await importOrdersPage.validateNegativeAmount(filePath);
  });

  test('EW_37: Validate invalid discount percentage (>100%)', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate invalid discount percentage
    const filePath = path.resolve(__dirname, '../../src/fixtures/invalid-discount-percentage.csv');
    await importOrdersPage.validateInvalidDiscountPercentage(filePath);
  });

  test('EW_38: Validate invalid telegram handle format', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate invalid telegram handle format
    const filePath = path.resolve(__dirname, '../../src/fixtures/invalid-telegram-handle.csv');
    await importOrdersPage.validateInvalidTelegramHandle(filePath);
  });

  test('EW_39: Validate mismatch in platform and username', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate platform username mismatch
    const filePath = path.resolve(__dirname, '../../src/fixtures/platform-username-mismatch.csv');
    await importOrdersPage.validatePlatformUsernameMismatch(filePath);
  });

  test('EW_40: Validate clicking import without file', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate no file selected
    await importOrdersPage.validateNoFileSelected();
  });

  test('EW_41: Validate conflicting data under same order_name', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate conflicting data for same order_name
    const filePath = path.resolve(__dirname, '../../src/fixtures/conflicting-order-name.csv');
    await importOrdersPage.validateConflictingData(filePath);
  });

  test('EW_42: Validate incorrect column naming', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate incorrect column naming
    const filePath = path.resolve(__dirname, '../../src/fixtures/incorrect-column-naming.csv');
    await importOrdersPage.validateIncorrectColumnNaming(filePath);
  });

  test('EW_43: Validate close button functionality', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const dashboardPage = new DashboardPage(page);
    const importOrdersPage = new ImportOrdersPage(page);
    
    await dashboardPage.assertLoaded();
    await dashboardPage.clickAddNewOrder();
    await dashboardPage.clickImportOrder();

    // Validate close button functionality
    await importOrdersPage.validateCloseButton();
  });

});
