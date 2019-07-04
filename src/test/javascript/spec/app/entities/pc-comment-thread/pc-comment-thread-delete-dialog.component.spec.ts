/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentThreadDeleteDialogComponent } from 'app/entities/pc-comment-thread/pc-comment-thread-delete-dialog.component';
import { PCCommentThreadService } from 'app/entities/pc-comment-thread/pc-comment-thread.service';

describe('Component Tests', () => {
  describe('PCCommentThread Management Delete Component', () => {
    let comp: PCCommentThreadDeleteDialogComponent;
    let fixture: ComponentFixture<PCCommentThreadDeleteDialogComponent>;
    let service: PCCommentThreadService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentThreadDeleteDialogComponent]
      })
        .overrideTemplate(PCCommentThreadDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PCCommentThreadDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PCCommentThreadService);
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
