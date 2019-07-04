/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { SpeciesDetailComponent } from 'app/entities/species/species-detail.component';
import { Species } from 'app/shared/model/species.model';

describe('Component Tests', () => {
  describe('Species Management Detail Component', () => {
    let comp: SpeciesDetailComponent;
    let fixture: ComponentFixture<SpeciesDetailComponent>;
    const route = ({ data: of({ species: new Species(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [SpeciesDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(SpeciesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SpeciesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.species).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
