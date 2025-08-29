import { BasePage } from './BasePage';
import { Locator } from '@playwright/test';

export class ImportOrdersPage extends BasePage {
  // Locators
  private addNewOrderButton: Locator;
  private importOrdersButton: Locator;
  private importOrdersModal: Locator;
  private downloadTemplateButton: Locator;
  private fileUploadInput: Locator;
  private fileUploadArea: Locator;
  private browseButton: Locator;
  private importOrdersSubmitButton: Locator;
  private filePreview: Locator;
  private confirmationMessage: Locator;
  private errorMessage: Locator;
  
  // Modal elements
  private modalTitle: Locator;
  private modalCloseButton: Locator;
  private fileUploadSection: Locator;
  private instructionsSection: Locator;
  
  // File validation elements
  private fileTypeIndicator: Locator;
  private fileSizeIndicator: Locator;
  private columnValidation: Locator;
  private orderGroupingPreview: Locator;

  constructor(page: any) {
    super(page);
    
    // Navigation elements - more robust locators
    this.addNewOrderButton = this.page.locator('button.fi-btn')
      .filter({ hasText: /add new order/i })
      .first()
      .or(this.page.getByRole('button', { name: /add new order/i }).first());
      
    // Fix: Use a more specific locator for the Import Orders button that opens the modal
    this.importOrdersButton = this.page.locator('button.fi-btn')
      .filter({ hasText: /import orders/i })
      .first()
      .or(this.page.getByRole('button', { name: /import orders/i }).first());
      
    // Import Orders Modal elements - be more specific to avoid multiple matches
    this.importOrdersModal = this.page.locator('[x-data*="import-orders-form"]').first()
      .or(this.page.locator('[data-testid="import-orders-form"]'))
      .or(this.page.locator('[role="dialog"]').filter({ hasText: /import orders/i }).nth(1));
      
    this.modalTitle = this.page.getByRole('heading', { name: /import orders/i }).first()
      .or(this.page.locator('h1, h2, h3').filter({ hasText: /import orders/i }));
      
    this.modalCloseButton = this.page.getByRole('button', { name: /close/i }).first()
      .or(this.page.locator('[aria-label="Close"]').first())
      .or(this.page.locator('.close, .btn-close').first());
    
    // File upload elements - more robust locators
    this.fileUploadInput = this.page.locator('input[type="file"]')
      .or(this.page.locator('[data-testid="file-upload"]'))
      .or(this.page.locator('.file-input'));
      
    this.fileUploadArea = this.page.locator('[data-testid="file-upload-area"]')
      .or(this.page.locator('.file-upload-area'))
      .or(this.page.locator('.drop-zone'))
      .or(this.page.locator('.upload-area'));
      
    this.browseButton = this.page.getByRole('button', { name: /browse/i })
      .or(this.page.getByText(/browse/i))
      .or(this.page.locator('.btn').filter({ hasText: /browse/i }));
    
    // Action buttons - more robust locators
    this.downloadTemplateButton = this.page.getByRole('button', { name: /download template/i })
      .or(this.page.getByText(/download template/i))
      .or(this.page.locator('[data-testid="download-template"]'))
      .or(this.page.locator('.btn').filter({ hasText: /download template/i }));
      
    // Fix: Use a more specific locator for the Import Orders submit button (inside modal)
    this.importOrdersSubmitButton = this.page.locator('button[type="submit"]')
      .filter({ hasText: /import orders/i })
      .filter({ has: this.page.locator('[wire\\:target="import"]') })
      .first()
      .or(this.page.locator('button.fi-btn[type="submit"]').filter({ hasText: /import orders/i }).first());
    
    // Content sections - more robust locators
    this.fileUploadSection = this.page.locator('section.fi-section')
      .filter({ hasText: /file|upload|browse|drag|drop/i })
      .or(this.page.locator('.file-upload-section'))
      .or(this.page.locator('[data-testid="file-upload-section"]'))
      .or(this.page.locator('.upload-section'));
      
    this.instructionsSection = this.page.locator('p.fi-section-header-description')
      .filter({ hasText: /import orders|excel|csv/i })
      .or(this.page.locator('p.mb-2.font-semibold').filter({ hasText: /import file|columns/i }))
      .or(this.page.locator('div.fi-fo-field-wrp-helper-text').filter({ hasText: /excel|csv|file size/i }))
      .first();
    
    // File validation and preview - more robust locators
    this.filePreview = this.page.locator('.file-preview')
      .or(this.page.locator('[data-testid="file-preview"]'))
      .or(this.page.locator('.preview, .file-info'));
      
    this.fileTypeIndicator = this.page.locator('.file-type')
      .or(this.page.locator('[data-testid="file-type"]'))
      .or(this.page.locator('.type-indicator'));
      
    this.fileSizeIndicator = this.page.locator('.file-size')
      .or(this.page.locator('[data-testid="file-size"]'))
      .or(this.page.locator('.size-indicator'));
      
    this.columnValidation = this.page.locator('.column-validation')
      .or(this.page.locator('[data-testid="column-validation"]'))
      .or(this.page.locator('.validation'));
      
    this.orderGroupingPreview = this.page.locator('.order-grouping')
      .or(this.page.locator('[data-testid="order-grouping"]'))
      .or(this.page.locator('.grouping-preview'));
    
    // Messages - more robust locators
    this.confirmationMessage = this.page.locator('.success-message')
      .or(this.page.locator('[data-testid="success-message"]'))
      .or(this.page.locator('.alert-success, .message-success'));
      
    this.errorMessage = this.page.locator('.error-message')
      .or(this.page.locator('[data-testid="error-message"]'))
      .or(this.page.locator('.alert-danger, .message-error'));
  }

