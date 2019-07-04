/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlanetComponent } from 'app/entities/planet/planet.component';
import { PlanetService } from 'app/entities/planet/planet.service';
import { Planet } from 'app/shared/model/planet.model';

describe('Component Tests', () => {
  describe('Planet Management Component', () => {
    let comp: PlanetComponent;
    let fixture: ComponentFixture<PlanetComponent>;
    let service: PlanetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlanetComponent],
        providers: []
      })
        .overrideTemplate(PlanetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlanetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlanetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Planet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.planets[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
