/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { GeneralInfoComponentsPage, GeneralInfoDeleteDialog, GeneralInfoUpdatePage } from './general-info.page-object';

const expect = chai.expect;

describe('GeneralInfo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let generalInfoUpdatePage: GeneralInfoUpdatePage;
  let generalInfoComponentsPage: GeneralInfoComponentsPage;
  let generalInfoDeleteDialog: GeneralInfoDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load GeneralInfos', async () => {
    await navBarPage.goToEntity('general-info');
    generalInfoComponentsPage = new GeneralInfoComponentsPage();
    await browser.wait(ec.visibilityOf(generalInfoComponentsPage.title), 5000);
    expect(await generalInfoComponentsPage.getTitle()).to.eq('General Infos');
  });

  it('should load create GeneralInfo page', async () => {
    await generalInfoComponentsPage.clickOnCreateButton();
    generalInfoUpdatePage = new GeneralInfoUpdatePage();
    expect(await generalInfoUpdatePage.getPageTitle()).to.eq('Create or edit a General Info');
    await generalInfoUpdatePage.cancel();
  });

  it('should create and save GeneralInfos', async () => {
    const nbButtonsBeforeCreate = await generalInfoComponentsPage.countDeleteButtons();

    await generalInfoComponentsPage.clickOnCreateButton();
    await promise.all([
      generalInfoUpdatePage.setContentInput('content'),
      generalInfoUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);
    expect(await generalInfoUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    expect(await generalInfoUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    await generalInfoUpdatePage.save();
    expect(await generalInfoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await generalInfoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last GeneralInfo', async () => {
    const nbButtonsBeforeDelete = await generalInfoComponentsPage.countDeleteButtons();
    await generalInfoComponentsPage.clickOnLastDeleteButton();

    generalInfoDeleteDialog = new GeneralInfoDeleteDialog();
    expect(await generalInfoDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this General Info?');
    await generalInfoDeleteDialog.clickOnConfirmButton();

    expect(await generalInfoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
