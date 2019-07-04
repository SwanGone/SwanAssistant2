/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SpeciesComponentsPage, SpeciesDeleteDialog, SpeciesUpdatePage } from './species.page-object';

const expect = chai.expect;

describe('Species e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let speciesUpdatePage: SpeciesUpdatePage;
  let speciesComponentsPage: SpeciesComponentsPage;
  let speciesDeleteDialog: SpeciesDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Species', async () => {
    await navBarPage.goToEntity('species');
    speciesComponentsPage = new SpeciesComponentsPage();
    await browser.wait(ec.visibilityOf(speciesComponentsPage.title), 5000);
    expect(await speciesComponentsPage.getTitle()).to.eq('Species');
  });

  it('should load create Species page', async () => {
    await speciesComponentsPage.clickOnCreateButton();
    speciesUpdatePage = new SpeciesUpdatePage();
    expect(await speciesUpdatePage.getPageTitle()).to.eq('Create or edit a Species');
    await speciesUpdatePage.cancel();
  });

  it('should create and save Species', async () => {
    const nbButtonsBeforeCreate = await speciesComponentsPage.countDeleteButtons();

    await speciesComponentsPage.clickOnCreateButton();
    await promise.all([
      speciesUpdatePage.setNameInput('name'),
      speciesUpdatePage.setPhysicalCharacteristicsInput('physicalCharacteristics'),
      speciesUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      speciesUpdatePage.remarksSelectLastOption(),
      speciesUpdatePage.createdBySelectLastOption()
      // speciesUpdatePage.viewableBySelectLastOption(),
    ]);
    expect(await speciesUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await speciesUpdatePage.getPhysicalCharacteristicsInput()).to.eq(
      'physicalCharacteristics',
      'Expected PhysicalCharacteristics value to be equals to physicalCharacteristics'
    );
    expect(await speciesUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    const selectedInCirculation = speciesUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await speciesUpdatePage.getInCirculationInput().click();
      expect(await speciesUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await speciesUpdatePage.getInCirculationInput().click();
      expect(await speciesUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    await speciesUpdatePage.save();
    expect(await speciesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await speciesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Species', async () => {
    const nbButtonsBeforeDelete = await speciesComponentsPage.countDeleteButtons();
    await speciesComponentsPage.clickOnLastDeleteButton();

    speciesDeleteDialog = new SpeciesDeleteDialog();
    expect(await speciesDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Species?');
    await speciesDeleteDialog.clickOnConfirmButton();

    expect(await speciesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
