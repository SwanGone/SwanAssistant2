/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlaceOfInterestDetailComponent } from 'app/entities/place-of-interest/place-of-interest-detail.component';
import { PlaceOfInterest } from 'app/shared/model/place-of-interest.model';

describe('Component Tests', () => {
  describe('PlaceOfInterest Management Detail Component', () => {
    let comp: PlaceOfInterestDetailComponent;
    let fixture: ComponentFixture<PlaceOfInterestDetailComponent>;
    const route = ({ data: of({ placeOfInterest: new PlaceOfInterest(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlaceOfInterestDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PlaceOfInterestDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PlaceOfInterestDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.placeOfInterest).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
