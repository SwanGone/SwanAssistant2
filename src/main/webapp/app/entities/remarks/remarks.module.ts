import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  RemarksComponent,
  RemarksDetailComponent,
  RemarksUpdateComponent,
  RemarksDeletePopupComponent,
  RemarksDeleteDialogComponent,
  remarksRoute,
  remarksPopupRoute
} from './';

const ENTITY_STATES = [...remarksRoute, ...remarksPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RemarksComponent,
    RemarksDetailComponent,
    RemarksUpdateComponent,
    RemarksDeleteDialogComponent,
    RemarksDeletePopupComponent
  ],
  entryComponents: [RemarksComponent, RemarksUpdateComponent, RemarksDeleteDialogComponent, RemarksDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2RemarksModule {}
