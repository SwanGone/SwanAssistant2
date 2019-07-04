import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  HexMapComponent,
  HexMapDetailComponent,
  HexMapUpdateComponent,
  HexMapDeletePopupComponent,
  HexMapDeleteDialogComponent,
  hexMapRoute,
  hexMapPopupRoute
} from './';

const ENTITY_STATES = [...hexMapRoute, ...hexMapPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [HexMapComponent, HexMapDetailComponent, HexMapUpdateComponent, HexMapDeleteDialogComponent, HexMapDeletePopupComponent],
  entryComponents: [HexMapComponent, HexMapUpdateComponent, HexMapDeleteDialogComponent, HexMapDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2HexMapModule {}
