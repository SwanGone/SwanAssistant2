import { NgModule } from '@angular/core';

import { Swanassistant2SharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [Swanassistant2SharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [Swanassistant2SharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class Swanassistant2SharedCommonModule {}
