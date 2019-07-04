import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  SpeciesComponent,
  SpeciesDetailComponent,
  SpeciesUpdateComponent,
  SpeciesDeletePopupComponent,
  SpeciesDeleteDialogComponent,
  speciesRoute,
  speciesPopupRoute
} from './';

const ENTITY_STATES = [...speciesRoute, ...speciesPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SpeciesComponent,
    SpeciesDetailComponent,
    SpeciesUpdateComponent,
    SpeciesDeleteDialogComponent,
    SpeciesDeletePopupComponent
  ],
  entryComponents: [SpeciesComponent, SpeciesUpdateComponent, SpeciesDeleteDialogComponent, SpeciesDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2SpeciesModule {}
