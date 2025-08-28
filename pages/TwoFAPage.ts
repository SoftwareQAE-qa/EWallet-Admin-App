import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class TwoFAPage extends BasePage {
  // Locators
  private otpInput: Locator;
  private verifyButton: Locator;

  constructor(page: any) {
    super(page);
    this.otpInput = this.page.locator('input[type="text"], input[type="tel"]').first();
    this.verifyButton = this.page.getByRole('button', { name: /verify/i });
  }

  async enterOTP(otpCode: string) {
    await this.otpInput.fill(otpCode);
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async submitOTP(otpCode: string) {
    await this.enterOTP(otpCode);
    await this.clickVerify();
  }

  async waitForDashboard() {
    await this.page.waitForURL(/\/admin$/, { timeout: 15000 });
  }
}
