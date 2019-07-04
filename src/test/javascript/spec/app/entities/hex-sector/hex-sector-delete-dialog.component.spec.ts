/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexSectorDeleteDialogComponent } from 'app/entities/hex-sector/hex-sector-delete-dialog.component';
import { HexSectorService } from 'app/entities/hex-sector/hex-sector.service';

describe('Component Tests', () => {
  describe('HexSector Management Delete Component', () => {
    let comp: HexSectorDeleteDialogComponent;
    let fixture: ComponentFixture<HexSectorDeleteDialogComponent>;
    let service: HexSectorService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexSectorDeleteDialogComponent]
      })
        .overrideTemplate(HexSectorDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HexSectorDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(HexSectorService);
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
