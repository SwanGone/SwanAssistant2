import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class HexSectorComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-hex-sector div table .btn-danger'));
  title = element.all(by.css('jhi-hex-sector div h2#page-heading span')).first();

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

export class HexSectorUpdatePage {
  pageTitle = element(by.id('jhi-hex-sector-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  hexRowInput = element(by.id('field_hexRow'));
  hexColumnInput = element(by.id('field_hexColumn'));
  coordinatesInput = element(by.id('field_coordinates'));
  isMappedInput = element(by.id('field_isMapped'));
  locatedInSelect = element(by.id('field_locatedIn'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setHexRowInput(hexRow) {
    await this.hexRowInput.sendKeys(hexRow);
  }

  async getHexRowInput() {
    return await this.hexRowInput.getAttribute('value');
  }

  async setHexColumnInput(hexColumn) {
    await this.hexColumnInput.sendKeys(hexColumn);
  }

  async getHexColumnInput() {
    return await this.hexColumnInput.getAttribute('value');
  }

  async setCoordinatesInput(coordinates) {
    await this.coordinatesInput.sendKeys(coordinates);
  }

  async getCoordinatesInput() {
    return await this.coordinatesInput.getAttribute('value');
  }

  getIsMappedInput(timeout?: number) {
    return this.isMappedInput;
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

export class HexSectorDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-hexSector-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-hexSector'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
