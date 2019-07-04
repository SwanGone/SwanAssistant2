import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Swanassistant2SharedModule } from 'app/shared';
import {
  PlanetComponent,
  PlanetDetailComponent,
  PlanetUpdateComponent,
  PlanetDeletePopupComponent,
  PlanetDeleteDialogComponent,
  planetRoute,
  planetPopupRoute
} from './';

const ENTITY_STATES = [...planetRoute, ...planetPopupRoute];

@NgModule({
  imports: [Swanassistant2SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [PlanetComponent, PlanetDetailComponent, PlanetUpdateComponent, PlanetDeleteDialogComponent, PlanetDeletePopupComponent],
  entryComponents: [PlanetComponent, PlanetUpdateComponent, PlanetDeleteDialogComponent, PlanetDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2PlanetModule {}
