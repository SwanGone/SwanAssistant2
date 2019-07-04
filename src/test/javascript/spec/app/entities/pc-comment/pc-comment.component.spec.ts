/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentComponent } from 'app/entities/pc-comment/pc-comment.component';
import { PCCommentService } from 'app/entities/pc-comment/pc-comment.service';
import { PCComment } from 'app/shared/model/pc-comment.model';

describe('Component Tests', () => {
  describe('PCComment Management Component', () => {
    let comp: PCCommentComponent;
    let fixture: ComponentFixture<PCCommentComponent>;
    let service: PCCommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentComponent],
        providers: []
      })
        .overrideTemplate(PCCommentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PCCommentComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PCCommentService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PCComment(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.pCComments[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
