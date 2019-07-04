/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { GMCommentComponentsPage, GMCommentDeleteDialog, GMCommentUpdatePage } from './gm-comment.page-object';

const expect = chai.expect;

describe('GMComment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let gMCommentUpdatePage: GMCommentUpdatePage;
  let gMCommentComponentsPage: GMCommentComponentsPage;
  let gMCommentDeleteDialog: GMCommentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load GMComments', async () => {
    await navBarPage.goToEntity('gm-comment');
    gMCommentComponentsPage = new GMCommentComponentsPage();
    await browser.wait(ec.visibilityOf(gMCommentComponentsPage.title), 5000);
    expect(await gMCommentComponentsPage.getTitle()).to.eq('GM Comments');
  });

  it('should load create GMComment page', async () => {
    await gMCommentComponentsPage.clickOnCreateButton();
    gMCommentUpdatePage = new GMCommentUpdatePage();
    expect(await gMCommentUpdatePage.getPageTitle()).to.eq('Create or edit a GM Comment');
    await gMCommentUpdatePage.cancel();
  });

  it('should create and save GMComments', async () => {
    const nbButtonsBeforeCreate = await gMCommentComponentsPage.countDeleteButtons();

    await gMCommentComponentsPage.clickOnCreateButton();
    await promise.all([
      gMCommentUpdatePage.setContentInput('content'),
      gMCommentUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);
    expect(await gMCommentUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    expect(await gMCommentUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    await gMCommentUpdatePage.save();
    expect(await gMCommentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await gMCommentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last GMComment', async () => {
    const nbButtonsBeforeDelete = await gMCommentComponentsPage.countDeleteButtons();
    await gMCommentComponentsPage.clickOnLastDeleteButton();

    gMCommentDeleteDialog = new GMCommentDeleteDialog();
    expect(await gMCommentDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this GM Comment?');
    await gMCommentDeleteDialog.clickOnConfirmButton();

    expect(await gMCommentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
