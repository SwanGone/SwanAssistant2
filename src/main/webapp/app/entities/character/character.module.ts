import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  CharacterComponent,
  CharacterDetailComponent,
  CharacterUpdateComponent,
  CharacterDeletePopupComponent,
  CharacterDeleteDialogComponent,
  characterRoute,
  characterPopupRoute
} from './';

const ENTITY_STATES = [...characterRoute, ...characterPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CharacterComponent,
    CharacterDetailComponent,
    CharacterUpdateComponent,
    CharacterDeleteDialogComponent,
    CharacterDeletePopupComponent
  ],
  entryComponents: [CharacterComponent, CharacterUpdateComponent, CharacterDeleteDialogComponent, CharacterDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2CharacterModule {}
