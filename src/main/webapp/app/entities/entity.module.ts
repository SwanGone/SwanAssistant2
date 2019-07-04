import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'remarks',
        loadChildren: './remarks/remarks.module#Swanassistant2RemarksModule'
      },
      {
        path: 'gm-comment',
        loadChildren: './gm-comment/gm-comment.module#Swanassistant2GMCommentModule'
      },
      {
        path: 'general-info',
        loadChildren: './general-info/general-info.module#Swanassistant2GeneralInfoModule'
      },
      {
        path: 'pc-comment-thread',
        loadChildren: './pc-comment-thread/pc-comment-thread.module#Swanassistant2PCCommentThreadModule'
      },
      {
        path: 'pc-comment',
        loadChildren: './pc-comment/pc-comment.module#Swanassistant2PCCommentModule'
      },
      {
        path: 'character',
        loadChildren: './character/character.module#Swanassistant2CharacterModule'
      },
      {
        path: 'backstory',
        loadChildren: './backstory/backstory.module#Swanassistant2BackstoryModule'
      },
      {
        path: 'adjective',
        loadChildren: './adjective/adjective.module#Swanassistant2AdjectiveModule'
      },
      {
        path: 'species',
        loadChildren: './species/species.module#Swanassistant2SpeciesModule'
      },
      {
        path: 'occupation',
        loadChildren: './occupation/occupation.module#Swanassistant2OccupationModule'
      },
      {
        path: 'place-of-interest',
        loadChildren: './place-of-interest/place-of-interest.module#Swanassistant2PlaceOfInterestModule'
      },
      {
        path: 'planet',
        loadChildren: './planet/planet.module#Swanassistant2PlanetModule'
      },
      {
        path: 'hex-sector',
        loadChildren: './hex-sector/hex-sector.module#Swanassistant2HexSectorModule'
      },
      {
        path: 'hex-map',
        loadChildren: './hex-map/hex-map.module#Swanassistant2HexMapModule'
      },
      {
        path: 'origin-details',
        loadChildren: './origin-details/origin-details.module#Swanassistant2OriginDetailsModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2EntityModule {}
