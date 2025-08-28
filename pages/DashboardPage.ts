import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class DashboardPage extends BasePage {
  // Locators
  private dashboardText: Locator;
  private userMenuButton: Locator;
  private logoutButton: Locator;

  constructor(page: any) {
    super(page);
    this.dashboardText = this.page.getByRole('heading', { name: /dashboard/i });
    this.userMenuButton = this.page.getByRole('button', { name: /user menu/i });
    this.logoutButton = this.page.getByRole('button', { name: /logout/i });
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
}
