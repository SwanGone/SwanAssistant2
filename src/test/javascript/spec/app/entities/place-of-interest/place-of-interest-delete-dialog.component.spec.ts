/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlaceOfInterestDeleteDialogComponent } from 'app/entities/place-of-interest/place-of-interest-delete-dialog.component';
import { PlaceOfInterestService } from 'app/entities/place-of-interest/place-of-interest.service';

describe('Component Tests', () => {
  describe('PlaceOfInterest Management Delete Component', () => {
    let comp: PlaceOfInterestDeleteDialogComponent;
    let fixture: ComponentFixture<PlaceOfInterestDeleteDialogComponent>;
    let service: PlaceOfInterestService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlaceOfInterestDeleteDialogComponent]
      })
        .overrideTemplate(PlaceOfInterestDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PlaceOfInterestDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlaceOfInterestService);
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
