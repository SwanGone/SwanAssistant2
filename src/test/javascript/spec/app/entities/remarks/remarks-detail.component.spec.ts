/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { RemarksDetailComponent } from 'app/entities/remarks/remarks-detail.component';
import { Remarks } from 'app/shared/model/remarks.model';

describe('Component Tests', () => {
  describe('Remarks Management Detail Component', () => {
    let comp: RemarksDetailComponent;
    let fixture: ComponentFixture<RemarksDetailComponent>;
    const route = ({ data: of({ remarks: new Remarks(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [RemarksDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(RemarksDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RemarksDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.remarks).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
