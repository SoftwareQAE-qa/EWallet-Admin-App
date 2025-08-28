# EWallet Playwright Tests - Complete Solution

This project contains automated tests for the EWallet application using Playwright, with **automatic 2FA handling** that works even when the TOTP keys get reset on every login.

## 🚀 Key Features

- **Automatic 2FA Setup**: Handles the case where 2FA keys get reset on every login
- **Dynamic TOTP Secret Extraction**: Automatically extracts TOTP secrets from QR codes or page content
- **Recovery Code Fallback**: Uses recovery codes if TOTP secret extraction fails
- **Complete Authentication Flow**: Covers login → 2FA setup → 2FA verification → Dashboard access

## 🛠️ Prerequisites

- Node.js 18+ 
- npm or yarn

## 📋 Complete Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install Playwright Browsers
```bash
npx playwright install
```

### Step 3: Configure Environment Variables
1. Copy `config.env.example` to `.env`:
   ```bash
   cp config.env.example .env
   ```

2. Update `.env` with your credentials:
   ```bash
   BASE_URL=https://staging.ewalletcashier.com
   ADMIN_EMAIL=qatesthub2@gmail.com
   ADMIN_PASSWORD=password
   TOTP_SECRET=  # Leave empty - will be extracted automatically
   ```

## 🧪 Running Tests

### Test the Complete Login Flow
```bash
npm test tests/complete-login.spec.ts
```

### Test 2FA Setup Specifically
```bash
npm test tests/2fa-setup.spec.ts
```

### Run All Tests
```bash
npm test
```

### Debug Mode (Recommended for Development)
```bash
npm run test:ui
```

### Headed Mode (See Browser)
```bash
npm run test:headed
```

## 🔐 How the 2FA Solution Works

The system automatically handles the 2FA key reset issue by:

1. **Detecting 2FA Setup**: Checks if the user needs to set up 2FA
2. **Extracting TOTP Secret**: Automatically extracts the secret from:
   - QR code data URLs
   - Page content patterns
   - Hidden form fields
3. **Generating TOTP Codes**: Uses the extracted secret to generate valid 2FA codes
4. **Fallback to Recovery Codes**: If secret extraction fails, uses recovery codes
5. **Complete Authentication**: Handles the entire flow from login to dashboard access

## 📁 Test Structure

- `tests/complete-login.spec.ts` - **Main test**: Complete login flow with 2FA
- `tests/2fa-setup.spec.ts` - **2FA specific**: Tests 2FA setup and verification
- `tests/dashboard.spec.ts` - Dashboard functionality tests
- `tests/helpers/auth.ts` - **Core authentication logic** with 2FA handling
- `tests/helpers/debug-2fa.ts` - Debug utilities for troubleshooting
- `tests/auth.setup.ts` - Authentication setup utilities

## 🔍 Debugging 2FA Issues

If you encounter 2FA problems:

1. **Run in Debug Mode**:
   ```bash
   npm run test:debug
   ```

2. **Check Console Output**: The tests log detailed information about the 2FA process

3. **View Screenshots**: Failed tests automatically capture screenshots in `test-results/`

4. **Use Debug Helpers**: The `debug-2fa.ts` helper provides detailed page analysis

## 🎯 Test Scenarios Covered

### ✅ Complete Login Flow
- Email/password authentication
- 2FA setup (if required)
- 2FA verification
- Dashboard access
- Session persistence

### ✅ 2FA Edge Cases
- New 2FA setup
- Existing 2FA verification
- Recovery code usage
- Key reset handling

### ✅ Dashboard Functionality
- Navigation sidebar
- Charts and metrics
- User information display
- Session management

## 🚨 Troubleshooting

### Common Issues:

1. **2FA Setup Fails**: 
   - Check if the page structure has changed
   - Run debug tests to see what's on the page
   - Verify the application is accessible

2. **Authentication Errors**:
   - Ensure credentials are correct in `.env`
   - Check if the application requires different authentication flow

3. **Browser Issues**:
   - Run `npx playwright install` to reinstall browsers
   - Try running in headed mode to see what's happening

### Debug Commands:
```bash
# Run specific test with debugging
npx playwright test tests/2fa-setup.spec.ts --debug

# Run with UI mode for interactive debugging
npm run test:ui

# Generate new tests
npm run codegen
```

## 📊 Expected Results

After successful execution, you should see:
- ✅ Login completed successfully
- ✅ 2FA setup/verification completed
- ✅ Dashboard accessed with all elements visible
- ✅ Charts showing "Pending Orders by Platform"
- ✅ Navigation sidebar with Management, Finance, System sections

## 🔄 Continuous Integration

The solution is designed to work reliably in CI/CD environments:
- Automatic 2FA handling without manual intervention
- Robust error handling and fallbacks
- Detailed logging for debugging
- Screenshot capture on failures

## 📝 Contributing

1. Follow the existing test patterns
2. Use the authentication helpers for protected endpoints
3. Add debug logging for complex flows
4. Update this README for new features

---

**Note**: This solution specifically addresses the DEV's concern about 2FA keys getting reset on every login by automatically extracting and using the new keys each time.
