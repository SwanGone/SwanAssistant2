/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { OccupationDetailComponent } from 'app/entities/occupation/occupation-detail.component';
import { Occupation } from 'app/shared/model/occupation.model';

describe('Component Tests', () => {
  describe('Occupation Management Detail Component', () => {
    let comp: OccupationDetailComponent;
    let fixture: ComponentFixture<OccupationDetailComponent>;
    const route = ({ data: of({ occupation: new Occupation(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [OccupationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OccupationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OccupationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.occupation).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
