import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  PCCommentComponent,
  PCCommentDetailComponent,
  PCCommentUpdateComponent,
  PCCommentDeletePopupComponent,
  PCCommentDeleteDialogComponent,
  pCCommentRoute,
  pCCommentPopupRoute
} from './';

const ENTITY_STATES = [...pCCommentRoute, ...pCCommentPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PCCommentComponent,
    PCCommentDetailComponent,
    PCCommentUpdateComponent,
    PCCommentDeleteDialogComponent,
    PCCommentDeletePopupComponent
  ],
  entryComponents: [PCCommentComponent, PCCommentUpdateComponent, PCCommentDeleteDialogComponent, PCCommentDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2PCCommentModule {}
