/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { GeneralInfoComponent } from 'app/entities/general-info/general-info.component';
import { GeneralInfoService } from 'app/entities/general-info/general-info.service';
import { GeneralInfo } from 'app/shared/model/general-info.model';

describe('Component Tests', () => {
  describe('GeneralInfo Management Component', () => {
    let comp: GeneralInfoComponent;
    let fixture: ComponentFixture<GeneralInfoComponent>;
    let service: GeneralInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GeneralInfoComponent],
        providers: []
      })
        .overrideTemplate(GeneralInfoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GeneralInfoComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GeneralInfoService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new GeneralInfo(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.generalInfos[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
