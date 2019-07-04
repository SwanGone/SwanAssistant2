import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  OriginDetailsComponent,
  OriginDetailsDetailComponent,
  OriginDetailsUpdateComponent,
  OriginDetailsDeletePopupComponent,
  OriginDetailsDeleteDialogComponent,
  originDetailsRoute,
  originDetailsPopupRoute
} from './';

const ENTITY_STATES = [...originDetailsRoute, ...originDetailsPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OriginDetailsComponent,
    OriginDetailsDetailComponent,
    OriginDetailsUpdateComponent,
    OriginDetailsDeleteDialogComponent,
    OriginDetailsDeletePopupComponent
  ],
  entryComponents: [
    OriginDetailsComponent,
    OriginDetailsUpdateComponent,
    OriginDetailsDeleteDialogComponent,
    OriginDetailsDeletePopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2OriginDetailsModule {}
