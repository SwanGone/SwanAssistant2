/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Swanassistant2TestModule } from '../../../test.module';
import { SpeciesDeleteDialogComponent } from 'app/entities/species/species-delete-dialog.component';
import { SpeciesService } from 'app/entities/species/species.service';

describe('Component Tests', () => {
  describe('Species Management Delete Component', () => {
    let comp: SpeciesDeleteDialogComponent;
    let fixture: ComponentFixture<SpeciesDeleteDialogComponent>;
    let service: SpeciesService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [SpeciesDeleteDialogComponent]
      })
        .overrideTemplate(SpeciesDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SpeciesDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SpeciesService);
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
