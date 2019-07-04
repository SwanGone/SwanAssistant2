/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { SpeciesComponent } from 'app/entities/species/species.component';
import { SpeciesService } from 'app/entities/species/species.service';
import { Species } from 'app/shared/model/species.model';

describe('Component Tests', () => {
  describe('Species Management Component', () => {
    let comp: SpeciesComponent;
    let fixture: ComponentFixture<SpeciesComponent>;
    let service: SpeciesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [SpeciesComponent],
        providers: []
      })
        .overrideTemplate(SpeciesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SpeciesComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SpeciesService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Species(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.species[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
