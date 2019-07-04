import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  OccupationComponent,
  OccupationDetailComponent,
  OccupationUpdateComponent,
  OccupationDeletePopupComponent,
  OccupationDeleteDialogComponent,
  occupationRoute,
  occupationPopupRoute
} from './';

const ENTITY_STATES = [...occupationRoute, ...occupationPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OccupationComponent,
    OccupationDetailComponent,
    OccupationUpdateComponent,
    OccupationDeleteDialogComponent,
    OccupationDeletePopupComponent
  ],
  entryComponents: [OccupationComponent, OccupationUpdateComponent, OccupationDeleteDialogComponent, OccupationDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2OccupationModule {}
