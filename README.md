# EWallet Playwright Tests

This project contains automated tests for the EWallet application using Playwright with a Page Object Model (POM) structure.

## Project Structure

```
EWallet/
├── pages/                 # POM classes
│   ├── BasePage.ts        # Base page with common methods
│   ├── LoginPage.ts       # Login page interactions
│   ├── TwoFAPage.ts       # 2FA page interactions
│   └── DashboardPage.ts   # Dashboard page interactions with comprehensive methods
├── utils/
│   └── totpUtils.ts       # TOTP utilities
├── tests/
│   ├── login-cases.spec.ts    # Comprehensive login test cases
│   ├── dashboard-cases.spec.ts # Dashboard functionality test cases
│   └── auth.setup.ts          # Authentication setup for session retention
├── playwright.config.ts    # Playwright configuration with multiple projects
├── auth.json              # Stored authentication state (auto-generated)
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

### Login Test Cases (`login-cases.spec.ts`)
- **EW_01**: Verify Successful login with valid credentials
- **EW_02**: Validate Log in fails with incorrect password
- **EW_03**: Validate Log in fails with empty field
- **EW_04**: Validate "Remember me" checkbox functionality
- **EW_05**: Validate "Forgot password?" field navigation
- **EW_06**: Validate Email field validation
- **EW_07**: Validate Password field masking
- **EW_08**: Validate Successful Admin log in

### Dashboard Test Cases (`dashboard-cases.spec.ts`)
- **EW_09**: Validate that the Dashboard is displaying
- **EW_10**: Validate Total Orders card visibility and actual numbers
- **EW_11**: Validate Total Volume Sent card visibility
- **EW_12**: Validate Net Profit card visibility
- **EW_13**: Validate Pending Orders card visibility
- **EW_14**: Validate Unmatched Send Requests card and link
- **EW_15**: Validate Delayed Orders card and link
- **EW_16**: Validate Mismatch Transactions card and link
- **EW_17**: Validate "Add New Order" button visibility

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Run only login tests
npm test tests/login-cases.spec.ts

# Run only dashboard tests (with session retention)
npm test --project=dashboard-tests

# Run tests in Chrome
npm run test:chrome

# Run tests in headed mode
npm run test:headed

# Run tests with UI
npm run test:ui

# Debug tests
npm run test:debug
```

## Session Retention

The dashboard tests use **session retention** to avoid login repetition:

1. **Authentication Setup**: `auth.setup.ts` runs once to authenticate and store session
2. **Stored State**: Authentication state is saved to `auth.json`
3. **Dashboard Tests**: Use stored authentication state for faster execution
4. **No Login Repetition**: Each dashboard test starts with an authenticated session

## Page Object Model

The project uses a POM structure for better maintainability:

- **BasePage**: Common methods and utilities for all page objects
- **LoginPage**: Handles login form interactions with enhanced methods
- **TwoFAPage**: Manages 2FA code entry
- **DashboardPage**: Comprehensive dashboard interactions including:
  - Card visibility verification
  - Value extraction from dashboard widgets
  - Clickable element interactions
  - Modal and navigation handling

## Benefits of POM Structure

- **Maintainability**: Easy to update locators in one place
- **Reusability**: Page objects can be reused across multiple tests
- **Readability**: Tests are more readable and focused on business logic
- **Maintenance**: Changes to UI elements only require updates in page objects
- **Session Management**: Efficient authentication handling for dashboard tests

## Environment Variables Benefits

- **Security**: Credentials are not hardcoded in source code
- **Flexibility**: Easy to switch between different environments
- **Team Safety**: Each developer can use their own credentials
- **CI/CD Ready**: Perfect for automated testing pipelines
- **Direct Usage**: No intermediate config files needed
- **Clean Code**: Simple variable names like `process.env.EMAIL`
