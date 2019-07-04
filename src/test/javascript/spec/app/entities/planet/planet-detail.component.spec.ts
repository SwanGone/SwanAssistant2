/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlanetDetailComponent } from 'app/entities/planet/planet-detail.component';
import { Planet } from 'app/shared/model/planet.model';

describe('Component Tests', () => {
  describe('Planet Management Detail Component', () => {
    let comp: PlanetDetailComponent;
    let fixture: ComponentFixture<PlanetDetailComponent>;
    const route = ({ data: of({ planet: new Planet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlanetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PlanetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PlanetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.planet).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
