/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentThreadDetailComponent } from 'app/entities/pc-comment-thread/pc-comment-thread-detail.component';
import { PCCommentThread } from 'app/shared/model/pc-comment-thread.model';

describe('Component Tests', () => {
  describe('PCCommentThread Management Detail Component', () => {
    let comp: PCCommentThreadDetailComponent;
    let fixture: ComponentFixture<PCCommentThreadDetailComponent>;
    const route = ({ data: of({ pCCommentThread: new PCCommentThread(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentThreadDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PCCommentThreadDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PCCommentThreadDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pCCommentThread).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
