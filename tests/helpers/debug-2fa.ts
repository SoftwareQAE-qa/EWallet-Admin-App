import { Page } from '@playwright/test';

export async function debug2FAPage(page: Page) {
  console.log('=== 2FA Page Debug Information ===');
  
  // Get current URL
  console.log(`Current URL: ${page.url()}`);
  
  // Get page title
  console.log(`Page title: ${await page.title()}`);
  
  // Check for 2FA related elements
  const twoFAText = await page.locator('body').textContent();
  console.log('Page contains 2FA text:', twoFAText?.includes('2FA') || twoFAText?.includes('Two Factor'));
  
  // Look for QR code
  const qrCode = page.locator('img[src*="data:image"]').first();
  if (await qrCode.isVisible()) {
    const src = await qrCode.getAttribute('src');
    console.log('QR Code found:', src?.substring(0, 100) + '...');
    
    if (src?.includes('otpauth://')) {
      console.log('OTP Auth URL found in QR code');
      const secretMatch = src.match(/secret=([A-Z2-7]+)/);
      if (secretMatch) {
        console.log('TOTP Secret extracted:', secretMatch[1]);
      }
    }
  } else {
    console.log('No QR code found');
  }
  
  // Look for recovery codes
  const recoveryCodes = await page.locator('text=/[A-Z0-9]{8,}/').allTextContents();
  if (recoveryCodes.length > 0) {
    console.log('Recovery codes found:', recoveryCodes);
  } else {
    console.log('No recovery codes found');
  }
  
  // Look for any input fields
  const inputs = await page.locator('input').all();
  console.log(`Found ${inputs.length} input fields`);
  
  for (let i = 0; i < inputs.length; i++) {
    const placeholder = await inputs[i].getAttribute('placeholder');
    const type = await inputs[i].getAttribute('type');
    console.log(`Input ${i + 1}: type="${type}", placeholder="${placeholder}"`);
  }
  
  // Look for buttons
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons`);
  
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    console.log(`Button ${i + 1}: "${text}"`);
  }
  
  console.log('=== End Debug Information ===');
}

export async function extractAllPossibleSecrets(page: Page): Promise<string[]> {
  const secrets: string[] = [];
  
  try {
    // Method 1: QR code data URL
    const qrCodeImg = page.locator('img[src*="data:image"]').first();
    if (await qrCodeImg.isVisible()) {
      const src = await qrCodeImg.getAttribute('src');
      if (src && src.includes('otpauth://')) {
        const secretMatch = src.match(/secret=([A-Z2-7]+)/);
        if (secretMatch) {
          secrets.push(secretMatch[1]);
        }
      }
    }
    
    // Method 2: Page content patterns
    const pageContent = await page.content();
    
    // Look for various secret patterns
    const patterns = [
      /secret["\s]*[:=]\s*["']?([A-Z2-7]+)["']?/gi,
      /key["\s]*[:=]\s*["']?([A-Z2-7]+)["']?/gi,
      /totp["\s]*[:=]\s*["']?([A-Z2-7]+)["']?/gi,
      /([A-Z2-7]{16,})/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(pageContent)) !== null) {
        if (match[1] && !secrets.includes(match[1])) {
          secrets.push(match[1]);
        }
      }
    }
    
    // Method 3: Hidden inputs
    const hiddenInputs = page.locator('input[type="hidden"]');
    const count = await hiddenInputs.count();
    
    for (let i = 0; i < count; i++) {
      const value = await hiddenInputs.nth(i).getAttribute('value');
      if (value && /^[A-Z2-7]{16,}$/.test(value)) {
        secrets.push(value);
      }
    }
    
  } catch (error) {
    console.log('Error extracting secrets:', error);
  }
  
  return secrets;
}
