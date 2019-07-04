/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlaceOfInterestComponent } from 'app/entities/place-of-interest/place-of-interest.component';
import { PlaceOfInterestService } from 'app/entities/place-of-interest/place-of-interest.service';
import { PlaceOfInterest } from 'app/shared/model/place-of-interest.model';

describe('Component Tests', () => {
  describe('PlaceOfInterest Management Component', () => {
    let comp: PlaceOfInterestComponent;
    let fixture: ComponentFixture<PlaceOfInterestComponent>;
    let service: PlaceOfInterestService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlaceOfInterestComponent],
        providers: []
      })
        .overrideTemplate(PlaceOfInterestComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlaceOfInterestComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlaceOfInterestService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PlaceOfInterest(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.placeOfInterests[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
