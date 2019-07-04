/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexSectorDetailComponent } from 'app/entities/hex-sector/hex-sector-detail.component';
import { HexSector } from 'app/shared/model/hex-sector.model';

describe('Component Tests', () => {
  describe('HexSector Management Detail Component', () => {
    let comp: HexSectorDetailComponent;
    let fixture: ComponentFixture<HexSectorDetailComponent>;
    const route = ({ data: of({ hexSector: new HexSector(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexSectorDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(HexSectorDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HexSectorDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.hexSector).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
