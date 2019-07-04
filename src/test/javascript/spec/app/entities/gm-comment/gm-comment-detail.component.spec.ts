/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { GMCommentDetailComponent } from 'app/entities/gm-comment/gm-comment-detail.component';
import { GMComment } from 'app/shared/model/gm-comment.model';

describe('Component Tests', () => {
  describe('GMComment Management Detail Component', () => {
    let comp: GMCommentDetailComponent;
    let fixture: ComponentFixture<GMCommentDetailComponent>;
    const route = ({ data: of({ gMComment: new GMComment(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GMCommentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(GMCommentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GMCommentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.gMComment).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
