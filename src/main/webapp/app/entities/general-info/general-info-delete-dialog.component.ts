import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGeneralInfo } from 'app/shared/model/general-info.model';
import { GeneralInfoService } from './general-info.service';

@Component({
  selector: 'jhi-general-info-delete-dialog',
  templateUrl: './general-info-delete-dialog.component.html'
})
export class GeneralInfoDeleteDialogComponent {
  generalInfo: IGeneralInfo;

  constructor(
    protected generalInfoService: GeneralInfoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.generalInfoService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'generalInfoListModification',
        content: 'Deleted an generalInfo'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-general-info-delete-popup',
  template: ''
})
export class GeneralInfoDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ generalInfo }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(GeneralInfoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.generalInfo = generalInfo;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/general-info', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/general-info', { outlets: { popup: null } }]);
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
