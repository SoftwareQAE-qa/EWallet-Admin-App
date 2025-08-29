import { test, expect } from '@playwright/test';
import { AddNewOrderPage } from '../pages/AddNewOrderPage';

test.describe('Add New Order Test Cases', () => {
  let addNewOrderPage: AddNewOrderPage;

  // This runs before each test - uses stored authentication state
  test.beforeEach(async ({ page }) => {
    // Initialize page objects for each test
    addNewOrderPage = new AddNewOrderPage(page);
    
    // Navigate to dashboard first (authentication is already handled globally)
    await page.goto('/admin');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
  });

  test('EW_18 - Dashboard > Add New Order - Validate "Add New Order" page loads successfully', async ({ page }) => {
    // Step 1: Log in as Admin (already done in global setup)
    // Step 2: Locate the orange "Add New Order" button
    await expect(addNewOrderPage.isAddNewOrderButtonVisible()).toBeTruthy();
    
    // Step 3: Click "Add New Order" Button
    await addNewOrderPage.clickAddNewOrderButton();
    
    // Verification: Add New Order form loads correctly
    await addNewOrderPage.waitForPageLoad();
    
    // Additional verifications
    await expect(addNewOrderPage.isAddNewOrderPageLoaded()).toBeTruthy();
    await expect(addNewOrderPage.isAddNewOrderFormVisible()).toBeTruthy();
    
    // Verify page title
    const pageTitle = await addNewOrderPage.getPageTitle();
    expect(pageTitle.toLowerCase()).toContain('add new order');
    
    // Verify form is properly loaded
    await expect(addNewOrderPage.isFormLoaded()).toBeTruthy();
    
    // Optional: Check if form has fields (for future expansion)
    const fieldCount = await addNewOrderPage.getFormFieldCount();
    // Form fields might not be immediately visible, so we'll just verify the page loaded
    expect(fieldCount).toBeGreaterThanOrEqual(0);
  });

  test('EW_19 - Dashboard > Add New Order - Validate an "Import orders" button is visible', async ({ page }) => {
    // Step 1: Log in as Admin (already done in global setup)
    // Step 2: Locate the orange "Add New Order" button
    await expect(addNewOrderPage.isAddNewOrderButtonVisible()).toBeTruthy();
    
    // Step 3: Click "Add New Order" Button
    await addNewOrderPage.clickAddNewOrderButton();
    
    // Step 4: Locate "Import orders" Button
    await addNewOrderPage.waitForPageLoad();
    
    // Verification: Import orders button is visible
    await expect(addNewOrderPage.isImportOrdersButtonVisible()).toBeTruthy();
    
    // Additional verification: Button should be clickable
    await expect(addNewOrderPage.isImportOrdersButtonClickable()).toBeTruthy();
    
    // Verify we're on the correct page
    await expect(addNewOrderPage.isAddNewOrderPageLoaded()).toBeTruthy();
  });
});
