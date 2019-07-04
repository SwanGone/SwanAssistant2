/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { OccupationComponent } from 'app/entities/occupation/occupation.component';
import { OccupationService } from 'app/entities/occupation/occupation.service';
import { Occupation } from 'app/shared/model/occupation.model';

describe('Component Tests', () => {
  describe('Occupation Management Component', () => {
    let comp: OccupationComponent;
    let fixture: ComponentFixture<OccupationComponent>;
    let service: OccupationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [OccupationComponent],
        providers: []
      })
        .overrideTemplate(OccupationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OccupationComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OccupationService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Occupation(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.occupations[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
