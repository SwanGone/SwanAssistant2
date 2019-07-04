/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { AdjectiveDetailComponent } from 'app/entities/adjective/adjective-detail.component';
import { Adjective } from 'app/shared/model/adjective.model';

describe('Component Tests', () => {
  describe('Adjective Management Detail Component', () => {
    let comp: AdjectiveDetailComponent;
    let fixture: ComponentFixture<AdjectiveDetailComponent>;
    const route = ({ data: of({ adjective: new Adjective(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [AdjectiveDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(AdjectiveDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AdjectiveDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.adjective).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
