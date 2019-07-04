/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { BackstoryComponent } from 'app/entities/backstory/backstory.component';
import { BackstoryService } from 'app/entities/backstory/backstory.service';
import { Backstory } from 'app/shared/model/backstory.model';

describe('Component Tests', () => {
  describe('Backstory Management Component', () => {
    let comp: BackstoryComponent;
    let fixture: ComponentFixture<BackstoryComponent>;
    let service: BackstoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [BackstoryComponent],
        providers: []
      })
        .overrideTemplate(BackstoryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BackstoryComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BackstoryService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Backstory(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.backstories[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
