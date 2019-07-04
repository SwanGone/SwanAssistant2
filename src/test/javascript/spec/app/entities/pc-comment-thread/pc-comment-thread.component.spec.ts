/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentThreadComponent } from 'app/entities/pc-comment-thread/pc-comment-thread.component';
import { PCCommentThreadService } from 'app/entities/pc-comment-thread/pc-comment-thread.service';
import { PCCommentThread } from 'app/shared/model/pc-comment-thread.model';

describe('Component Tests', () => {
  describe('PCCommentThread Management Component', () => {
    let comp: PCCommentThreadComponent;
    let fixture: ComponentFixture<PCCommentThreadComponent>;
    let service: PCCommentThreadService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentThreadComponent],
        providers: []
      })
        .overrideTemplate(PCCommentThreadComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PCCommentThreadComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PCCommentThreadService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PCCommentThread(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.pCCommentThreads[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
