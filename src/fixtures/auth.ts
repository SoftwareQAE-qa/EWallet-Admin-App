import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginAsAdmin: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginAsAdmin: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.loginWith2FA(process.env.EMAIL!, process.env.PASSWORD!)
    // wait for navigation to dashboard
    await page.waitForURL(/\/admin\/?(dashboard)?/i, { timeout: 15000 });
    await use(async () => { });
  }
});

export { expect } from '@playwright/test';
