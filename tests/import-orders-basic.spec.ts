import { test, expect } from '@playwright/test';
import { ImportOrdersPage } from '../pages/ImportOrdersPage';

test.describe('Import Orders Basic Test Cases', () => {
  let importOrdersPage: ImportOrdersPage;

  // This runs before each test - uses stored authentication state
  test.beforeEach(async ({ page }) => {
    // Initialize page objects for each test
    importOrdersPage = new ImportOrdersPage(page);
    
    // Navigate to dashboard first (authentication is already handled globally)
    await page.goto('/admin');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
  });

  test('Basic - Verify Add New Order button is visible', async ({ page }) => {
    // Basic test to verify the Add New Order button exists
    await expect(importOrdersPage.isAddNewOrderButtonVisible()).toBeTruthy();
  });

  test('Basic - Verify Import Orders button is visible after clicking Add New Order', async ({ page }) => {
    // Step 1: Click Add New Order button
    await importOrdersPage.clickAddNewOrderButton();
    await page.waitForLoadState('networkidle');
    
    // Step 2: Check if Import Orders button is visible
    await expect(importOrdersPage.isImportOrdersButtonVisible()).toBeTruthy();
  });

  test('Basic - Verify Import Orders button is clickable', async ({ page }) => {
    // Step 1: Click Add New Order button
    await importOrdersPage.clickAddNewOrderButton();
    await page.waitForLoadState('networkidle');
    
    // Step 2: Check if Import Orders button is clickable
    await expect(importOrdersPage.isImportOrdersButtonClickable()).toBeTruthy();
  });

  test('Basic - Verify Import Orders button text', async ({ page }) => {
    // Step 1: Click Add New Order button
    await importOrdersPage.clickAddNewOrderButton();
    await page.waitForLoadState('networkidle');
    
    // Step 2: Verify the Import Orders button text
    const importButton = page.getByRole('button', { name: /import orders/i });
    await expect(importButton).toBeVisible();
    
    const buttonText = await importButton.textContent();
    expect(buttonText?.toLowerCase()).toContain('import orders');
  });
});

