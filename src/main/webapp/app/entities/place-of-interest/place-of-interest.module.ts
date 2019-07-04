import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  PlaceOfInterestComponent,
  PlaceOfInterestDetailComponent,
  PlaceOfInterestUpdateComponent,
  PlaceOfInterestDeletePopupComponent,
  PlaceOfInterestDeleteDialogComponent,
  placeOfInterestRoute,
  placeOfInterestPopupRoute
} from './';

const ENTITY_STATES = [...placeOfInterestRoute, ...placeOfInterestPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PlaceOfInterestComponent,
    PlaceOfInterestDetailComponent,
    PlaceOfInterestUpdateComponent,
    PlaceOfInterestDeleteDialogComponent,
    PlaceOfInterestDeletePopupComponent
  ],
  entryComponents: [
    PlaceOfInterestComponent,
    PlaceOfInterestUpdateComponent,
    PlaceOfInterestDeleteDialogComponent,
    PlaceOfInterestDeletePopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2PlaceOfInterestModule {}
