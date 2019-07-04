/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BackstoryComponentsPage, BackstoryDeleteDialog, BackstoryUpdatePage } from './backstory.page-object';

const expect = chai.expect;

describe('Backstory e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let backstoryUpdatePage: BackstoryUpdatePage;
  let backstoryComponentsPage: BackstoryComponentsPage;
  let backstoryDeleteDialog: BackstoryDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Backstories', async () => {
    await navBarPage.goToEntity('backstory');
    backstoryComponentsPage = new BackstoryComponentsPage();
    await browser.wait(ec.visibilityOf(backstoryComponentsPage.title), 5000);
    expect(await backstoryComponentsPage.getTitle()).to.eq('Backstories');
  });

  it('should load create Backstory page', async () => {
    await backstoryComponentsPage.clickOnCreateButton();
    backstoryUpdatePage = new BackstoryUpdatePage();
    expect(await backstoryUpdatePage.getPageTitle()).to.eq('Create or edit a Backstory');
    await backstoryUpdatePage.cancel();
  });

  it('should create and save Backstories', async () => {
    const nbButtonsBeforeCreate = await backstoryComponentsPage.countDeleteButtons();

    await backstoryComponentsPage.clickOnCreateButton();
    await promise.all([
      backstoryUpdatePage.setTextInput('text'),
      backstoryUpdatePage.adjectiveSelectLastOption(),
      backstoryUpdatePage.speciesSelectLastOption(),
      backstoryUpdatePage.occupationSelectLastOption(),
      backstoryUpdatePage.homeworldSelectLastOption(),
      backstoryUpdatePage.originDetailsSelectLastOption()
    ]);
    expect(await backstoryUpdatePage.getTextInput()).to.eq('text', 'Expected Text value to be equals to text');
    await backstoryUpdatePage.save();
    expect(await backstoryUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await backstoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Backstory', async () => {
    const nbButtonsBeforeDelete = await backstoryComponentsPage.countDeleteButtons();
    await backstoryComponentsPage.clickOnLastDeleteButton();

    backstoryDeleteDialog = new BackstoryDeleteDialog();
    expect(await backstoryDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Backstory?');
    await backstoryDeleteDialog.clickOnConfirmButton();

    expect(await backstoryComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
