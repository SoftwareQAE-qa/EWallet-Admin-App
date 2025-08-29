import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  // Locators - using multiple strategies for better reliability
  private emailInput: Locator;
  private passwordInput: Locator;
  private signInButton: Locator;
  private rememberMeCheckbox: Locator;
  private forgotPasswordLink: Locator;

  constructor(page: any) {
    super(page);
    
    // More robust locators with fallbacks
    this.emailInput = this.page.locator('input[type="email"]')
      .or(this.page.getByLabel(/email address/i))
      .or(this.page.getByPlaceholder(/email/i))
      .or(this.page.locator('#email'))
      .or(this.page.locator('[name="email"]'));
      
    this.passwordInput = this.page.locator('input[type="password"]')
      .or(this.page.getByLabel(/password/i))
      .or(this.page.getByPlaceholder(/password/i))
      .or(this.page.locator('#password'))
      .or(this.page.locator('[name="password"]'));
      
    this.signInButton = this.page.getByRole('button', { name: /sign in/i })
      .or(this.page.getByRole('button', { name: /login/i }))
      .or(this.page.locator('button[type="submit"]'))
      .or(this.page.locator('.btn-primary'))
      .or(this.page.locator('[data-testid="signin-button"]'));
      
    this.rememberMeCheckbox = this.page.getByLabel(/remember me/i)
      .or(this.page.locator('input[type="checkbox"]'))
      .or(this.page.locator('#remember-me'));
      
    // Fix: Use a more specific locator that targets the actual link element
    this.forgotPasswordLink = this.page.locator('a[href*="password-reset"]').first()
      .or(this.page.locator('a[href*="password"]').first())
      .or(this.page.getByRole('link', { name: /forgot password/i }).first());
  }

  async navigateToLogin() {
    try {
    await this.goto('/admin/login');
    console.log('Reached login page');
      
      // Wait for page to load and verify we're on the right page
      await this.page.waitForLoadState('networkidle');
      
      // Wait for at least one of the main elements to be visible
      await Promise.race([
        this.emailInput.waitFor({ state: 'visible', timeout: 10000 }),
        this.passwordInput.waitFor({ state: 'visible', timeout: 10000 }),
        this.signInButton.waitFor({ state: 'visible', timeout: 10000 })
      ]);
      
      console.log('Login page elements loaded successfully');
    } catch (error) {
      console.error('Error navigating to login page:', error);
      throw error;
    }
  }

  async fillEmail(email: string) {
    try {
      await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.emailInput.fill(email);
      console.log('Email filled successfully');
    } catch (error) {
      console.error('Error filling email:', error);
      throw error;
    }
  }

  async fillPassword(password: string) {
    try {
      await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
      console.log('Password filled successfully');
    } catch (error) {
      console.error('Error filling password:', error);
      throw error;
    }
  }

  async fillCredentials(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async clickSignIn() {
    try {
      await this.signInButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.signInButton.click();
      console.log('Sign in button clicked successfully');
    } catch (error) {
      console.error('Error clicking sign in button:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.clickSignIn();
  }

  async waitFor2FAPage() {
    try {
      await this.page.waitForURL(/\/admin\/2fa/, { timeout: 15000 });
      console.log('Redirected to 2FA page successfully');
    } catch (error) {
      console.error('Error waiting for 2FA page:', error);
      throw error;
    }
  }

  async selectRememberMe() {
    try {
      await this.rememberMeCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await this.rememberMeCheckbox.check();
      console.log('Remember me checkbox selected');
    } catch (error) {
      console.error('Error selecting remember me:', error);
      throw error;
    }
  }

  async clickForgotPassword() {
    try {
      await this.forgotPasswordLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.forgotPasswordLink.click();
      console.log('Forgot password link clicked');
    } catch (error) {
      console.error('Error clicking forgot password:', error);
      throw error;
    }
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

  // Debug method to check page state
  async debugPageState() {
    console.log('Current URL:', this.page.url());
    console.log('Page title:', await this.page.title());
    
    // Check if elements are visible
    console.log('Email input visible:', await this.emailInput.isVisible());
    console.log('Password input visible:', await this.passwordInput.isVisible());
    console.log('Sign in button visible:', await this.signInButton.isVisible());
  }
}
