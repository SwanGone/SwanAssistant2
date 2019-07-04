/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { GMCommentComponent } from 'app/entities/gm-comment/gm-comment.component';
import { GMCommentService } from 'app/entities/gm-comment/gm-comment.service';
import { GMComment } from 'app/shared/model/gm-comment.model';

describe('Component Tests', () => {
  describe('GMComment Management Component', () => {
    let comp: GMCommentComponent;
    let fixture: ComponentFixture<GMCommentComponent>;
    let service: GMCommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GMCommentComponent],
        providers: []
      })
        .overrideTemplate(GMCommentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GMCommentComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GMCommentService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new GMComment(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.gMComments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
