/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentDetailComponent } from 'app/entities/pc-comment/pc-comment-detail.component';
import { PCComment } from 'app/shared/model/pc-comment.model';

describe('Component Tests', () => {
  describe('PCComment Management Detail Component', () => {
    let comp: PCCommentDetailComponent;
    let fixture: ComponentFixture<PCCommentDetailComponent>;
    const route = ({ data: of({ pCComment: new PCComment(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PCCommentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PCCommentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pCComment).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
