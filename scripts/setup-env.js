#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 EWallet Test Environment Setup');
console.log('================================');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const configEnvPath = path.join(__dirname, '..', 'config.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else if (fs.existsSync(configEnvPath)) {
  console.log('✅ config.env file exists');
  console.log('📝 Please copy config.env to .env and update with your actual credentials');
} else {
  console.log('❌ No environment configuration found');
  console.log('📝 Creating config.env with placeholder values...');
  
  const configContent = `# EWallet Test Environment Variables
# Replace these with your actual credentials
EMAIL=your-email@example.com
PASSWORD=your-password
TOTP_SECRET=your-totp-secret-key
BASE_URL=https://ewallet.walletwhisper.io
TIMEOUT_DEFAULT=60000
`;
  
  fs.writeFileSync(configEnvPath, configContent);
  console.log('✅ config.env created successfully');
  console.log('📝 Please update config.env with your actual credentials');
}

console.log('\n📋 Required Environment Variables:');
console.log('  EMAIL          - Your admin email address');
console.log('  PASSWORD       - Your admin password');
console.log('  TOTP_SECRET    - Your TOTP secret key for 2FA');
console.log('  BASE_URL       - Base URL for the application (default: https://ewallet.walletwhisper.io)');
console.log('  TIMEOUT_DEFAULT - Test timeout in milliseconds (default: 60000)');

console.log('\n🚀 Next Steps:');
console.log('  1. Update the environment variables with your actual credentials');
console.log('  2. Run: npm run auth:setup (to set up authentication)');
console.log('  3. Run: npm run test:import-orders (to test import orders)');
console.log('  4. Run: npx playwright test tests/login-cases.spec.ts (to test login)');

console.log('\n💡 Tip: You can also set environment variables directly in your shell:');
console.log('  Windows: $env:EMAIL="your-email@example.com"');
console.log('  Linux/Mac: export EMAIL="your-email@example.com"');
