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

## Authentication & Session Management

This project implements **Playwright's equivalent of Cypress `cy.session()`** using `globalSetup` and `storageState`. This ensures that:

- ✅ **Login happens only once** at the start of the test run
- ✅ **Session persists** across all subsequent test blocks
- ✅ **No repeated authentication** in individual tests
- ✅ **Faster test execution** by avoiding login overhead

### How It Works

1. **Global Setup**: `global-setup.ts` runs once before all tests
2. **Authentication**: Performs login and 2FA verification
3. **Session Storage**: Saves authentication state to `playwright/.auth/user.json`
4. **Test Execution**: All tests use the stored session state automatically

### Authentication Commands

```bash
# Set up authentication (run once or when session expires)
npm run auth:setup

# Check authentication status
npm run auth:check

# Clean up stored authentication
npm run auth:cleanup

# Run specific test suites
npm run test:add-new-order
npm run test:import-orders
```

### When to Re-authenticate

- Session expires (usually after 24 hours)
- Credentials change
- Authentication fails
- After running `npm run auth:cleanup`

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

### Add New Order Test Cases (`add-new-order-cases.spec.ts`)
- **EW_18**: Dashboard > Add New Order - Validate "Add New Order" page loads successfully
- **EW_19**: Dashboard > Add New Order - Validate an "Import orders" button is visible

### Import Orders Test Cases (`import-orders-cases.spec.ts`)
- **EW_20**: Dashboard > Add New Order > Import Orders - Validate "Import orders" page loads
- **EW_21**: Dashboard > Add New Order > Import Orders - Validate "Download Template" button
- **EW_22**: Dashboard > Add New Order > Import Orders - Validate file upload with valid Excel file
- **EW_23**: Dashboard > Add New Order > Import Orders - Validate file upload with valid CSV file
- **EW_24**: Dashboard > Add New Order > Import Orders - Validate "Import orders" button after valid file upload
- **EW_25**: Dashboard > Add New Order > Import Orders - Validate optional fields are accepted
- **EW_26**: Dashboard > Add New Order > Import Orders - Validate multiple platforms under same orders
- **EW_27**: Dashboard > Add New Order > Import Orders - Validate order grouping by order_name
- **EW_28**: Dashboard > Add New Order > Import Orders - Validate max file size is accepted
- **EW_29**: Dashboard > Add New Order > Import Orders - Validate drag-and-drop upload

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
