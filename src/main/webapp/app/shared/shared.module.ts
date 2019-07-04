import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Swanassistant2SharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [Swanassistant2SharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [Swanassistant2SharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Swanassistant2SharedModule {
  static forRoot() {
    return {
      ngModule: Swanassistant2SharedModule
    };
  }
}
