import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class PlaceOfInterestComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-place-of-interest div table .btn-danger'));
  title = element.all(by.css('jhi-place-of-interest div h2#page-heading span')).first();

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

export class PlaceOfInterestUpdatePage {
  pageTitle = element(by.id('jhi-place-of-interest-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  nameInput = element(by.id('field_name'));
  inCirculationInput = element(by.id('field_inCirculation'));
  remarksSelect = element(by.id('field_remarks'));
  locatedOnSelect = element(by.id('field_locatedOn'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return await this.nameInput.getAttribute('value');
  }

  getInCirculationInput(timeout?: number) {
    return this.inCirculationInput;
  }

  async remarksSelectLastOption(timeout?: number) {
    await this.remarksSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async remarksSelectOption(option) {
    await this.remarksSelect.sendKeys(option);
  }

  getRemarksSelect(): ElementFinder {
    return this.remarksSelect;
  }

  async getRemarksSelectedOption() {
    return await this.remarksSelect.element(by.css('option:checked')).getText();
  }

  async locatedOnSelectLastOption(timeout?: number) {
    await this.locatedOnSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async locatedOnSelectOption(option) {
    await this.locatedOnSelect.sendKeys(option);
  }

  getLocatedOnSelect(): ElementFinder {
    return this.locatedOnSelect;
  }

  async getLocatedOnSelectedOption() {
    return await this.locatedOnSelect.element(by.css('option:checked')).getText();
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

export class PlaceOfInterestDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-placeOfInterest-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-placeOfInterest'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
