import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  // Locators
  private emailInput: Locator;
  private passwordInput: Locator;
  private signInButton: Locator;
  private rememberMeCheckbox: Locator;
  private forgotPasswordLink: Locator;

  constructor(page: any) {
    super(page);
    this.emailInput = this.page.getByLabel(/email address/i);
    this.passwordInput = this.page.getByLabel(/password/i);
    this.signInButton = this.page.getByRole('button', { name: /sign in/i });
    this.rememberMeCheckbox = this.page.getByLabel(/remember me/i);
    this.forgotPasswordLink = this.page.getByRole('link', { name: /forgot password/i });
  }

  async navigateToLogin() {
    await this.goto('/admin/login');
    console.log('Reached login page');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.clickSignIn();
  }

  async waitFor2FAPage() {
    await this.page.waitForURL(/\/admin\/2fa/);
  }

  async selectRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async isPasswordMasked(): Promise<boolean> {
    const inputType = await this.passwordInput.getAttribute('type');
    return inputType === 'password';
  }

  async isRememberMeSelected(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }
}
