/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PlaceOfInterestComponentsPage, PlaceOfInterestDeleteDialog, PlaceOfInterestUpdatePage } from './place-of-interest.page-object';

const expect = chai.expect;

describe('PlaceOfInterest e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let placeOfInterestUpdatePage: PlaceOfInterestUpdatePage;
  let placeOfInterestComponentsPage: PlaceOfInterestComponentsPage;
  let placeOfInterestDeleteDialog: PlaceOfInterestDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PlaceOfInterests', async () => {
    await navBarPage.goToEntity('place-of-interest');
    placeOfInterestComponentsPage = new PlaceOfInterestComponentsPage();
    await browser.wait(ec.visibilityOf(placeOfInterestComponentsPage.title), 5000);
    expect(await placeOfInterestComponentsPage.getTitle()).to.eq('Place Of Interests');
  });

  it('should load create PlaceOfInterest page', async () => {
    await placeOfInterestComponentsPage.clickOnCreateButton();
    placeOfInterestUpdatePage = new PlaceOfInterestUpdatePage();
    expect(await placeOfInterestUpdatePage.getPageTitle()).to.eq('Create or edit a Place Of Interest');
    await placeOfInterestUpdatePage.cancel();
  });

  it('should create and save PlaceOfInterests', async () => {
    const nbButtonsBeforeCreate = await placeOfInterestComponentsPage.countDeleteButtons();

    await placeOfInterestComponentsPage.clickOnCreateButton();
    await promise.all([
      placeOfInterestUpdatePage.setNameInput('name'),
      placeOfInterestUpdatePage.remarksSelectLastOption(),
      placeOfInterestUpdatePage.locatedOnSelectLastOption()
    ]);
    expect(await placeOfInterestUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    const selectedInCirculation = placeOfInterestUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await placeOfInterestUpdatePage.getInCirculationInput().click();
      expect(await placeOfInterestUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await placeOfInterestUpdatePage.getInCirculationInput().click();
      expect(await placeOfInterestUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    await placeOfInterestUpdatePage.save();
    expect(await placeOfInterestUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await placeOfInterestComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last PlaceOfInterest', async () => {
    const nbButtonsBeforeDelete = await placeOfInterestComponentsPage.countDeleteButtons();
    await placeOfInterestComponentsPage.clickOnLastDeleteButton();

    placeOfInterestDeleteDialog = new PlaceOfInterestDeleteDialog();
    expect(await placeOfInterestDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Place Of Interest?');
    await placeOfInterestDeleteDialog.clickOnConfirmButton();

    expect(await placeOfInterestComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
