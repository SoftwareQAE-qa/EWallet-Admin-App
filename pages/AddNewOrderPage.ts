import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class AddNewOrderPage extends BasePage {
  // Locators
  private addNewOrderButton: Locator;
  private addNewOrderForm: Locator;
  private importOrdersButton: Locator;
  private pageTitle: Locator;
  
  // Form Elements (for future expansion)
  private orderForm: Locator;
  private formFields: Locator;

  constructor(page: any) {
    super(page);
    
    // Dashboard button (to click and navigate to Add New Order)
    this.addNewOrderButton = this.page.getByRole('button', { name: /add new order/i });
    
      // Add New Order page elements
  this.addNewOrderForm = this.page.locator('form:not([action*="logout"])').first(); // Main form container, exclude logout form
  this.importOrdersButton = this.page.getByRole('button', { name: /import orders/i });
  this.pageTitle = this.page.getByRole('heading', { name: /add new order/i });
  
  // Form elements for future use
  this.orderForm = this.page.locator('form:not([action*="logout"])');
  this.formFields = this.page.locator('input, select, textarea');
  }

  // Navigation Methods
  async clickAddNewOrderButton() {
    await this.addNewOrderButton.click();
  }

  async navigateToAddNewOrder() {
    await this.clickAddNewOrderButton();
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
  }

  // Page Validation Methods
  async isAddNewOrderPageLoaded(): Promise<boolean> {
    try {
      // Wait for the page title to be visible
      await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isAddNewOrderFormVisible(): Promise<boolean> {
    return await this.addNewOrderForm.isVisible();
  }

  async isImportOrdersButtonVisible(): Promise<boolean> {
    return await this.importOrdersButton.isVisible();
  }

  async isImportOrdersButtonClickable(): Promise<boolean> {
    return await this.importOrdersButton.isEnabled();
  }

  // Page State Methods
  async getPageTitle(): Promise<string> {
    const title = await this.pageTitle.textContent();
    return title?.trim() || '';
  }

  async verifyAddNewOrderPageLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
    // Wait for either the form or the import orders button to be visible
    try {
      await this.addNewOrderForm.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      // If form is not found, check for import orders button instead
      await this.importOrdersButton.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  // Form Validation Methods
  async isFormLoaded(): Promise<boolean> {
    try {
      return await this.addNewOrderForm.isVisible();
    } catch (error) {
      // If form is not found, check if we're on the right page by looking for import orders button
      return await this.importOrdersButton.isVisible();
    }
  }

  async getFormFieldCount(): Promise<number> {
    try {
      return await this.formFields.count();
    } catch (error) {
      // If no form fields found, return 0
      return 0;
    }
  }

  // Utility Methods
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.verifyAddNewOrderPageLoaded();
  }

  async isPageReady(): Promise<boolean> {
    try {
      await this.verifyAddNewOrderPageLoaded();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Button Visibility Methods
  async isAddNewOrderButtonVisible(): Promise<boolean> {
    return await this.addNewOrderButton.isVisible();
  }
}
