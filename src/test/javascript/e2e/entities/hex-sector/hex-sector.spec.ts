/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { HexSectorComponentsPage, HexSectorDeleteDialog, HexSectorUpdatePage } from './hex-sector.page-object';

const expect = chai.expect;

describe('HexSector e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let hexSectorUpdatePage: HexSectorUpdatePage;
  let hexSectorComponentsPage: HexSectorComponentsPage;
  let hexSectorDeleteDialog: HexSectorDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load HexSectors', async () => {
    await navBarPage.goToEntity('hex-sector');
    hexSectorComponentsPage = new HexSectorComponentsPage();
    await browser.wait(ec.visibilityOf(hexSectorComponentsPage.title), 5000);
    expect(await hexSectorComponentsPage.getTitle()).to.eq('Hex Sectors');
  });

  it('should load create HexSector page', async () => {
    await hexSectorComponentsPage.clickOnCreateButton();
    hexSectorUpdatePage = new HexSectorUpdatePage();
    expect(await hexSectorUpdatePage.getPageTitle()).to.eq('Create or edit a Hex Sector');
    await hexSectorUpdatePage.cancel();
  });

  it('should create and save HexSectors', async () => {
    const nbButtonsBeforeCreate = await hexSectorComponentsPage.countDeleteButtons();

    await hexSectorComponentsPage.clickOnCreateButton();
    await promise.all([
      hexSectorUpdatePage.setHexRowInput('hexRow'),
      hexSectorUpdatePage.setHexColumnInput('hexColumn'),
      hexSectorUpdatePage.setCoordinatesInput('coordinates'),
      hexSectorUpdatePage.locatedInSelectLastOption()
    ]);
    expect(await hexSectorUpdatePage.getHexRowInput()).to.eq('hexRow', 'Expected HexRow value to be equals to hexRow');
    expect(await hexSectorUpdatePage.getHexColumnInput()).to.eq('hexColumn', 'Expected HexColumn value to be equals to hexColumn');
    expect(await hexSectorUpdatePage.getCoordinatesInput()).to.eq('coordinates', 'Expected Coordinates value to be equals to coordinates');
    const selectedIsMapped = hexSectorUpdatePage.getIsMappedInput();
    if (await selectedIsMapped.isSelected()) {
      await hexSectorUpdatePage.getIsMappedInput().click();
      expect(await hexSectorUpdatePage.getIsMappedInput().isSelected(), 'Expected isMapped not to be selected').to.be.false;
    } else {
      await hexSectorUpdatePage.getIsMappedInput().click();
      expect(await hexSectorUpdatePage.getIsMappedInput().isSelected(), 'Expected isMapped to be selected').to.be.true;
    }
    await hexSectorUpdatePage.save();
    expect(await hexSectorUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await hexSectorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last HexSector', async () => {
    const nbButtonsBeforeDelete = await hexSectorComponentsPage.countDeleteButtons();
    await hexSectorComponentsPage.clickOnLastDeleteButton();

    hexSectorDeleteDialog = new HexSectorDeleteDialog();
    expect(await hexSectorDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Hex Sector?');
    await hexSectorDeleteDialog.clickOnConfirmButton();

    expect(await hexSectorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
