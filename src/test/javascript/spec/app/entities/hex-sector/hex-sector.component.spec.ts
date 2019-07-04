/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexSectorComponent } from 'app/entities/hex-sector/hex-sector.component';
import { HexSectorService } from 'app/entities/hex-sector/hex-sector.service';
import { HexSector } from 'app/shared/model/hex-sector.model';

describe('Component Tests', () => {
  describe('HexSector Management Component', () => {
    let comp: HexSectorComponent;
    let fixture: ComponentFixture<HexSectorComponent>;
    let service: HexSectorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexSectorComponent],
        providers: []
      })
        .overrideTemplate(HexSectorComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HexSectorComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(HexSectorService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new HexSector(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.hexSectors[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
