/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CharacterComponentsPage, CharacterDeleteDialog, CharacterUpdatePage } from './character.page-object';

const expect = chai.expect;

describe('Character e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let characterUpdatePage: CharacterUpdatePage;
  let characterComponentsPage: CharacterComponentsPage;
  let characterDeleteDialog: CharacterDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Characters', async () => {
    await navBarPage.goToEntity('character');
    characterComponentsPage = new CharacterComponentsPage();
    await browser.wait(ec.visibilityOf(characterComponentsPage.title), 5000);
    expect(await characterComponentsPage.getTitle()).to.eq('Characters');
  });

  it('should load create Character page', async () => {
    await characterComponentsPage.clickOnCreateButton();
    characterUpdatePage = new CharacterUpdatePage();
    expect(await characterUpdatePage.getPageTitle()).to.eq('Create or edit a Character');
    await characterUpdatePage.cancel();
  });

  it('should create and save Characters', async () => {
    const nbButtonsBeforeCreate = await characterComponentsPage.countDeleteButtons();

    await characterComponentsPage.clickOnCreateButton();
    await promise.all([
      characterUpdatePage.setNameInput('name'),
      characterUpdatePage.originSelectLastOption(),
      characterUpdatePage.remarksSelectLastOption(),
      characterUpdatePage.createdBySelectLastOption(),
      characterUpdatePage.currentLocationSelectLastOption()
      // characterUpdatePage.viewableBySelectLastOption(),
    ]);
    expect(await characterUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    const selectedInCirculation = characterUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await characterUpdatePage.getInCirculationInput().click();
      expect(await characterUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await characterUpdatePage.getInCirculationInput().click();
      expect(await characterUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    const selectedIsMostCurrent = characterUpdatePage.getIsMostCurrentInput();
    if (await selectedIsMostCurrent.isSelected()) {
      await characterUpdatePage.getIsMostCurrentInput().click();
      expect(await characterUpdatePage.getIsMostCurrentInput().isSelected(), 'Expected isMostCurrent not to be selected').to.be.false;
    } else {
      await characterUpdatePage.getIsMostCurrentInput().click();
      expect(await characterUpdatePage.getIsMostCurrentInput().isSelected(), 'Expected isMostCurrent to be selected').to.be.true;
    }
    const selectedIsPlayerCharacter = characterUpdatePage.getIsPlayerCharacterInput();
    if (await selectedIsPlayerCharacter.isSelected()) {
      await characterUpdatePage.getIsPlayerCharacterInput().click();
      expect(await characterUpdatePage.getIsPlayerCharacterInput().isSelected(), 'Expected isPlayerCharacter not to be selected').to.be
        .false;
    } else {
      await characterUpdatePage.getIsPlayerCharacterInput().click();
      expect(await characterUpdatePage.getIsPlayerCharacterInput().isSelected(), 'Expected isPlayerCharacter to be selected').to.be.true;
    }
    const selectedIsDiplomat = characterUpdatePage.getIsDiplomatInput();
    if (await selectedIsDiplomat.isSelected()) {
      await characterUpdatePage.getIsDiplomatInput().click();
      expect(await characterUpdatePage.getIsDiplomatInput().isSelected(), 'Expected isDiplomat not to be selected').to.be.false;
    } else {
      await characterUpdatePage.getIsDiplomatInput().click();
      expect(await characterUpdatePage.getIsDiplomatInput().isSelected(), 'Expected isDiplomat to be selected').to.be.true;
    }
    await characterUpdatePage.save();
    expect(await characterUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await characterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Character', async () => {
    const nbButtonsBeforeDelete = await characterComponentsPage.countDeleteButtons();
    await characterComponentsPage.clickOnLastDeleteButton();

    characterDeleteDialog = new CharacterDeleteDialog();
    expect(await characterDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Character?');
    await characterDeleteDialog.clickOnConfirmButton();

    expect(await characterComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
