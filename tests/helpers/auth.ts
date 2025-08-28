import { Page, expect } from '@playwright/test';
import { authenticator } from 'otplib';

authenticator.options = { step: 30, window: 1 }; // tolerate clock drift a little

export async function loginEmailPassword(page: Page) {
  await page.goto('/admin/login');
  
  // Fill email
  const email = page.getByLabel(/email address/i).or(page.locator('input[type="email"]'));
  await email.fill(process.env.ADMIN_EMAIL!);

  // Fill password
  const password = page.getByLabel(/password/i).or(page.locator('input[type="password"]'));
  await password.fill(process.env.ADMIN_PASSWORD!);

  // Optional "Remember me"
  const remember = page.getByRole('checkbox', { name: /remember me/i });
  if (await remember.isVisible().catch(() => false)) await remember.check();

  // Sign in
  await page.getByRole('button', { name: /sign in/i }).click();
}

export async function handleTwoFactorSetup(page: Page) {
  // Check if we're on the 2FA setup page
  const is2FASetup = await page.getByText(/secure your account with google 2fa/i).isVisible().catch(() => false);
  
  if (is2FASetup) {
    console.log('2FA setup required - enabling 2FA...');
    
    // Click "Enable 2FA" button
    await page.getByRole('button', { name: /enable 2fa/i }).click();
    
    // Wait for the QR code and recovery codes to appear
    await page.waitForSelector('img[src*="data:image"]', { timeout: 10000 });
    
    // Extract TOTP secret from the page
    const totpSecret = await extractTOTPSecret(page);
    
    if (totpSecret) {
      console.log('TOTP secret extracted successfully');
      
      // Generate TOTP code
      const token = authenticator.generate(totpSecret);
      console.log(`Generated TOTP code: ${token}`);
      
      // Fill the 2FA code input
      const codeInput = page.getByPlaceholder(/enter 6-digit code/i).or(page.locator('input[type="text"], input[type="tel"]').first());
      await codeInput.fill(token);
      
      // Click verify button
      await page.getByRole('button', { name: /verify.*enable 2fa/i }).click();
      
      // Wait for success or handle any errors
      try {
        await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
        console.log('2FA setup completed successfully');
      } catch (error) {
        console.log('2FA setup may have failed, continuing...');
      }
    } else {
      console.log('Could not extract TOTP secret, trying alternative method...');
      await handle2FAWithRecoveryCodes(page);
    }
  }
}

export async function handleTwoFactorVerification(page: Page) {
  // Check if we're on the 2FA verification page
  const is2FAVerification = await page.getByText(/two factor authentication/i).isVisible().catch(() => false);
  
  if (is2FAVerification) {
    console.log('2FA verification required...');
    
    // Try to get the TOTP secret from the current page
    const totpSecret = await extractTOTPSecret(page);
    
    if (totpSecret) {
      // Generate and enter TOTP code
      const token = authenticator.generate(totpSecret);
      console.log(`Generated TOTP code: ${token}`);
      
      const codeInput = page.getByPlaceholder(/2fa code/i).or(page.locator('input[type="text"], input[type="tel"]').first());
      await codeInput.fill(token);
      
      const verifyBtn = page.getByRole('button', { name: /verify.*2fa/i });
      await verifyBtn.click();
    } else {
      // If we can't get the secret, try recovery codes
      await handle2FAWithRecoveryCodes(page);
    }
  }
}

async function extractTOTPSecret(page: Page): Promise<string | null> {
  try {
    // Method 1: Try to extract from QR code data URL
    const qrCodeImg = page.locator('img[src*="data:image"]').first();
    if (await qrCodeImg.isVisible()) {
      const src = await qrCodeImg.getAttribute('src');
      if (src && src.includes('otpauth://')) {
        // Extract secret from otpauth URL
        const secretMatch = src.match(/secret=([A-Z2-7]+)/);
        if (secretMatch) {
          return secretMatch[1];
        }
      }
    }
    
    // Method 2: Look for secret in page text or hidden inputs
    const pageContent = await page.content();
    const secretMatch = pageContent.match(/secret["\s]*[:=]\s*["']?([A-Z2-7]+)["']?/i);
    if (secretMatch) {
      return secretMatch[1];
    }
    
    // Method 3: Check for any base32 encoded strings that might be the secret
    const base32Match = pageContent.match(/([A-Z2-7]{16,})/);
    if (base32Match) {
      // This is a heuristic - might not always work
      return base32Match[1];
    }
    
    return null;
  } catch (error) {
    console.log('Error extracting TOTP secret:', error);
    return null;
  }
}

async function handle2FAWithRecoveryCodes(page: Page) {
  try {
    console.log('Attempting to use recovery codes...');
    
    // Look for recovery codes on the page
    const recoveryCodes = await page.locator('text=/[A-Z0-9]{8,}/').allTextContents();
    
    if (recoveryCodes.length > 0) {
      // Use the first recovery code
      const recoveryCode = recoveryCodes[0];
      console.log(`Using recovery code: ${recoveryCode}`);
      
      // Look for recovery code input field
      const recoveryInput = page.getByPlaceholder(/recovery code/i).or(page.locator('input[type="text"]').last());
      await recoveryInput.fill(recoveryCode);
      
      // Click verify or submit button
      const verifyBtn = page.getByRole('button', { name: /verify|submit|continue/i });
      await verifyBtn.click();
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.log('Error using recovery codes:', error);
    return false;
  }
}

export async function waitForDashboard(page: Page) {
  // Wait for dashboard to load
  await expect(page.getByText(/dashboard/i)).toBeVisible({ timeout: 30000 });
  
  // Additional check for dashboard content
  await expect(page.locator('body')).not.toContainText('404');
  await expect(page.locator('body')).not.toContainText('Not Found');
}

export async function fullLogin(page: Page) {
  console.log('Starting full login process...');
  
  // Step 1: Login with email/password
  await loginEmailPassword(page);
  
  // Step 2: Handle 2FA setup if required
  await handleTwoFactorSetup(page);
  
  // Step 3: Handle 2FA verification if required
  await handleTwoFactorVerification(page);
  
  // Step 4: Wait for dashboard
  await waitForDashboard(page);
  
  console.log('Login completed successfully');
}
