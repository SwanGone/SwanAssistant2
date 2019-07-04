/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexMapDetailComponent } from 'app/entities/hex-map/hex-map-detail.component';
import { HexMap } from 'app/shared/model/hex-map.model';

describe('Component Tests', () => {
  describe('HexMap Management Detail Component', () => {
    let comp: HexMapDetailComponent;
    let fixture: ComponentFixture<HexMapDetailComponent>;
    const route = ({ data: of({ hexMap: new HexMap(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexMapDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(HexMapDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HexMapDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.hexMap).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
