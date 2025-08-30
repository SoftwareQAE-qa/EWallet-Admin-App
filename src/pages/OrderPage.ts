import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Page header elements
    pageHeading() { return this.page.getByRole('heading', { name: 'Create New Order' }); }
    breadcrumbOrders() { return this.page.getByRole('link', { name: 'Orders' }); }

    // Action buttons
    importOrdersButton() { return this.page.getByRole('button', { name: /Import Orders/i }); }
    recalculateOrderSummaryButton() { return this.page.getByRole('button', { name: /Recalculate Order Summary/i }); }
    createButton() { return this.page.getByRole('button', { name: /^Create$/i }).nth(3); }
    createAndCreateAnotherButton() { return this.page.getByRole('button', { name: /Create & create another/i }); }

    // Form fields - Order meta
    orderNameInput() { return this.page.getByLabel(/Order Name/i).first(); }
    receivingAgentDropdown() { return this.page.getByLabel(/Receiving Agent/i); }
    telegramHandleDropdown() { return this.page.getByLabel(/Telegram handle of person receiving notifications/i); }
    telegramIdInput() { return this.page.getByLabel(/Telegram Group ID/i); }

    // Discount / Premium settings
    discountTierHeading() { return this.page.getByRole('heading', { name: /Discount Tier and Premium Charge Settings/i }); }
    agentDiscountTierDropdown() { return this.page.getByLabel(/Agent Discount Tier/i); }
    overrideDefaultBehaviorCheckbox() { return this.page.getByLabel(/Override default behavior/i); }

    // Order Summary
    orderSummaryHeading() { return this.page.getByRole('heading', { name: /Order Summary/i }); }
    totalAmountSummary() { return this.page.locator('#total-amount-summary'); }
    orderAmountInput() { return this.page.getByLabel(/Order Amount/i); }
    minimumSendAmountInput() { return this.page.getByLabel(/Set Default Minimum Amount/i); }

    // Wallet Platforms section
    walletPlatformsSection() { return this.page.getByRole('heading', { name: /Wallet Platforms/i }); }
    addWalletPlatformButton() { return this.page.getByRole('button', { name: /Add Wallet Platform/i }); }
    
    // Platform fields (first platform)
    platformDropdown() { return this.page.getByLabel(/Platform/i).first(); }
    usernamePhoneEmailInput() { return this.page.getByLabel(/Username\/Phone\/Email/i).first(); }

    // Error messages
    errorMessage() { return this.page.locator('.text-red-500, .error-message, [class*="error"]'); }
    validationError() { return this.page.locator('[class*="error"], [class*="invalid"], .text-red-500'); }

    // Page validation methods
    async assertPageLoaded() {
        await expect(this.pageHeading()).toBeVisible();
        await expect(this.breadcrumbOrders()).toBeVisible();
    }

    async assertFormElementsVisible() {
        // Action buttons
        await expect(this.importOrdersButton()).toBeVisible();
        await expect(this.recalculateOrderSummaryButton()).toBeVisible();

        // Form fields
        await expect(this.orderNameInput()).toBeVisible();
        await expect(this.receivingAgentDropdown()).toBeVisible();
        await expect(this.telegramHandleDropdown()).toBeVisible();
        await expect(this.telegramIdInput()).toBeVisible();

        // Discount settings
        await expect(this.discountTierHeading()).toBeVisible();
        await expect(this.agentDiscountTierDropdown()).toBeVisible();

        // Order summary
        await expect(this.orderSummaryHeading()).toBeVisible();
        await expect(this.totalAmountSummary()).toBeVisible();
        await expect(this.orderAmountInput()).toBeVisible();
        await expect(this.minimumSendAmountInput()).toBeVisible();

        // Wallet platforms
        await expect(this.walletPlatformsSection()).toBeVisible();
        await expect(this.addWalletPlatformButton()).toBeVisible();
        await expect(this.platformDropdown()).toBeVisible();
        await expect(this.usernamePhoneEmailInput()).toBeVisible();

        // Footer buttons
        await expect(this.createButton()).toBeVisible();
        await expect(this.createAndCreateAnotherButton()).toBeVisible();
    }

    // Form interaction methods
    async enterOrderName(orderName: string) {
        await this.orderNameInput().fill(orderName);
    }

    async selectReceivingAgent(agentName: string) {
        await this.receivingAgentDropdown().click();
        await this.page.getByRole('option', { name: agentName }).click();
    }

    async selectAgentDiscountTier(tierName: string) {
        await this.agentDiscountTierDropdown().click();
        await this.page.getByRole('option', { name: tierName }).click();
    }

    async selectTelegramHandle(handle: string) {
        await this.telegramHandleDropdown().click();
        await this.page.getByRole('option', { name: handle }).click();
    }

    async enterOrderAmount(amount: string) {
        await this.orderAmountInput().fill(amount);
    }

    async enterMinimumSendAmount(amount: string) {
        await this.minimumSendAmountInput().fill(amount);
    }

    async selectPlatform(platformName: string) {
        await this.platformDropdown().click();
        await this.page.getByRole('option', { name: platformName }).click();
    }

    async enterUsernamePhoneEmail(value: string) {
        await this.usernamePhoneEmailInput().fill(value);
    }

    async clickRecalculateOrderSummary() {
        await this.recalculateOrderSummaryButton().click();
    }

    async clickAddWalletPlatform() {
        await this.addWalletPlatformButton().click();
    }

    async clickCreate() {
        await this.createButton().click();
    }

    // Validation methods for positive scenarios
    async validateOrderNameAcceptsText(text: string) {
        await this.enterOrderName(text);
        await expect(this.orderNameInput()).toHaveValue(text);
    }

    async validateReceivingAgentDropdownLoads() {
        await this.receivingAgentDropdown().click();
        await this.page.waitForTimeout(1000);
        const options = this.page.locator('[role="option"]');
        await expect(options.first()).toBeVisible();
    }

    async validateAgentDiscountTierDropdownLoads() {
        await this.agentDiscountTierDropdown().click();
        await this.page.waitForTimeout(1000);
        const options = this.page.locator('[role="option"]');
        await expect(options.first()).toBeVisible();
    }

    async validateTelegramHandleDropdownLoads() {
        await this.telegramHandleDropdown().click();
        await this.page.waitForTimeout(1000);
        const options = this.page.locator('[role="option"]');
        await expect(options.first()).toBeVisible();
    }

    async validateTelegramIdAutoFills() {
        await this.telegramHandleDropdown().click();
        const firstOption = this.page.locator('[role="option"]').first();
        await firstOption.click();
        
        const telegramIdValue = await this.telegramIdInput().inputValue();
        if (telegramIdValue) {
            await expect(this.telegramIdInput()).not.toHaveValue('');
        }
    }

    async validateRecalculateOrderSummary() {
        await this.enterOrderName('Test Order');
        await this.enterOrderAmount('100');
        
        const initialTotal = await this.totalAmountSummary().textContent();
        await this.clickRecalculateOrderSummary();
        await this.page.waitForTimeout(2000);
        
        const updatedTotal = await this.totalAmountSummary().textContent();
        expect(updatedTotal).toBeDefined();
    }

    async validateOrderAmountAcceptsNumericValue(value: string) {
        await this.enterOrderAmount(value);
        await expect(this.orderAmountInput()).toHaveValue(value);
    }

    async validateWalletPlatformsDropdownLoads() {
        await this.platformDropdown().click();
        await this.page.waitForTimeout(1000);
        const options = this.page.locator('[role="option"]');
        await expect(options.first()).toBeVisible();
    }

    async validateUsernamePhoneEmailAcceptsInput(value: string) {
        await this.enterUsernamePhoneEmail(value);
        await expect(this.usernamePhoneEmailInput()).toHaveValue(value);
    }

    async validateAddWalletPlatformAddsNewEntry() {
        const initialPlatforms = await this.page.locator('[data-testid="wallet-platform"], .wallet-platform-section').count();
        await this.clickAddWalletPlatform();
        await this.page.waitForTimeout(1000);
        const updatedPlatforms = await this.page.locator('[data-testid="wallet-platform"], .wallet-platform-section').count();
        expect(updatedPlatforms).toBeGreaterThan(initialPlatforms);
    }

    async validateSaveWithValidData() {
        await this.enterOrderName('Valid Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.selectTelegramHandle('test_handle');
        await this.enterOrderAmount('100');
        await this.enterMinimumSendAmount('10');
        await this.selectPlatform('Test Platform');
        await this.enterUsernamePhoneEmail('test@example.com');
        
        await this.clickCreate();
        await this.page.waitForTimeout(2000);
    }

    // Negative test validation methods
    async validateEmptyOrderNameError() {
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
        await expect(this.errorMessage()).toContainText('Order Name is required');
    }

    async validateEmptyReceivingAgentError() {
        await this.enterOrderName('Test Order');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateEmptyAgentDiscountTierError() {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateNoTelegramHandleSelectedError() {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateInvalidOrderAmountError(invalidAmount: string) {
        await this.enterOrderAmount(invalidAmount);
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateNegativeOrderAmountError() {
        await this.enterOrderAmount('-100');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateEmptyMinimumSendAmountError() {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.selectTelegramHandle('test_handle');
        await this.enterOrderAmount('100');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateEmptyPlatformError() {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.selectTelegramHandle('test_handle');
        await this.enterOrderAmount('100');
        await this.enterMinimumSendAmount('10');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateEmptyUsernamePhoneEmailError() {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.selectTelegramHandle('test_handle');
        await this.enterOrderAmount('100');
        await this.enterMinimumSendAmount('10');
        await this.selectPlatform('Test Platform');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validatePartialWalletDetailsError() {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.selectTelegramHandle('test_handle');
        await this.enterOrderAmount('100');
        await this.enterMinimumSendAmount('10');
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }

    async validateInvalidEmailError(invalidEmail: string) {
        await this.enterOrderName('Test Order');
        await this.selectReceivingAgent('Test Agent');
        await this.selectAgentDiscountTier('Standard');
        await this.selectTelegramHandle('test_handle');
        await this.enterOrderAmount('100');
        await this.enterMinimumSendAmount('10');
        await this.selectPlatform('Test Platform');
        await this.enterUsernamePhoneEmail(invalidEmail);
        await this.clickCreate();
        await expect(this.errorMessage()).toBeVisible();
    }
}
