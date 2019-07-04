/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { GMCommentDeleteDialogComponent } from 'app/entities/gm-comment/gm-comment-delete-dialog.component';
import { GMCommentService } from 'app/entities/gm-comment/gm-comment.service';

describe('Component Tests', () => {
  describe('GMComment Management Delete Component', () => {
    let comp: GMCommentDeleteDialogComponent;
    let fixture: ComponentFixture<GMCommentDeleteDialogComponent>;
    let service: GMCommentService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GMCommentDeleteDialogComponent]
      })
        .overrideTemplate(GMCommentDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GMCommentDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GMCommentService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
