/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AdjectiveComponentsPage, AdjectiveDeleteDialog, AdjectiveUpdatePage } from './adjective.page-object';

const expect = chai.expect;

describe('Adjective e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let adjectiveUpdatePage: AdjectiveUpdatePage;
  let adjectiveComponentsPage: AdjectiveComponentsPage;
  let adjectiveDeleteDialog: AdjectiveDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Adjectives', async () => {
    await navBarPage.goToEntity('adjective');
    adjectiveComponentsPage = new AdjectiveComponentsPage();
    await browser.wait(ec.visibilityOf(adjectiveComponentsPage.title), 5000);
    expect(await adjectiveComponentsPage.getTitle()).to.eq('Adjectives');
  });

  it('should load create Adjective page', async () => {
    await adjectiveComponentsPage.clickOnCreateButton();
    adjectiveUpdatePage = new AdjectiveUpdatePage();
    expect(await adjectiveUpdatePage.getPageTitle()).to.eq('Create or edit a Adjective');
    await adjectiveUpdatePage.cancel();
  });

  it('should create and save Adjectives', async () => {
    const nbButtonsBeforeCreate = await adjectiveComponentsPage.countDeleteButtons();

    await adjectiveComponentsPage.clickOnCreateButton();
    await promise.all([
      adjectiveUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      adjectiveUpdatePage.setContentInput('content'),
      adjectiveUpdatePage.createdBySelectLastOption()
      // adjectiveUpdatePage.viewableBySelectLastOption(),
    ]);
    expect(await adjectiveUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    expect(await adjectiveUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    const selectedInCirculation = adjectiveUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await adjectiveUpdatePage.getInCirculationInput().click();
      expect(await adjectiveUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await adjectiveUpdatePage.getInCirculationInput().click();
      expect(await adjectiveUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    await adjectiveUpdatePage.save();
    expect(await adjectiveUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await adjectiveComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Adjective', async () => {
    const nbButtonsBeforeDelete = await adjectiveComponentsPage.countDeleteButtons();
    await adjectiveComponentsPage.clickOnLastDeleteButton();

    adjectiveDeleteDialog = new AdjectiveDeleteDialog();
    expect(await adjectiveDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Adjective?');
    await adjectiveDeleteDialog.clickOnConfirmButton();

    expect(await adjectiveComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
