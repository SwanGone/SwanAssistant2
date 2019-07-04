/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexMapComponent } from 'app/entities/hex-map/hex-map.component';
import { HexMapService } from 'app/entities/hex-map/hex-map.service';
import { HexMap } from 'app/shared/model/hex-map.model';

describe('Component Tests', () => {
  describe('HexMap Management Component', () => {
    let comp: HexMapComponent;
    let fixture: ComponentFixture<HexMapComponent>;
    let service: HexMapService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexMapComponent],
        providers: []
      })
        .overrideTemplate(HexMapComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HexMapComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(HexMapService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new HexMap(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.hexMaps[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
