import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOriginDetails } from 'app/shared/model/origin-details.model';
import { OriginDetailsService } from './origin-details.service';

@Component({
  selector: 'jhi-origin-details-delete-dialog',
  templateUrl: './origin-details-delete-dialog.component.html'
})
export class OriginDetailsDeleteDialogComponent {
  originDetails: IOriginDetails;

  constructor(
    protected originDetailsService: OriginDetailsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.originDetailsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'originDetailsListModification',
        content: 'Deleted an originDetails'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-origin-details-delete-popup',
  template: ''
})
export class OriginDetailsDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ originDetails }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OriginDetailsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.originDetails = originDetails;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/origin-details', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/origin-details', { outlets: { popup: null } }]);
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
