import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from 'console';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  userAvatar() { return this.page.getByRole('button', { name: /profile|account|avatar/i }).or(this.page.getByRole('img', { name: /avatar|user/i })); }
  card(title: string | RegExp) { return this.page.getByRole('region', { name: title }).or(this.page.getByText(title)); }
  clickToSeeBreakdown() { return this.page.getByRole('button', { name: /click to see breakdown/i }); }
  manageDelayedOrdersButton() { return this.page.getByRole('button', { name: /manage delayed orders/i }); }

  async assertLoaded() {
    await expect(this.page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
  }
  header() { return this.page.locator('header').first(); }
  async validateTotalOrders() {
    const totalOrdersText = await this.card(/total orders/i).innerText();
    const totalOrdersNumber = parseInt(totalOrdersText.replace(/\D/g, ''), 10); // Extract number from text
    console.log('Total Orders Number:', totalOrdersNumber);
    //await expect(this.page.getbylocator("(//p[@class='text-2xl font-semibold text-blue-600'])[1]")).toBeVisible(); 
    //expect(totalOrdersNumber).toBeGreaterThanOrEqual(0); // Adjust based on expected minimum
  }
  async validateTotalVolumeSent() {
    const totalVolumeText = await this.card(/total volume sent/i).innerText();
    const totalVolumeNumber = parseFloat(totalVolumeText.replace(/[^0-9.-]+/g, '')); // Extract number from text
    console.log('Total Volume Sent:', totalVolumeNumber);
    await expect(this.page.getByText(/total volume sent/i)).toBeVisible();
    //expect(totalVolumeNumber).toBeGreaterThanOrEqual(0); // Adjust based on expected minimum
  }
  async validateNetProfit() {
    const netProfitText = await this.card(/net profit/i).innerText();
    const netProfitNumber = parseFloat(netProfitText.replace(/[^0-9.-]+/g, '')); // Extract number from text
    console.log('Net Profit:', netProfitNumber);
    await expect(this.page.getByText(/net profit/i)).toBeVisible();
    //expect(netProfitNumber).toBeGreaterThanOrEqual(0); // Adjust based on expected minimum
  }
  async validatePendingOrders() {
    const pendingOrdersText = await this.card(/pending orders/i).innerText();
    const pendingOrdersNumber = parseInt(pendingOrdersText.replace(/\D/g, ''), 10); // Extract number from text
    console.log('Pending Orders Number:', pendingOrdersNumber);
    await expect(this.page.getByText(/pending orders/i)).toBeVisible();
    //expect(pendingOrdersNumber).toBeGreaterThanOrEqual(0); // Adjust based on expected minimum
  }
  async validateUnmatchedSendRequests() {
    const unmatchedRequestsText = await this.card(/unmatched send requests/i).innerText();
    const unmatchedRequestsNumber = parseInt(unmatchedRequestsText.replace(/\D/g, ''), 10); // Extract number from text
    console.log('Unmatched Send Requests Number:', unmatchedRequestsNumber);
    await expect(this.page.getByText(/UNMATCHED SEND REQUESTS/i)).toBeVisible();
    //expect(unmatchedRequestsNumber).toBeGreaterThanOrEqual(0); // Adjust based on expected minimum
  }
  async clickToSeeBreakdownAndValidate() {
    //await this.clickToSeeBreakdown().click();
    const clickableText = await this.page.locator('.flex-1.mt-1.text-xs.text-blue-600.underline.cursor-pointer');
    await expect(clickableText).toHaveText('Click to see breakdown');
    await clickableText.click();
    await expect(this.page.goto('/admin/unmatch-send-requests'));
  }
  async manageDelayedOrdersButtonAndValidate() {
    await this.manageDelayedOrdersButton().click();
    await expect(this.page).toHaveURL(/delayed-orders|orders\?filter=delayed/i);
  }
  async validateMismatchTransactionsCard() {
    const mismatchCard = await this.page.locator("//p[normalize-space()='View Over/Under Sends']");
    //await expect(mismatchCard).toHaveText('View Over/Under Sends');
    await expect(mismatchCard).toHaveText(/view over\/under sends/i);
    await mismatchCard.click();
    await log('Clicked on View Over/Under Sends link');
    await expect(this.page.goto('/admin/mismatch-transactions'));
    await log('Navigated to /admin/mismatch-transactions');
  }
  async validateAddNewOrderButton() {
    await expect(this.page.locator('a[href="/admin/receivers/create"]')).toHaveText(/Add New Order/i, { timeout: 10000 });
    await log('✅ Add New Order button is visible');
  }
  async clickAddNewOrder() {
    await expect(this.page.locator('a[href="/admin/receivers/create"]')).toBeVisible();
    await this.page.locator('a[href="/admin/receivers/create"]').click();
    await expect(this.page).toHaveURL('admin/receivers/create');
    await expect(this.page.locator('h1.fi-header-heading')).toContainText('Create New Order'); //heading
  }
  async validateCreateNewOrderForm() {
    // --- Page header & breadcrumb ---
    await expect(this.page.getByRole('heading', { name: 'Create New Order' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Orders' })).toBeVisible();

    // --- Action buttons ---
    await expect(this.page.getByRole('button', { name: /Import Orders/i })).toBeVisible();
    await expect(this.page.getByRole('button', { name: /Recalculate Order Summary/i })).toBeVisible();

    // --- Form fields (Order meta) ---
    await expect(this.page.getByLabel(/Order Name/i)).toBeVisible();
    await expect(this.page.getByLabel(/Receiving Agent/i)).toBeVisible();
    await expect(this.page.getByLabel(/Telegram handle/i)).toBeVisible();
    await expect(this.page.getByLabel(/Telegram Group ID/i)).toBeVisible();

    // --- Discount / Premium settings ---
    await expect(this.page.getByRole('heading', { name: /Discount Tier and Premium Charge Settings/i })).toBeVisible();
    await expect(this.page.getByLabel(/Override default behavior/i)).toBeVisible();
    await expect(this.page.getByLabel(/Agent Discount Tier/i)).toBeVisible();
    await expect(this.page.getByLabel(/Premium Charge/i)).toBeVisible();

    // --- Order Summary ---
    await expect(this.page.getByRole('heading', { name: /Order Summary/i })).toBeVisible();
    await expect(this.page.locator('#total-amount-summary')).toBeVisible();
    await expect(this.page.locator('#final-amount-summary')).toBeVisible();
    await expect(this.page.getByLabel(/Set Default Minimum Amount/i)).toBeVisible();

    // --- Orders (sub-orders) ---
    await expect(this.page.getByRole('heading', { name: /^Orders/ })).toBeVisible();
    await expect(this.page.getByLabel(/Sub Order Name/i)).toBeVisible();
    await expect(this.page.getByLabel(/^Order Amount/i)).toBeVisible();
    await expect(this.page.getByLabel(/Minimum Send Amount/i)).toBeVisible();
    await expect(this.page.getByLabel(/Maximum Send Amount/i)).toBeVisible();

    // Wallet Platform sub-block
    await expect(this.page.getByRole('heading', { name: /Wallet Platform/i })).toBeVisible();
    await expect(this.page.getByLabel(/^Platform$/i)).toBeVisible();
    await expect(this.page.getByLabel(/Username\/Phone Number\/Email/i)).toBeVisible();
    await expect(this.page.getByRole('button', { name: /Add Wallet Platform/i })).toBeVisible();
    await expect(this.page.getByRole('button', { name: /^Add Order$/i })).toBeVisible();

    // --- Footer buttons ---
    await expect(this.page.getByRole('button', { name: /^Create$/i })).toBeVisible();
    await expect(this.page.getByRole('button', { name: /Create & create another/i })).toBeVisible();
  }
}


