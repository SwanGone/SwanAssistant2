import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  GMCommentComponent,
  GMCommentDetailComponent,
  GMCommentUpdateComponent,
  GMCommentDeletePopupComponent,
  GMCommentDeleteDialogComponent,
  gMCommentRoute,
  gMCommentPopupRoute
} from './';

const ENTITY_STATES = [...gMCommentRoute, ...gMCommentPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    GMCommentComponent,
    GMCommentDetailComponent,
    GMCommentUpdateComponent,
    GMCommentDeleteDialogComponent,
    GMCommentDeletePopupComponent
  ],
  entryComponents: [GMCommentComponent, GMCommentUpdateComponent, GMCommentDeleteDialogComponent, GMCommentDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2GMCommentModule {}
