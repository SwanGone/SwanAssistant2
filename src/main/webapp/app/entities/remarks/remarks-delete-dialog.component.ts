import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRemarks } from 'app/shared/model/remarks.model';
import { RemarksService } from './remarks.service';

@Component({
  selector: 'jhi-remarks-delete-dialog',
  templateUrl: './remarks-delete-dialog.component.html'
})
export class RemarksDeleteDialogComponent {
  remarks: IRemarks;

  constructor(protected remarksService: RemarksService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.remarksService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'remarksListModification',
        content: 'Deleted an remarks'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-remarks-delete-popup',
  template: ''
})
export class RemarksDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ remarks }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(RemarksDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.remarks = remarks;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/remarks', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/remarks', { outlets: { popup: null } }]);
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
