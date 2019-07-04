/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PCCommentComponentsPage, PCCommentDeleteDialog, PCCommentUpdatePage } from './pc-comment.page-object';

const expect = chai.expect;

describe('PCComment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pCCommentUpdatePage: PCCommentUpdatePage;
  let pCCommentComponentsPage: PCCommentComponentsPage;
  let pCCommentDeleteDialog: PCCommentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PCComments', async () => {
    await navBarPage.goToEntity('pc-comment');
    pCCommentComponentsPage = new PCCommentComponentsPage();
    await browser.wait(ec.visibilityOf(pCCommentComponentsPage.title), 5000);
    expect(await pCCommentComponentsPage.getTitle()).to.eq('PC Comments');
  });

  it('should load create PCComment page', async () => {
    await pCCommentComponentsPage.clickOnCreateButton();
    pCCommentUpdatePage = new PCCommentUpdatePage();
    expect(await pCCommentUpdatePage.getPageTitle()).to.eq('Create or edit a PC Comment');
    await pCCommentUpdatePage.cancel();
  });

  it('should create and save PCComments', async () => {
    const nbButtonsBeforeCreate = await pCCommentComponentsPage.countDeleteButtons();

    await pCCommentComponentsPage.clickOnCreateButton();
    await promise.all([
      pCCommentUpdatePage.setContentInput('content'),
      pCCommentUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      pCCommentUpdatePage.existsInSelectLastOption()
    ]);
    expect(await pCCommentUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    expect(await pCCommentUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    await pCCommentUpdatePage.save();
    expect(await pCCommentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pCCommentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last PCComment', async () => {
    const nbButtonsBeforeDelete = await pCCommentComponentsPage.countDeleteButtons();
    await pCCommentComponentsPage.clickOnLastDeleteButton();

    pCCommentDeleteDialog = new PCCommentDeleteDialog();
    expect(await pCCommentDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this PC Comment?');
    await pCCommentDeleteDialog.clickOnConfirmButton();

    expect(await pCCommentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
