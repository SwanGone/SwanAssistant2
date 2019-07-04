/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { GeneralInfoDetailComponent } from 'app/entities/general-info/general-info-detail.component';
import { GeneralInfo } from 'app/shared/model/general-info.model';

describe('Component Tests', () => {
  describe('GeneralInfo Management Detail Component', () => {
    let comp: GeneralInfoDetailComponent;
    let fixture: ComponentFixture<GeneralInfoDetailComponent>;
    const route = ({ data: of({ generalInfo: new GeneralInfo(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GeneralInfoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(GeneralInfoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GeneralInfoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.generalInfo).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
