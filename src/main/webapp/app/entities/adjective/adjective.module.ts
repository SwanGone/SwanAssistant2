import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  AdjectiveComponent,
  AdjectiveDetailComponent,
  AdjectiveUpdateComponent,
  AdjectiveDeletePopupComponent,
  AdjectiveDeleteDialogComponent,
  adjectiveRoute,
  adjectivePopupRoute
} from './';

const ENTITY_STATES = [...adjectiveRoute, ...adjectivePopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AdjectiveComponent,
    AdjectiveDetailComponent,
    AdjectiveUpdateComponent,
    AdjectiveDeleteDialogComponent,
    AdjectiveDeletePopupComponent
  ],
  entryComponents: [AdjectiveComponent, AdjectiveUpdateComponent, AdjectiveDeleteDialogComponent, AdjectiveDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2AdjectiveModule {}
