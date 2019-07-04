import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  PCCommentThreadComponent,
  PCCommentThreadDetailComponent,
  PCCommentThreadUpdateComponent,
  PCCommentThreadDeletePopupComponent,
  PCCommentThreadDeleteDialogComponent,
  pCCommentThreadRoute,
  pCCommentThreadPopupRoute
} from './';

const ENTITY_STATES = [...pCCommentThreadRoute, ...pCCommentThreadPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PCCommentThreadComponent,
    PCCommentThreadDetailComponent,
    PCCommentThreadUpdateComponent,
    PCCommentThreadDeleteDialogComponent,
    PCCommentThreadDeletePopupComponent
  ],
  entryComponents: [
    PCCommentThreadComponent,
    PCCommentThreadUpdateComponent,
    PCCommentThreadDeleteDialogComponent,
    PCCommentThreadDeletePopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2PCCommentThreadModule {}
