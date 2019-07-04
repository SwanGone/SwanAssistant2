/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { RemarksComponent } from 'app/entities/remarks/remarks.component';
import { RemarksService } from 'app/entities/remarks/remarks.service';
import { Remarks } from 'app/shared/model/remarks.model';

describe('Component Tests', () => {
  describe('Remarks Management Component', () => {
    let comp: RemarksComponent;
    let fixture: ComponentFixture<RemarksComponent>;
    let service: RemarksService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [RemarksComponent],
        providers: []
      })
        .overrideTemplate(RemarksComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RemarksComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RemarksService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Remarks(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.remarks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
