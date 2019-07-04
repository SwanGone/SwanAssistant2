import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  HexSectorComponent,
  HexSectorDetailComponent,
  HexSectorUpdateComponent,
  HexSectorDeletePopupComponent,
  HexSectorDeleteDialogComponent,
  hexSectorRoute,
  hexSectorPopupRoute
} from './';

const ENTITY_STATES = [...hexSectorRoute, ...hexSectorPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    HexSectorComponent,
    HexSectorDetailComponent,
    HexSectorUpdateComponent,
    HexSectorDeleteDialogComponent,
    HexSectorDeletePopupComponent
  ],
  entryComponents: [HexSectorComponent, HexSectorUpdateComponent, HexSectorDeleteDialogComponent, HexSectorDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2HexSectorModule {}
