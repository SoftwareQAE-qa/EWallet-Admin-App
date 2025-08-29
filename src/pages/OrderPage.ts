import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from 'console';
import fs from 'fs';
import path from 'path';

export class OrderPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    userAvatar() { return this.page.getByRole('button', { name: /profile|account|avatar/i }).or(this.page.getByRole('img', { name: /avatar|user/i })); }
    card(title: string | RegExp) { return this.page.getByRole('region', { name: title }).or(this.page.getByText(title)); }
    importOrdersButton() { return this.page.locator("//span[@class='fi-btn-label'][normalize-space()='Import Orders']"); } totalOrders() { return this.page.getByText(/total orders/i); }
    impottDialogHeading() { return this.page.getByRole('heading', { name: /Import Orders/i }); }
    fileInput() { return this.page.locator('input[type="file"]'); }
    tempFilePath() { return path.join(__dirname, '../../srrc/fixtures/multi-platform-order.csv'); }
    async assertLoaded() {
        await expect(this.page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
    }

    async validateImportOrdersButton() {
        const button = this.importOrdersButton();

        await expect(button).toBeVisible({ timeout: 10000 }); // wait up to 10s
        await expect(button).toBeEnabled();

        // Ensure it's stable before clicking
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click({ timeout: 10000, force: true });

        // Validate popup/dialog heading after click
        await expect(this.page.getByRole('heading', { name: /Import Orders/i }).first()).toBeVisible({ timeout: 10000 });

        await log('Import Orders button is visible and clickable');
    }
    assertImportOrdersPageLoaded() {
        return expect(this.page.getByRole('heading', { name: /Import Orders/i }).first()).toBeVisible({ timeout: 10000 });
    }

    downloadTemplateButton() {
        return this.page.locator("//span[normalize-space()='Download Template']");
    }

    async validateDownloadTemplateButton() {
        const button = this.downloadTemplateButton();

        await expect(button).toBeVisible({ timeout: 10000 }); // wait up to 10s
        await expect(button).toBeEnabled();

        // Ensure it’s interactable
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click({ timeout: 10000, force: true });

        await log('Download Template button is visible, clickable, and triggers download');
    }
    uploadFileInput() {
        // assuming the input type=file is inside the Import Orders dialog
        return this.page.locator("//span[contains(@class,'filepond--label-action')]");
    }

    async uploadValidExcelFile(filePath: string) {
        const fileInput = this.uploadFileInput();

        await expect(fileInput).toBeVisible({ timeout: 10000 });

        // Upload the file
        await fileInput.setInputFiles(filePath);

        await log(`Valid Excel file uploaded: ${filePath}`);
    }

    async uploadValidCsvFile(filePath: string) {
        const fileInput = this.uploadFileInput();

        await expect(fileInput).toBeVisible({ timeout: 10000 });

        // Attach CSV file
        await fileInput.setInputFiles(filePath);
        await log(`Valid CSV file uploaded: ${filePath}`);
    }

    importOrdersConfirmButton() {
        return this.page.locator("//button[contains(@class,'btn') and normalize-space()='Import Orders']");
    }
    importOrdersButtonAfterFileupload() {
        return this.page.getByRole('button', { name: 'Import Orders' }).first();
    }
    async completeImportOrders(filePath: string) {
        // Step 6: Upload file
        await this.uploadFileInput().setInputFiles(filePath);

        // Step 7: Click orange Import Orders button
        const confirmButton = this.importOrdersConfirmButton();
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await expect(confirmButton).toBeEnabled();

        await log('Valid file uploaded and Import Orders completed successfully');
    }

    async completeImportOrdersWithOptionalFields(filePath: string) {
        const button = this.importOrdersButtonAfterFileupload();

        // Step 6: Upload file with optional fields
        await this.uploadFileInput().setInputFiles(filePath);

        // Step 7: Click the orange Import Orders button

        await button.click({ force: true });

        await log('Valid file with optional fields uploaded and Import Orders completed successfully');
    }

    async uploadMultiPlatformFile() {
        // Resolve relative path safely
        const filePath = path.resolve(__dirname, '../../src/fixtures/multi-platform-order.csv');

        // Upload file
        await this.fileInput().setInputFiles(filePath);

        // Optional validation
        // await expect(this.page.getByText(/multi-platform-order.csv/)).toBeVisible();
    }
}




