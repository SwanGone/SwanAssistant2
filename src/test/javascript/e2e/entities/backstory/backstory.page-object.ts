import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class BackstoryComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-backstory div table .btn-danger'));
  title = element.all(by.css('jhi-backstory div h2#page-heading span')).first();

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

export class BackstoryUpdatePage {
  pageTitle = element(by.id('jhi-backstory-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  textInput = element(by.id('field_text'));
  adjectiveSelect = element(by.id('field_adjective'));
  speciesSelect = element(by.id('field_species'));
  occupationSelect = element(by.id('field_occupation'));
  homeworldSelect = element(by.id('field_homeworld'));
  originDetailsSelect = element(by.id('field_originDetails'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setTextInput(text) {
    await this.textInput.sendKeys(text);
  }

  async getTextInput() {
    return await this.textInput.getAttribute('value');
  }

  async adjectiveSelectLastOption(timeout?: number) {
    await this.adjectiveSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async adjectiveSelectOption(option) {
    await this.adjectiveSelect.sendKeys(option);
  }

  getAdjectiveSelect(): ElementFinder {
    return this.adjectiveSelect;
  }

  async getAdjectiveSelectedOption() {
    return await this.adjectiveSelect.element(by.css('option:checked')).getText();
  }

  async speciesSelectLastOption(timeout?: number) {
    await this.speciesSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async speciesSelectOption(option) {
    await this.speciesSelect.sendKeys(option);
  }

  getSpeciesSelect(): ElementFinder {
    return this.speciesSelect;
  }

  async getSpeciesSelectedOption() {
    return await this.speciesSelect.element(by.css('option:checked')).getText();
  }

  async occupationSelectLastOption(timeout?: number) {
    await this.occupationSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async occupationSelectOption(option) {
    await this.occupationSelect.sendKeys(option);
  }

  getOccupationSelect(): ElementFinder {
    return this.occupationSelect;
  }

  async getOccupationSelectedOption() {
    return await this.occupationSelect.element(by.css('option:checked')).getText();
  }

  async homeworldSelectLastOption(timeout?: number) {
    await this.homeworldSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async homeworldSelectOption(option) {
    await this.homeworldSelect.sendKeys(option);
  }

  getHomeworldSelect(): ElementFinder {
    return this.homeworldSelect;
  }

  async getHomeworldSelectedOption() {
    return await this.homeworldSelect.element(by.css('option:checked')).getText();
  }

  async originDetailsSelectLastOption(timeout?: number) {
    await this.originDetailsSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async originDetailsSelectOption(option) {
    await this.originDetailsSelect.sendKeys(option);
  }

  getOriginDetailsSelect(): ElementFinder {
    return this.originDetailsSelect;
  }

  async getOriginDetailsSelectedOption() {
    return await this.originDetailsSelect.element(by.css('option:checked')).getText();
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

export class BackstoryDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-backstory-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-backstory'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
