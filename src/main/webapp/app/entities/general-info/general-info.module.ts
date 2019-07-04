import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  GeneralInfoComponent,
  GeneralInfoDetailComponent,
  GeneralInfoUpdateComponent,
  GeneralInfoDeletePopupComponent,
  GeneralInfoDeleteDialogComponent,
  generalInfoRoute,
  generalInfoPopupRoute
} from './';

const ENTITY_STATES = [...generalInfoRoute, ...generalInfoPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    GeneralInfoComponent,
    GeneralInfoDetailComponent,
    GeneralInfoUpdateComponent,
    GeneralInfoDeleteDialogComponent,
    GeneralInfoDeletePopupComponent
  ],
  entryComponents: [GeneralInfoComponent, GeneralInfoUpdateComponent, GeneralInfoDeleteDialogComponent, GeneralInfoDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2GeneralInfoModule {}
