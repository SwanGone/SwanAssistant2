/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { GeneralInfoDeleteDialogComponent } from 'app/entities/general-info/general-info-delete-dialog.component';
import { GeneralInfoService } from 'app/entities/general-info/general-info.service';

describe('Component Tests', () => {
  describe('GeneralInfo Management Delete Component', () => {
    let comp: GeneralInfoDeleteDialogComponent;
    let fixture: ComponentFixture<GeneralInfoDeleteDialogComponent>;
    let service: GeneralInfoService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GeneralInfoDeleteDialogComponent]
      })
        .overrideTemplate(GeneralInfoDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GeneralInfoDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GeneralInfoService);
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
