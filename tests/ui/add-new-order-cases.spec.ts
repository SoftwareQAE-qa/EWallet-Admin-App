import { test, expect } from '../../src/fixtures/auth';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { OrderPage } from '../../src/pages/OrderPage';
import * as dotenv from 'dotenv';
dotenv.config();

test.describe('Add New Order Test Cases', () => {
    let dashboardPage: DashboardPage;
    let orderPage: OrderPage;

    test.beforeEach(async ({ page, loginAsAdmin }) => {
        await loginAsAdmin();
        dashboardPage = new DashboardPage(page);
        orderPage = new OrderPage(page);
        await dashboardPage.assertLoaded();
        await dashboardPage.clickAddNewOrder();
        await orderPage.assertPageLoaded();
    });

    // Positive Test Cases (EW_44-EW_55)

    // EW_44: Validate "Add New order" page load successfully
    test('EW_44: Validate "Add New order" page load successfully', async ({ page }) => {
        await orderPage.assertFormElementsVisible();
    });

    // EW_45: Validate "Order Name" accepts text
    test('EW_45: Validate "Order Name" accepts text', async ({ page }) => {
        await orderPage.validateOrderNameAcceptsText('Test Order Name');
    });

    // EW_46: Validate "Receiving Agent" dropdown loads options
    test('EW_46: Validate "Receiving Agent" dropdown loads options', async ({ page }) => {
        await orderPage.validateReceivingAgentDropdownLoads();
    });

    // EW_47: Validate "Agent Discount Tier" dropdown loads
    test('EW_47: Validate "Agent Discount Tier" dropdown loads', async ({ page }) => {
        await orderPage.validateAgentDiscountTierDropdownLoads();
    });

    // EW_48: Validate "Telegram Handle" dropdown loads options
    test('EW_48: Validate "Telegram Handle" dropdown loads options', async ({ page }) => {
        await orderPage.validateTelegramHandleDropdownLoads();
    });

    // EW_49: Validate Telegram ID auto-fills if linked
    test('EW_49: Validate Telegram ID auto-fills if linked', async ({ page }) => {
        await orderPage.validateTelegramIdAutoFills();
    });

    // EW_50: Validate "Recalculate order summery" button
    test('EW_50: Validate "Recalculate order summery" button', async ({ page }) => {
        await orderPage.validateRecalculateOrderSummary();
    });

    // EW_51: Validate "Order Amount" input
    test('EW_51: Validate "Order Amount" input', async ({ page }) => {
        await orderPage.validateOrderAmountAcceptsNumericValue('100');
    });

    // EW_52: Validate "Wallet Platforms" dropdown
    test('EW_52: Validate "Wallet Platforms" dropdown', async ({ page }) => {
        await orderPage.validateWalletPlatformsDropdownLoads();
    });

    // EW_53: Validate Username/Phone/Email input field
    test('EW_53: Validate Username/Phone/Email input field', async ({ page }) => {
        await orderPage.validateUsernamePhoneEmailAcceptsInput('test@example.com');
    });

    // EW_54: Validate "Add Wallet Platform" adds a new entry
    test('EW_54: Validate "Add Wallet Platform" adds a new entry', async ({ page }) => {
        await orderPage.validateAddWalletPlatformAddsNewEntry();
    });

    // EW_55: Validate 'Save" button saves valid data
    test('EW_55: Validate "Save" button saves valid data', async ({ page }) => {
        await orderPage.validateSaveWithValidData();
    });

    // Negative Test Cases (EW_56-EW_66)

    // EW_56: Validate empty "Order Name" error
    test('EW_56: Validate empty "Order Name" error', async ({ page }) => {
        await orderPage.validateEmptyOrderNameError();
    });

    // EW_57: Validate empty "Receiving Agent" error
    test('EW_57: Validate empty "Receiving Agent" error', async ({ page }) => {
        await orderPage.validateEmptyReceivingAgentError();
    });

    // EW_58: Validate empty "Agent Discount Tier" error
    test('EW_58: Validate empty "Agent Discount Tier" error', async ({ page }) => {
        await orderPage.validateEmptyAgentDiscountTierError();
    });

    // EW_59: Validate no Telegram handle selected
    test('EW_59: Validate no Telegram handle selected', async ({ page }) => {
        await orderPage.validateNoTelegramHandleSelectedError();
    });

    // EW_60: Validate invalid amount in "Order Amount"
    test('EW_60: Validate invalid amount in "Order Amount"', async ({ page }) => {
        await orderPage.validateInvalidOrderAmountError('abc');
    });

    // EW_61: Validate negative number in "Order Amount"
    test('EW_61: Validate negative number in "Order Amount"', async ({ page }) => {
        await orderPage.validateNegativeOrderAmountError();
    });

    // EW_62: Validate empty "Minimum Send Amount"
    test('EW_62: Validate empty "Minimum Send Amount"', async ({ page }) => {
        await orderPage.validateEmptyMinimumSendAmountError();
    });

    // EW_63: Validate empty platform
    test('EW_63: Validate empty platform', async ({ page }) => {
        await orderPage.validateEmptyPlatformError();
    });

    // EW_64: Validate empty Username/Phone/Email field
    test('EW_64: Validate empty Username/Phone/Email field', async ({ page }) => {
        await orderPage.validateEmptyUsernamePhoneEmailError();
    });

    // EW_65: Validate form save with only partial wallet details
    test('EW_65: Validate form save with only partial wallet details', async ({ page }) => {
        await orderPage.validatePartialWalletDetailsError();
    });

    // EW_66: Validate invalid email in "Username/Phone/Email"
    test('EW_66: Validate invalid email in "Username/Phone/Email"', async ({ page }) => {
        await orderPage.validateInvalidEmailError('test@.com');
    });
});
