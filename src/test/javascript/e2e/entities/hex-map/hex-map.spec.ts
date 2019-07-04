/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { HexMapComponentsPage, HexMapDeleteDialog, HexMapUpdatePage } from './hex-map.page-object';

const expect = chai.expect;

describe('HexMap e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let hexMapUpdatePage: HexMapUpdatePage;
  let hexMapComponentsPage: HexMapComponentsPage;
  let hexMapDeleteDialog: HexMapDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load HexMaps', async () => {
    await navBarPage.goToEntity('hex-map');
    hexMapComponentsPage = new HexMapComponentsPage();
    await browser.wait(ec.visibilityOf(hexMapComponentsPage.title), 5000);
    expect(await hexMapComponentsPage.getTitle()).to.eq('Hex Maps');
  });

  it('should load create HexMap page', async () => {
    await hexMapComponentsPage.clickOnCreateButton();
    hexMapUpdatePage = new HexMapUpdatePage();
    expect(await hexMapUpdatePage.getPageTitle()).to.eq('Create or edit a Hex Map');
    await hexMapUpdatePage.cancel();
  });

  it('should create and save HexMaps', async () => {
    const nbButtonsBeforeCreate = await hexMapComponentsPage.countDeleteButtons();

    await hexMapComponentsPage.clickOnCreateButton();
    await promise.all([hexMapUpdatePage.setSeedInput('seed')]);
    expect(await hexMapUpdatePage.getSeedInput()).to.eq('seed', 'Expected Seed value to be equals to seed');
    await hexMapUpdatePage.save();
    expect(await hexMapUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await hexMapComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last HexMap', async () => {
    const nbButtonsBeforeDelete = await hexMapComponentsPage.countDeleteButtons();
    await hexMapComponentsPage.clickOnLastDeleteButton();

    hexMapDeleteDialog = new HexMapDeleteDialog();
    expect(await hexMapDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Hex Map?');
    await hexMapDeleteDialog.clickOnConfirmButton();

    expect(await hexMapComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
