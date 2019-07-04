import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class PCCommentThreadComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-pc-comment-thread div table .btn-danger'));
  title = element.all(by.css('jhi-pc-comment-thread div h2#page-heading span')).first();

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

export class PCCommentThreadUpdatePage {
  pageTitle = element(by.id('jhi-pc-comment-thread-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  headlineInput = element(by.id('field_headline'));
  dateAddedInput = element(by.id('field_dateAdded'));
  existsInSelect = element(by.id('field_existsIn'));

  async getPageTitle() {
    return this.pageTitle.getText();
  }

  async setHeadlineInput(headline) {
    await this.headlineInput.sendKeys(headline);
  }

  async getHeadlineInput() {
    return await this.headlineInput.getAttribute('value');
  }

  async setDateAddedInput(dateAdded) {
    await this.dateAddedInput.sendKeys(dateAdded);
  }

  async getDateAddedInput() {
    return await this.dateAddedInput.getAttribute('value');
  }

  async existsInSelectLastOption(timeout?: number) {
    await this.existsInSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async existsInSelectOption(option) {
    await this.existsInSelect.sendKeys(option);
  }

  getExistsInSelect(): ElementFinder {
    return this.existsInSelect;
  }

  async getExistsInSelectedOption() {
    return await this.existsInSelect.element(by.css('option:checked')).getText();
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

export class PCCommentThreadDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-pCCommentThread-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-pCCommentThread'));

  async getDialogTitle() {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
