import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class DashboardPage extends BasePage {
  // Locators
  private dashboardText: Locator;
  private userMenuButton: Locator;
  private logoutButton: Locator;
  
  // Dashboard Cards
  private totalOrdersCard: Locator;
  private totalVolumeSentCard: Locator;
  private netProfitCard: Locator;
  private pendingOrdersCard: Locator;
  private unmatchedSendRequestsCard: Locator;
  private delayedOrdersCard: Locator;
  private mismatchTransactionsCard: Locator;
  private addNewOrderButton: Locator;
  
  // Card Values
  private totalOrdersValue: Locator;
  private totalVolumeSentValue: Locator;
  private netProfitValue: Locator;
  private pendingOrdersValue: Locator;
  
  // Clickable Links
  private unmatchedSendRequestsBreakdown: Locator;
  private manageDelayedOrders: Locator;
  private viewOverUnderSends: Locator;
  
  // Modal
  private breakdownModal: Locator;

  constructor(page: any) {
    super(page);
    this.dashboardText = this.page.getByRole('heading', { name: /dashboard/i });
    this.userMenuButton = this.page.getByRole('button', { name: /user menu/i });
    this.logoutButton = this.page.getByRole('button', { name: /logout/i });
    
    // Dashboard Cards
    this.totalOrdersCard = this.page.getByText(/total orders/i);
    this.totalVolumeSentCard = this.page.getByText(/total volume sent/i);
    this.netProfitCard = this.page.getByText(/net profit/i);
    this.pendingOrdersCard = this.page.getByText(/pending orders/i).first();
    this.unmatchedSendRequestsCard = this.page.getByText(/unmatched send requests/i);
    this.delayedOrdersCard = this.page.getByText(/delayed orders/i);
    this.mismatchTransactionsCard = this.page.getByText(/mismatch transactions/i);
    this.addNewOrderButton = this.page.getByRole('button', { name: /add new order/i });
    
    // Card Values
    this.totalOrdersValue = this.page.locator('text=/TOTAL ORDERS/').locator('..').locator('text=/\\d+/');
    this.totalVolumeSentValue = this.page.locator('text=/TOTAL VOLUME SENT/').locator('..').locator('text=/\\$[\\d,]+\\.\\d{2}/');
    this.netProfitValue = this.page.locator('text=/NET PROFIT/').locator('..').locator('text=/\\$[\\d,]+\\.\\d{2}/');
    this.pendingOrdersValue = this.page.locator('text=/PENDING ORDERS/').locator('..').locator('text=/\\d+/');
    
    // Clickable Links
    this.unmatchedSendRequestsBreakdown = this.page.getByText(/click to see breakdown/i);
    this.manageDelayedOrders = this.page.getByText(/manage delayed orders/i);
    this.viewOverUnderSends = this.page.getByText(/view over\/under sends/i);
    
    // Modal - make it more specific
    this.breakdownModal = this.page.locator('[role="dialog"]').first();
  }

  async verifyDashboardLoaded() {
    await this.dashboardText.waitFor({ state: 'visible' });
  }

  async isDashboardVisible(): Promise<boolean> {
    return await this.dashboardText.isVisible();
  }

  async logout() {
    // Try to find logout button with more flexible locators
    try {
      // First try the user menu approach
      if (await this.userMenuButton.isVisible()) {
        await this.userMenuButton.click();
        await this.logoutButton.click();
      } else {
        // Alternative: look for logout link directly
        const logoutLink = this.page.getByRole('link', { name: /logout/i });
        if (await logoutLink.isVisible()) {
          await logoutLink.click();
        } else {
          // Last resort: navigate to logout URL
          await this.page.goto('/admin/logout');
        }
      }
    } catch (error) {
      // If all else fails, navigate to logout URL
      await this.page.goto('/admin/logout');
    }
  }

  // Dashboard Card Visibility Methods
  async isTotalOrdersCardVisible(): Promise<boolean> {
    return await this.totalOrdersCard.isVisible();
  }

  async isTotalVolumeSentCardVisible(): Promise<boolean> {
    return await this.totalVolumeSentCard.isVisible();
  }

  async isNetProfitCardVisible(): Promise<boolean> {
    return await this.netProfitCard.isVisible();
  }

  async isPendingOrdersCardVisible(): Promise<boolean> {
    return await this.pendingOrdersCard.isVisible();
  }

  async isUnmatchedSendRequestsCardVisible(): Promise<boolean> {
    return await this.unmatchedSendRequestsCard.isVisible();
  }

  async isDelayedOrdersCardVisible(): Promise<boolean> {
    return await this.delayedOrdersCard.isVisible();
  }

  async isMismatchTransactionsCardVisible(): Promise<boolean> {
    return await this.mismatchTransactionsCard.isVisible();
  }

  async isAddNewOrderButtonVisible(): Promise<boolean> {
    return await this.addNewOrderButton.isVisible();
  }

  // Dashboard Card Value Methods
  async getTotalOrdersValue(): Promise<number> {
    const valueText = await this.totalOrdersValue.textContent();
    return parseInt(valueText?.replace(/\D/g, '') || '0');
  }

  async getTotalVolumeSentValue(): Promise<string> {
    const valueText = await this.totalVolumeSentValue.textContent();
    return valueText?.trim() || '$0.00';
  }

  async getNetProfitValue(): Promise<string> {
    const valueText = await this.netProfitValue.textContent();
    return valueText?.trim() || '$0.00';
  }

  async getPendingOrdersValue(): Promise<number> {
    const valueText = await this.pendingOrdersValue.textContent();
    return parseInt(valueText?.replace(/\D/g, '') || '0');
  }

  // Clickable Elements Methods
  async clickUnmatchedSendRequestsBreakdown() {
    await this.unmatchedSendRequestsBreakdown.click();
  }

  async clickManageDelayedOrders() {
    await this.manageDelayedOrders.click();
  }

  async clickViewOverUnderSends() {
    await this.viewOverUnderSends.click();
  }

  // Utility Methods
  async isAddNewOrderButtonClickable(): Promise<boolean> {
    return await this.addNewOrderButton.isEnabled();
  }

  async isBreakdownModalVisible(): Promise<boolean> {
    return await this.breakdownModal.isVisible();
  }
}
