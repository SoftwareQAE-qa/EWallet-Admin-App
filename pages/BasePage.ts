import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getElementByText(text: string): Promise<Locator> {
    return this.page.getByText(text);
  }

  async getElementByRole(role: string, name?: string): Promise<Locator> {
    return this.page.getByRole(role, name ? { name } : undefined);
  }

  async getElementByLabel(label: string): Promise<Locator> {
    return this.page.getByLabel(label);
  }
}
