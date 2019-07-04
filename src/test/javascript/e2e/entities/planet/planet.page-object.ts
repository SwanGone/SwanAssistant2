import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class PlanetComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-planet div table .btn-danger'));
  title = element.all(by.css('jhi-planet div h2#page-heading span')).first();

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

export class PlanetUpdatePage {
  pageTitle = element(by.id('jhi-planet-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  nameInput = element(by.id('field_name'));
  dateAddedInput = element(by.id('field_dateAdded'));
  hasUnobtainiumInput = element(by.id('field_hasUnobtainium'));
  inCirculationInput = element(by.id('field_inCirculation'));
  remarksSelect = element(by.id('field_remarks'));
  createdBySelect = element(by.id('field_createdBy'));
  locatedInSelect = element(by.id('field_locatedIn'));
  viewableBySelect = element(by.id('field_viewableBy'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return await this.nameInput.getAttribute('value');
  }

  async setDateAddedInput(dateAdded) {
    await this.dateAddedInput.sendKeys(dateAdded);
  }

  async getDateAddedInput() {
    return await this.dateAddedInput.getAttribute('value');
  }

  getHasUnobtainiumInput(timeout?: number) {
    return this.hasUnobtainiumInput;
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

  async locatedInSelectLastOption(timeout?: number) {
    await this.locatedInSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async locatedInSelectOption(option) {
    await this.locatedInSelect.sendKeys(option);
  }

  getLocatedInSelect(): ElementFinder {
    return this.locatedInSelect;
  }

  async getLocatedInSelectedOption() {
    return await this.locatedInSelect.element(by.css('option:checked')).getText();
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

export class PlanetDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-planet-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-planet'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
