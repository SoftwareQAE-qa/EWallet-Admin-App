import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { authenticator } from 'otplib';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  emailInput() { return this.page.getByLabel(/Email address\*/i).or(this.page.getByLabel(/Email/i)); }
  passwordInput() { return this.page.getByLabel(/Password\*/i).or(this.page.getByLabel(/Password/i)); }
  signInButton() { return this.page.getByRole('button', { name: /sign in/i }); }
  showPasswordToggle() { return this.page.getByRole('button', { name: /show password|hide password/i }); }
  rememberMeCheckbox() { return this.page.getByRole('checkbox', { name: /remember me/i }); }
  forgotPasswordLink() { return this.page.getByRole('link', { name: /forgot password\?/i }); }
  alertMessage() { return this.page.getByRole('alert'); }

  async open() {
    await this.page.goto('/admin/login');
    await this.assertHasTitle('Admin Panel');
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
  }

  async assertValidationMessage(text: RegExp | string) {
    const msg = this.page.getByText(text);
    await expect(msg).toBeVisible();
  }
  async loginWith2FA(EMAIL: string, PASSWORD: string) {
    // Step 1: Go to login page
    await this.page.goto('/login');
    console.log('Reached login page');

    // Step 2: Fill credentials and login
    await this.page.getByLabel(/email address/i).fill(EMAIL);
    await this.page.getByLabel(/password/i).fill(PASSWORD);
    await this.page.getByRole('button', { name: /sign in/i }).click();

    // Step 3: Wait for 2FA page
    await this.page.waitForURL(/\/admin\/2fa/);

    // Step 4: Generate current OTP from your pre-shared TOTP secret
    const twoFACode = authenticator.generate(process.env.TOTP_SECRET!);

    // Step 5: Enter OTP
    await this.page.locator('input[type="text"], input[type="tel"]').first().fill(twoFACode);
    await this.page.getByRole('button', { name: /verify/i }).click();

    // Step 6: Wait for dashboard
    await this.page.waitForURL(/\/admin(\/dashboard)?/);
    // Step 7: Verify dashboard content
    await expect(this.page.getByText(/Dashboard/i).first()).toBeVisible();
  }
}