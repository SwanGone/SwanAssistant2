/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PCCommentThreadComponentsPage, PCCommentThreadDeleteDialog, PCCommentThreadUpdatePage } from './pc-comment-thread.page-object';

const expect = chai.expect;

describe('PCCommentThread e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pCCommentThreadUpdatePage: PCCommentThreadUpdatePage;
  let pCCommentThreadComponentsPage: PCCommentThreadComponentsPage;
  let pCCommentThreadDeleteDialog: PCCommentThreadDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PCCommentThreads', async () => {
    await navBarPage.goToEntity('pc-comment-thread');
    pCCommentThreadComponentsPage = new PCCommentThreadComponentsPage();
    await browser.wait(ec.visibilityOf(pCCommentThreadComponentsPage.title), 5000);
    expect(await pCCommentThreadComponentsPage.getTitle()).to.eq('PC Comment Threads');
  });

  it('should load create PCCommentThread page', async () => {
    await pCCommentThreadComponentsPage.clickOnCreateButton();
    pCCommentThreadUpdatePage = new PCCommentThreadUpdatePage();
    expect(await pCCommentThreadUpdatePage.getPageTitle()).to.eq('Create or edit a PC Comment Thread');
    await pCCommentThreadUpdatePage.cancel();
  });

  it('should create and save PCCommentThreads', async () => {
    const nbButtonsBeforeCreate = await pCCommentThreadComponentsPage.countDeleteButtons();

    await pCCommentThreadComponentsPage.clickOnCreateButton();
    await promise.all([
      pCCommentThreadUpdatePage.setHeadlineInput('headline'),
      pCCommentThreadUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      pCCommentThreadUpdatePage.existsInSelectLastOption()
    ]);
    expect(await pCCommentThreadUpdatePage.getHeadlineInput()).to.eq('headline', 'Expected Headline value to be equals to headline');
    expect(await pCCommentThreadUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    await pCCommentThreadUpdatePage.save();
    expect(await pCCommentThreadUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await pCCommentThreadComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last PCCommentThread', async () => {
    const nbButtonsBeforeDelete = await pCCommentThreadComponentsPage.countDeleteButtons();
    await pCCommentThreadComponentsPage.clickOnLastDeleteButton();

    pCCommentThreadDeleteDialog = new PCCommentThreadDeleteDialog();
    expect(await pCCommentThreadDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this PC Comment Thread?');
    await pCCommentThreadDeleteDialog.clickOnConfirmButton();

    expect(await pCCommentThreadComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
