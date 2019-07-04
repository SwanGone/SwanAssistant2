/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { OriginDetailsDetailComponent } from 'app/entities/origin-details/origin-details-detail.component';
import { OriginDetails } from 'app/shared/model/origin-details.model';

describe('Component Tests', () => {
  describe('OriginDetails Management Detail Component', () => {
    let comp: OriginDetailsDetailComponent;
    let fixture: ComponentFixture<OriginDetailsDetailComponent>;
    const route = ({ data: of({ originDetails: new OriginDetails(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [OriginDetailsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OriginDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OriginDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.originDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
