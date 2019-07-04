import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class HexMapComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-hex-map div table .btn-danger'));
  title = element.all(by.css('jhi-hex-map div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getText();
  }
}

export class HexMapUpdatePage {
  pageTitle = element(by.id('jhi-hex-map-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  seedInput = element(by.id('field_seed'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setSeedInput(seed) {
    await this.seedInput.sendKeys(seed);
  }

  async getSeedInput() {
    return await this.seedInput.getAttribute('value');
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class HexMapDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-hexMap-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-hexMap'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
