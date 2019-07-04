/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { BackstoryDeleteDialogComponent } from 'app/entities/backstory/backstory-delete-dialog.component';
import { BackstoryService } from 'app/entities/backstory/backstory.service';

describe('Component Tests', () => {
  describe('Backstory Management Delete Component', () => {
    let comp: BackstoryDeleteDialogComponent;
    let fixture: ComponentFixture<BackstoryDeleteDialogComponent>;
    let service: BackstoryService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [BackstoryDeleteDialogComponent]
      })
        .overrideTemplate(BackstoryDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BackstoryDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BackstoryService);
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
