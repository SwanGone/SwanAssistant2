/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { OriginDetailsComponent } from 'app/entities/origin-details/origin-details.component';
import { OriginDetailsService } from 'app/entities/origin-details/origin-details.service';
import { OriginDetails } from 'app/shared/model/origin-details.model';

describe('Component Tests', () => {
  describe('OriginDetails Management Component', () => {
    let comp: OriginDetailsComponent;
    let fixture: ComponentFixture<OriginDetailsComponent>;
    let service: OriginDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [OriginDetailsComponent],
        providers: []
      })
        .overrideTemplate(OriginDetailsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OriginDetailsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OriginDetailsService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new OriginDetails(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.originDetails[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
