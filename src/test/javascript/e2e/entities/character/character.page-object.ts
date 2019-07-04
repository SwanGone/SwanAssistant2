import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class CharacterComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-character div table .btn-danger'));
  title = element.all(by.css('jhi-character div h2#page-heading span')).first();

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

export class CharacterUpdatePage {
  pageTitle = element(by.id('jhi-character-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  nameInput = element(by.id('field_name'));
  inCirculationInput = element(by.id('field_inCirculation'));
  isMostCurrentInput = element(by.id('field_isMostCurrent'));
  isPlayerCharacterInput = element(by.id('field_isPlayerCharacter'));
  isDiplomatInput = element(by.id('field_isDiplomat'));
  originSelect = element(by.id('field_origin'));
  remarksSelect = element(by.id('field_remarks'));
  createdBySelect = element(by.id('field_createdBy'));
  currentLocationSelect = element(by.id('field_currentLocation'));
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

  getInCirculationInput(timeout?: number) {
    return this.inCirculationInput;
  }
  getIsMostCurrentInput(timeout?: number) {
    return this.isMostCurrentInput;
  }
  getIsPlayerCharacterInput(timeout?: number) {
    return this.isPlayerCharacterInput;
  }
  getIsDiplomatInput(timeout?: number) {
    return this.isDiplomatInput;
  }

  async originSelectLastOption(timeout?: number) {
    await this.originSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async originSelectOption(option) {
    await this.originSelect.sendKeys(option);
  }

  getOriginSelect(): ElementFinder {
    return this.originSelect;
  }

  async getOriginSelectedOption() {
    return await this.originSelect.element(by.css('option:checked')).getText();
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

  async currentLocationSelectLastOption(timeout?: number) {
    await this.currentLocationSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async currentLocationSelectOption(option) {
    await this.currentLocationSelect.sendKeys(option);
  }

  getCurrentLocationSelect(): ElementFinder {
    return this.currentLocationSelect;
  }

  async getCurrentLocationSelectedOption() {
    return await this.currentLocationSelect.element(by.css('option:checked')).getText();
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

export class CharacterDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-character-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-character'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
