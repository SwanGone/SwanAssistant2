/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PlanetComponentsPage, PlanetDeleteDialog, PlanetUpdatePage } from './planet.page-object';

const expect = chai.expect;

describe('Planet e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let planetUpdatePage: PlanetUpdatePage;
  let planetComponentsPage: PlanetComponentsPage;
  let planetDeleteDialog: PlanetDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Planets', async () => {
    await navBarPage.goToEntity('planet');
    planetComponentsPage = new PlanetComponentsPage();
    await browser.wait(ec.visibilityOf(planetComponentsPage.title), 5000);
    expect(await planetComponentsPage.getTitle()).to.eq('Planets');
  });

  it('should load create Planet page', async () => {
    await planetComponentsPage.clickOnCreateButton();
    planetUpdatePage = new PlanetUpdatePage();
    expect(await planetUpdatePage.getPageTitle()).to.eq('Create or edit a Planet');
    await planetUpdatePage.cancel();
  });

  it('should create and save Planets', async () => {
    const nbButtonsBeforeCreate = await planetComponentsPage.countDeleteButtons();

    await planetComponentsPage.clickOnCreateButton();
    await promise.all([
      planetUpdatePage.setNameInput('name'),
      planetUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      planetUpdatePage.remarksSelectLastOption(),
      planetUpdatePage.createdBySelectLastOption(),
      planetUpdatePage.locatedInSelectLastOption()
      // planetUpdatePage.viewableBySelectLastOption(),
    ]);
    expect(await planetUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await planetUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    const selectedHasUnobtainium = planetUpdatePage.getHasUnobtainiumInput();
    if (await selectedHasUnobtainium.isSelected()) {
      await planetUpdatePage.getHasUnobtainiumInput().click();
      expect(await planetUpdatePage.getHasUnobtainiumInput().isSelected(), 'Expected hasUnobtainium not to be selected').to.be.false;
    } else {
      await planetUpdatePage.getHasUnobtainiumInput().click();
      expect(await planetUpdatePage.getHasUnobtainiumInput().isSelected(), 'Expected hasUnobtainium to be selected').to.be.true;
    }
    const selectedInCirculation = planetUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await planetUpdatePage.getInCirculationInput().click();
      expect(await planetUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await planetUpdatePage.getInCirculationInput().click();
      expect(await planetUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    await planetUpdatePage.save();
    expect(await planetUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await planetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Planet', async () => {
    const nbButtonsBeforeDelete = await planetComponentsPage.countDeleteButtons();
    await planetComponentsPage.clickOnLastDeleteButton();

    planetDeleteDialog = new PlanetDeleteDialog();
    expect(await planetDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Planet?');
    await planetDeleteDialog.clickOnConfirmButton();

    expect(await planetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
