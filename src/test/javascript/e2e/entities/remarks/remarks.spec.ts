/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RemarksComponentsPage, RemarksDeleteDialog, RemarksUpdatePage } from './remarks.page-object';

const expect = chai.expect;

describe('Remarks e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let remarksUpdatePage: RemarksUpdatePage;
  let remarksComponentsPage: RemarksComponentsPage;
  let remarksDeleteDialog: RemarksDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Remarks', async () => {
    await navBarPage.goToEntity('remarks');
    remarksComponentsPage = new RemarksComponentsPage();
    await browser.wait(ec.visibilityOf(remarksComponentsPage.title), 5000);
    expect(await remarksComponentsPage.getTitle()).to.eq('Remarks');
  });

  it('should load create Remarks page', async () => {
    await remarksComponentsPage.clickOnCreateButton();
    remarksUpdatePage = new RemarksUpdatePage();
    expect(await remarksUpdatePage.getPageTitle()).to.eq('Create or edit a Remarks');
    await remarksUpdatePage.cancel();
  });

  it('should create and save Remarks', async () => {
    const nbButtonsBeforeCreate = await remarksComponentsPage.countDeleteButtons();

    await remarksComponentsPage.clickOnCreateButton();
    await promise.all([
      remarksUpdatePage.setTitleInput('title'),
      remarksUpdatePage.gmCommentSelectLastOption(),
      remarksUpdatePage.generalInfoSelectLastOption()
    ]);
    expect(await remarksUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    await remarksUpdatePage.save();
    expect(await remarksUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await remarksComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Remarks', async () => {
    const nbButtonsBeforeDelete = await remarksComponentsPage.countDeleteButtons();
    await remarksComponentsPage.clickOnLastDeleteButton();

    remarksDeleteDialog = new RemarksDeleteDialog();
    expect(await remarksDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Remarks?');
    await remarksDeleteDialog.clickOnConfirmButton();

    expect(await remarksComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
