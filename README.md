# EWallet Playwright Tests

This project contains automated tests for the EWallet application using Playwright with a Page Object Model (POM) structure.

## Project Structure

```
EWallet/
├── pages/                 # POM classes
│   ├── BasePage.ts        # Base page with common methods
│   ├── LoginPage.ts       # Login page interactions
│   ├── TwoFAPage.ts       # 2FA page interactions
│   └── DashboardPage.ts   # Dashboard page interactions
├── utils/
│   └── totpUtils.ts       # TOTP utilities
├── tests/
│   └── login-cases.spec.ts # Comprehensive login test cases
├── playwright.config.ts    # Playwright configuration with env vars
└── package.json           # Project dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run install-browsers
```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root with your credentials:
   ```bash
   # EWallet Test Configuration
   BASE_URL=https://ewallet.walletwhisper.io
   
   # Admin credentials (REPLACE WITH YOUR ACTUAL CREDENTIALS)
   EMAIL=your_email@example.com
   PASSWORD=your_password
   
   # 2FA configuration
   TOTP_SECRET=your_totp_secret
   
   # Test configuration
   NODE_ENV=test
   TIMEOUT_DEFAULT=60000
   TIMEOUT_SHORT=15000
   ```

## Configuration

The project uses environment variables for secure configuration. Create a `.env` file in the project root:

```bash
# EWallet Test Configuration
BASE_URL=https://ewallet.walletwhisper.io

# Admin credentials (REPLACE WITH YOUR ACTUAL CREDENTIALS)
EMAIL=your_email@example.com
PASSWORD=your_password

# 2FA configuration
TOTP_SECRET=your_totp_secret

# Test configuration
NODE_ENV=test
TIMEOUT_DEFAULT=60000
TIMEOUT_SHORT=15000
```

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Test Cases

The project includes comprehensive login test cases:

### EW_01 - Verify Successful login with valid credentials
1. Go to ewallet.walletwhisper.io/admin/login
2. Enter the valid "email" in the email field
3. Enter the valid "password" in the password field
4. Click the "Sign-in" button
5. User is redirected to the admin dashboard

### EW_02 - Verify 2FA authentication flow
Complete 2FA authentication process including OTP generation and dashboard access.

### EW_03 - Verify login with invalid email format
Tests validation for malformed email addresses.

### EW_04 - Verify login with empty credentials
Tests form validation for empty fields.

### EW_05 - Verify login with wrong password
Tests authentication failure handling.

## Running Tests

- Run all tests: `npm test`
- Run tests in Chrome: `npm run test:chrome`
- Run tests in headed mode: `npm run test:headed`
- Run tests with UI: `npm run test:ui`
- Debug tests: `npm run test:debug`

## Page Object Model

The project uses a POM structure for better maintainability:

- **BasePage**: Common methods and utilities for all page objects
- **LoginPage**: Handles login form interactions
- **TwoFAPage**: Manages 2FA code entry
- **DashboardPage**: Verifies dashboard content

## Benefits of POM Structure

- **Maintainability**: Easy to update locators in one place
- **Reusability**: Page objects can be reused across multiple tests
- **Readability**: Tests are more readable and focused on business logic
- **Maintenance**: Changes to UI elements only require updates in page objects

## Environment Variables Benefits

- **Security**: Credentials are not hardcoded in source code
- **Flexibility**: Easy to switch between different environments
- **Team Safety**: Each developer can use their own credentials
- **CI/CD Ready**: Perfect for automated testing pipelines
- **Direct Usage**: No intermediate config files needed
- **Clean Code**: Simple variable names like `process.env.EMAIL`
