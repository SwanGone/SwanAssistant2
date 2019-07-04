import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class RemarksComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-remarks div table .btn-danger'));
  title = element.all(by.css('jhi-remarks div h2#page-heading span')).first();

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

export class RemarksUpdatePage {
  pageTitle = element(by.id('jhi-remarks-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  titleInput = element(by.id('field_title'));
  gmCommentSelect = element(by.id('field_gmComment'));
  generalInfoSelect = element(by.id('field_generalInfo'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return await this.titleInput.getAttribute('value');
  }

  async gmCommentSelectLastOption(timeout?: number) {
    await this.gmCommentSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async gmCommentSelectOption(option) {
    await this.gmCommentSelect.sendKeys(option);
  }

  getGmCommentSelect(): ElementFinder {
    return this.gmCommentSelect;
  }

  async getGmCommentSelectedOption() {
    return await this.gmCommentSelect.element(by.css('option:checked')).getText();
  }

  async generalInfoSelectLastOption(timeout?: number) {
    await this.generalInfoSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async generalInfoSelectOption(option) {
    await this.generalInfoSelect.sendKeys(option);
  }

  getGeneralInfoSelect(): ElementFinder {
    return this.generalInfoSelect;
  }

  async getGeneralInfoSelectedOption() {
    return await this.generalInfoSelect.element(by.css('option:checked')).getText();
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

export class RemarksDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-remarks-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-remarks'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