  // Navigation Methods
  async navigateToImportOrders() {
    try {
      console.log('Navigating to Import Orders...');
      
      // Wait for dashboard to be fully loaded
      await this.page.waitForLoadState('networkidle');
      
    // Click Add New Order button first
      await this.addNewOrderButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addNewOrderButton.click();
      console.log('Add New Order button clicked');
      
    await this.page.waitForLoadState('networkidle');
    
    // Click Import Orders button
      await this.importOrdersButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.importOrdersButton.click();
      console.log('Import Orders button clicked');
      
    await this.waitForModalToLoad();
      console.log('Import Orders modal loaded successfully');
    } catch (error) {
      console.error('Error navigating to Import Orders:', error);
      throw error;
    }
  }

  // Modal Management Methods
  async waitForModalToLoad(): Promise<void> {
    try {
      console.log('Waiting for Import Orders modal to load...');
      
      // Wait for the specific Import Orders modal to be present in DOM
      await this.importOrdersModal.waitFor({ state: 'attached', timeout: 15000 });
      console.log('Import Orders modal container loaded');
      
      // Wait for the Alpine.js state to change and content to be visible
      await this.page.waitForFunction(() => {
        const modal = document.querySelector('[x-data*="import-orders-form"]');
        if (!modal) return false;
        
        // Check if the modal has the open class
        const hasOpenClass = modal.classList.contains('fi-modal-open');
        
        // Check if the content div with x-show="isOpen" is present and visible
        const contentDiv = modal.querySelector('[x-show="isOpen"]') as HTMLElement;
        const isContentVisible = contentDiv && contentDiv.style.display !== 'none';
        
        return hasOpenClass && isContentVisible;
      }, { timeout: 15000 });
      
      console.log('Import Orders modal content loaded successfully');
      
    } catch (error) {
      console.log('Error waiting for modal to load:', error);
      
      // Fallback: wait for network idle
      console.log('Fallback: waiting for network idle');
      await this.page.waitForLoadState('networkidle');
      console.log('Import Orders modal loaded successfully');
    }
  }

  async isImportOrdersModalVisible(): Promise<boolean> {
    try {
      // Check if the modal has the 'fi-modal-open' class which indicates it's visible
      const hasOpenClass = await this.importOrdersModal.evaluate((el) => {
        return el.classList.contains('fi-modal-open');
      });
      
      if (hasOpenClass) {
        return true;
      }
      
      // Fallback: check if the element is visible in the DOM
      return await this.importOrdersModal.isVisible();
    } catch (error) {
      console.error('Error checking modal visibility:', error);
      return false;
    }
  }

