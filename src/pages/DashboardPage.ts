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
    const addNewOrderButton = await this.page.getByRole('button', { name: /add new order/i });
    await expect(addNewOrderButton).toBeVisible();
    await log('Add New Order button is visible');
  }
  async addNewOrderButtonAndValidate() {
    const addNewOrderButton = await this.page.getByRole('button', { name: /add new order/i });
    //await expect(addNewOrderButton).toBeVisible();
    await addNewOrderButton.click();
    await expect(this.page).toHaveURL(/\/admin?/);
    await expect(this.page.getByRole('heading', { name: /Add New Order/i })).toBeVisible();
    await log('Load Add New Order button is visible and functional');
    // await this.page.goBack(); // Navigate back to the dashboard
    // await expect(this.page).toHaveURL(/\/admin?/);

  }

}


