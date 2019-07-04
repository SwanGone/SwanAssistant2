/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OccupationComponentsPage, OccupationDeleteDialog, OccupationUpdatePage } from './occupation.page-object';

const expect = chai.expect;

describe('Occupation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let occupationUpdatePage: OccupationUpdatePage;
  let occupationComponentsPage: OccupationComponentsPage;
  let occupationDeleteDialog: OccupationDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Occupations', async () => {
    await navBarPage.goToEntity('occupation');
    occupationComponentsPage = new OccupationComponentsPage();
    await browser.wait(ec.visibilityOf(occupationComponentsPage.title), 5000);
    expect(await occupationComponentsPage.getTitle()).to.eq('Occupations');
  });

  it('should load create Occupation page', async () => {
    await occupationComponentsPage.clickOnCreateButton();
    occupationUpdatePage = new OccupationUpdatePage();
    expect(await occupationUpdatePage.getPageTitle()).to.eq('Create or edit a Occupation');
    await occupationUpdatePage.cancel();
  });

  it('should create and save Occupations', async () => {
    const nbButtonsBeforeCreate = await occupationComponentsPage.countDeleteButtons();

    await occupationComponentsPage.clickOnCreateButton();
    await promise.all([
      occupationUpdatePage.setNameInput('name'),
      occupationUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      occupationUpdatePage.remarksSelectLastOption(),
      occupationUpdatePage.createdBySelectLastOption()
      // occupationUpdatePage.viewableBySelectLastOption(),
    ]);
    expect(await occupationUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await occupationUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    const selectedInCirculation = occupationUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await occupationUpdatePage.getInCirculationInput().click();
      expect(await occupationUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await occupationUpdatePage.getInCirculationInput().click();
      expect(await occupationUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    await occupationUpdatePage.save();
    expect(await occupationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await occupationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Occupation', async () => {
    const nbButtonsBeforeDelete = await occupationComponentsPage.countDeleteButtons();
    await occupationComponentsPage.clickOnLastDeleteButton();

    occupationDeleteDialog = new OccupationDeleteDialog();
    expect(await occupationDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Occupation?');
    await occupationDeleteDialog.clickOnConfirmButton();

    expect(await occupationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