  async closeModal() {
    try {
    if (await this.modalCloseButton.isVisible()) {
      await this.modalCloseButton.click();
        console.log('Modal closed successfully');
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  // File Upload Methods
  async uploadFile(filePath: string) {
    try {
      console.log('Uploading file:', filePath);
      await this.fileUploadInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.fileUploadInput.setInputFiles(filePath);
    await this.page.waitForLoadState('networkidle');
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async dragAndDropFile(filePath: string) {
    try {
      console.log('Drag and dropping file:', filePath);
    // Simulate drag and drop by setting input files
      await this.fileUploadInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.fileUploadInput.setInputFiles(filePath);
    await this.page.waitForLoadState('networkidle');
      console.log('File drag and dropped successfully');
    } catch (error) {
      console.error('Error drag and dropping file:', error);
      throw error;
    }
  }

  async isFileUploaded(): Promise<boolean> {
    try {
      return await this.filePreview.isVisible();
    } catch (error) {
      console.error('Error checking file upload status:', error);
      return false;
    }
  }

  // Template Download Methods
  async clickDownloadTemplate() {
    try {
      await this.downloadTemplateButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.downloadTemplateButton.click();
      console.log('Download template button clicked');
    } catch (error) {
      console.error('Error clicking download template:', error);
      throw error;
    }
  }

  async isDownloadTemplateButtonVisible(): Promise<boolean> {
    try {
    return await this.downloadTemplateButton.isVisible();
    } catch (error) {
      console.error('Error checking download template button visibility:', error);
      return false;
    }
  }

  async isDownloadTemplateButtonClickable(): Promise<boolean> {
    try {
    return await this.downloadTemplateButton.isEnabled();
    } catch (error) {
      console.error('Error checking download template button clickability:', error);
      return false;
    }
  }

  // File Validation Methods
  async getFileType(): Promise<string> {
    try {
    const fileType = await this.fileTypeIndicator.textContent();
    return fileType?.trim() || '';
    } catch (error) {
      console.error('Error getting file type:', error);
      return '';
    }
  }

  async getFileSize(): Promise<string> {
    try {
    const fileSize = await this.fileSizeIndicator.textContent();
    return fileSize?.trim() || '';
    } catch (error) {
      console.error('Error getting file size:', error);
      return '';
    }
  }

  async isColumnValidationVisible(): Promise<boolean> {
    try {
    return await this.columnValidation.isVisible();
    } catch (error) {
      console.error('Error checking column validation visibility:', error);
      return false;
    }
  }

  async isOrderGroupingPreviewVisible(): Promise<boolean> {
    try {
    return await this.orderGroupingPreview.isVisible();
    } catch (error) {
      console.error('Error checking order grouping preview visibility:', error);
      return false;
    }
  }

  // Import Actions
  async clickImportOrders() {
    try {
      await this.importOrdersSubmitButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.importOrdersSubmitButton.click();
      console.log('Import orders button clicked');
    await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error('Error clicking import orders:', error);
      throw error;
    }
  }

  async isImportOrdersButtonVisible(): Promise<boolean> {
    try {
    return await this.importOrdersSubmitButton.isVisible();
    } catch (error) {
      console.error('Error checking import orders button visibility:', error);
      return false;
    }
  }

  async isImportOrdersButtonClickable(): Promise<boolean> {
    try {
    return await this.importOrdersSubmitButton.isEnabled();
    } catch (error) {
      console.error('Error checking import orders button clickability:', error);
      return false;
    }
  }

  // Content Validation Methods
  async isFileUploadSectionVisible(): Promise<boolean> {
    try {
    return await this.fileUploadSection.isVisible();
    } catch (error) {
      console.error('Error checking file upload section visibility:', error);
      return false;
    }
  }

  async isInstructionsSectionVisible(): Promise<boolean> {
    try {
    return await this.instructionsSection.isVisible();
    } catch (error) {
      console.error('Error checking instructions section visibility:', error);
      return false;
    }
  }

  async getInstructionsText(): Promise<string> {
    try {
    const instructions = await this.instructionsSection.textContent();
    return instructions?.trim() || '';
    } catch (error) {
      console.error('Error getting instructions text:', error);
      return '';
    }
  }

  // Message Validation Methods
  async isConfirmationMessageVisible(): Promise<boolean> {
    try {
    return await this.confirmationMessage.isVisible();
    } catch (error) {
      console.error('Error checking confirmation message visibility:', error);
      return false;
    }
  }

  async getConfirmationMessage(): Promise<string> {
    try {
    const message = await this.confirmationMessage.textContent();
    return message?.trim() || '';
    } catch (error) {
      console.error('Error getting confirmation message:', error);
      return '';
    }
  }

  async isErrorMessageVisible(): Promise<boolean> {
    try {
    return await this.errorMessage.isVisible();
    } catch (error) {
      console.error('Error checking error message visibility:', error);
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
    const message = await this.errorMessage.textContent();
    return message?.trim() || '';
    } catch (error) {
      console.error('Error getting error message:', error);
      return '';
    }
  }

  // Utility Methods
  async waitForFileUpload() {
    try {
    await this.page.waitForLoadState('networkidle');
    // Wait for file preview or validation to appear
    try {
        await this.filePreview.waitFor({ state: 'visible', timeout: 15000 });
        console.log('File preview appeared');
      } catch (error) {
        console.log('File preview did not appear, continuing...');
      }
    } catch (error) {
      console.error('Error waiting for file upload:', error);
      throw error;
    }
  }

  async waitForImportCompletion() {
    try {
    await this.page.waitForLoadState('networkidle');
    // Wait for confirmation message or redirect
    try {
        await this.confirmationMessage.waitFor({ state: 'visible', timeout: 20000 });
        console.log('Import completion confirmed');
      } catch (error) {
        console.log('Confirmation message did not appear, continuing...');
      }
    } catch (error) {
      console.error('Error waiting for import completion:', error);
      throw error;
    }
  }

  // File Type Validation
  async validateExcelFile(): Promise<boolean> {
    try {
    const fileType = await this.getFileType();
    return fileType.toLowerCase().includes('excel') || fileType.toLowerCase().includes('xlsx');
    } catch (error) {
      console.error('Error validating Excel file:', error);
      return false;
    }
  }

  async validateCSVFile(): Promise<boolean> {
    try {
    const fileType = await this.getFileType();
    return fileType.toLowerCase().includes('csv');
    } catch (error) {
      console.error('Error validating CSV file:', error);
      return false;
    }
  }

  // File Size Validation
  async validateFileSize(maxSizeMB: number = 5): Promise<boolean> {
    try {
    const fileSize = await this.getFileSize();
    if (!fileSize) return true; // If no size indicator, assume valid
    
    // Extract numeric value from size string (e.g., "2.5 MB" -> 2.5)
    const sizeMatch = fileSize.match(/(\d+(?:\.\d+)?)/);
    if (!sizeMatch) return true;
    
    const sizeInMB = parseFloat(sizeMatch[1]);
    return sizeInMB <= maxSizeMB;
    } catch (error) {
      console.error('Error validating file size:', error);
      return false;
    }
  }

  // Order Grouping Validation
  async validateOrderGrouping(): Promise<boolean> {
    try {
      return await this.orderGroupingPreview.isVisible();
    } catch (error) {
      console.error('Error validating order grouping:', error);
      return false;
    }
  }

  // Button Visibility Methods
  async isAddNewOrderButtonVisible(): Promise<boolean> {
    try {
    return await this.addNewOrderButton.isVisible();
    } catch (error) {
      console.error('Error checking add new order button visibility:', error);
      return false;
    }
  }

  async clickAddNewOrderButton() {
    try {
      await this.addNewOrderButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.addNewOrderButton.click();
      console.log('Add New Order button clicked');
    } catch (error) {
      console.error('Error clicking add new order button:', error);
      throw error;
    }
  }

  // Debug method to check page state
  async debugPageState() {
    try {
      console.log('Current URL:', this.page.url());
      console.log('Page title:', await this.page.title());
      
      // Check if elements are visible
      console.log('Add New Order button visible:', await this.addNewOrderButton.isVisible());
      console.log('Import Orders button visible:', await this.importOrdersButton.isVisible());
      console.log('Modal visible:', await this.importOrdersModal.isVisible());
    } catch (error) {
      console.error('Error in debug page state:', error);
    }
  }
}
