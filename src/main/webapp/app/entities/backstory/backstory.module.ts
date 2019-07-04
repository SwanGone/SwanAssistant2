import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  BackstoryComponent,
  BackstoryDetailComponent,
  BackstoryUpdateComponent,
  BackstoryDeletePopupComponent,
  BackstoryDeleteDialogComponent,
  backstoryRoute,
  backstoryPopupRoute
} from './';

const ENTITY_STATES = [...backstoryRoute, ...backstoryPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    BackstoryComponent,
    BackstoryDetailComponent,
    BackstoryUpdateComponent,
    BackstoryDeleteDialogComponent,
    BackstoryDeletePopupComponent
  ],
  entryComponents: [BackstoryComponent, BackstoryUpdateComponent, BackstoryDeleteDialogComponent, BackstoryDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2BackstoryModule {}
