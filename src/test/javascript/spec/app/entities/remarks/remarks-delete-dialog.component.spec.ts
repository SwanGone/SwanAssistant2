/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { RemarksDeleteDialogComponent } from 'app/entities/remarks/remarks-delete-dialog.component';
import { RemarksService } from 'app/entities/remarks/remarks.service';

describe('Component Tests', () => {
  describe('Remarks Management Delete Component', () => {
    let comp: RemarksDeleteDialogComponent;
    let fixture: ComponentFixture<RemarksDeleteDialogComponent>;
    let service: RemarksService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [RemarksDeleteDialogComponent]
      })
        .overrideTemplate(RemarksDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RemarksDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RemarksService);
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
