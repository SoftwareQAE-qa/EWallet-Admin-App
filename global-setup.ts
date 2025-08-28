import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { TwoFAPage } from './pages/TwoFAPage';
import { DashboardPage } from './pages/DashboardPage';
import { TOTPUtils } from './utils/totpUtils';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Create auth directory if it doesn't exist
  const authDir = path.join(__dirname, 'playwright', '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔐 Starting global authentication setup...');
    
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const twoFAPage = new TwoFAPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to login page
    await page.goto(baseURL + '/login');
    
    // Perform login
    await loginPage.fillEmail(process.env.EMAIL!);
    await loginPage.fillPassword(process.env.PASSWORD!);
    await loginPage.clickSignIn();
    
    // Complete 2FA authentication
    await loginPage.waitFor2FAPage();
    const twoFACode = TOTPUtils.generateCurrentTOTP(process.env.TOTP_SECRET!);
    await twoFAPage.submitOTP(twoFACode);
    
    // Wait for dashboard and verify it's loaded
    await twoFAPage.waitForDashboard();
    await dashboardPage.verifyDashboardLoaded();
    
    console.log('✅ Authentication successful, saving session state...');
    
    // Save signed-in state to file
    await context.storageState({ path: path.join(authDir, 'user.json') });
    
    console.log('💾 Session state saved successfully');
    
  } catch (error) {
    console.error('❌ Authentication failed during global setup:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
