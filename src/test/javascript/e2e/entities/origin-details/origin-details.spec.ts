/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OriginDetailsComponentsPage, OriginDetailsDeleteDialog, OriginDetailsUpdatePage } from './origin-details.page-object';

const expect = chai.expect;

describe('OriginDetails e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let originDetailsUpdatePage: OriginDetailsUpdatePage;
  let originDetailsComponentsPage: OriginDetailsComponentsPage;
  let originDetailsDeleteDialog: OriginDetailsDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load OriginDetails', async () => {
    await navBarPage.goToEntity('origin-details');
    originDetailsComponentsPage = new OriginDetailsComponentsPage();
    await browser.wait(ec.visibilityOf(originDetailsComponentsPage.title), 5000);
    expect(await originDetailsComponentsPage.getTitle()).to.eq('Origin Details');
  });

  it('should load create OriginDetails page', async () => {
    await originDetailsComponentsPage.clickOnCreateButton();
    originDetailsUpdatePage = new OriginDetailsUpdatePage();
    expect(await originDetailsUpdatePage.getPageTitle()).to.eq('Create or edit a Origin Details');
    await originDetailsUpdatePage.cancel();
  });

  it('should create and save OriginDetails', async () => {
    const nbButtonsBeforeCreate = await originDetailsComponentsPage.countDeleteButtons();

    await originDetailsComponentsPage.clickOnCreateButton();
    await promise.all([
      originDetailsUpdatePage.setContentInput('content'),
      originDetailsUpdatePage.setDateAddedInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      originDetailsUpdatePage.createdBySelectLastOption()
      // originDetailsUpdatePage.viewableBySelectLastOption(),
    ]);
    expect(await originDetailsUpdatePage.getContentInput()).to.eq('content', 'Expected Content value to be equals to content');
    expect(await originDetailsUpdatePage.getDateAddedInput()).to.contain(
      '2001-01-01T02:30',
      'Expected dateAdded value to be equals to 2000-12-31'
    );
    const selectedInCirculation = originDetailsUpdatePage.getInCirculationInput();
    if (await selectedInCirculation.isSelected()) {
      await originDetailsUpdatePage.getInCirculationInput().click();
      expect(await originDetailsUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation not to be selected').to.be.false;
    } else {
      await originDetailsUpdatePage.getInCirculationInput().click();
      expect(await originDetailsUpdatePage.getInCirculationInput().isSelected(), 'Expected inCirculation to be selected').to.be.true;
    }
    await originDetailsUpdatePage.save();
    expect(await originDetailsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await originDetailsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last OriginDetails', async () => {
    const nbButtonsBeforeDelete = await originDetailsComponentsPage.countDeleteButtons();
    await originDetailsComponentsPage.clickOnLastDeleteButton();

    originDetailsDeleteDialog = new OriginDetailsDeleteDialog();
    expect(await originDetailsDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Origin Details?');
    await originDetailsDeleteDialog.clickOnConfirmButton();

    expect(await originDetailsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
