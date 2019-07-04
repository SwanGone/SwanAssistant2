import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class AdjectiveComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-adjective div table .btn-danger'));
  title = element.all(by.css('jhi-adjective div h2#page-heading span')).first();

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

export class AdjectiveUpdatePage {
  pageTitle = element(by.id('jhi-adjective-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  dateAddedInput = element(by.id('field_dateAdded'));
  contentInput = element(by.id('field_content'));
  inCirculationInput = element(by.id('field_inCirculation'));
  createdBySelect = element(by.id('field_createdBy'));
  viewableBySelect = element(by.id('field_viewableBy'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setDateAddedInput(dateAdded) {
    await this.dateAddedInput.sendKeys(dateAdded);
  }

  async getDateAddedInput() {
    return await this.dateAddedInput.getAttribute('value');
  }

  async setContentInput(content) {
    await this.contentInput.sendKeys(content);
  }

  async getContentInput() {
    return await this.contentInput.getAttribute('value');
  }

  getInCirculationInput(timeout?: number) {
    return this.inCirculationInput;
  }

  async createdBySelectLastOption(timeout?: number) {
    await this.createdBySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async createdBySelectOption(option) {
    await this.createdBySelect.sendKeys(option);
  }

  getCreatedBySelect(): ElementFinder {
    return this.createdBySelect;
  }

  async getCreatedBySelectedOption() {
    return await this.createdBySelect.element(by.css('option:checked')).getText();
  }

  async viewableBySelectLastOption(timeout?: number) {
    await this.viewableBySelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async viewableBySelectOption(option) {
    await this.viewableBySelect.sendKeys(option);
  }

  getViewableBySelect(): ElementFinder {
    return this.viewableBySelect;
  }

  async getViewableBySelectedOption() {
    return await this.viewableBySelect.element(by.css('option:checked')).getText();
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

export class AdjectiveDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-adjective-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-adjective'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
