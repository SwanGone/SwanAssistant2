import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOccupation } from 'app/shared/model/occupation.model';
import { OccupationService } from './occupation.service';

@Component({
  selector: 'jhi-occupation-delete-dialog',
  templateUrl: './occupation-delete-dialog.component.html'
})
export class OccupationDeleteDialogComponent {
  occupation: IOccupation;

  constructor(
    protected occupationService: OccupationService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.occupationService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'occupationListModification',
        content: 'Deleted an occupation'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-occupation-delete-popup',
  template: ''
})
export class OccupationDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ occupation }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OccupationDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.occupation = occupation;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/occupation', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/occupation', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
