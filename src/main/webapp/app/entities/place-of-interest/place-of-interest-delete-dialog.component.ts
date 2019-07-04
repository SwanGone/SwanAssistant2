import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPlaceOfInterest } from 'app/shared/model/place-of-interest.model';
import { PlaceOfInterestService } from './place-of-interest.service';

@Component({
  selector: 'jhi-place-of-interest-delete-dialog',
  templateUrl: './place-of-interest-delete-dialog.component.html'
})
export class PlaceOfInterestDeleteDialogComponent {
  placeOfInterest: IPlaceOfInterest;

  constructor(
    protected placeOfInterestService: PlaceOfInterestService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.placeOfInterestService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'placeOfInterestListModification',
        content: 'Deleted an placeOfInterest'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-place-of-interest-delete-popup',
  template: ''
})
export class PlaceOfInterestDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ placeOfInterest }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PlaceOfInterestDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.placeOfInterest = placeOfInterest;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/place-of-interest', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/place-of-interest', { outlets: { popup: null } }]);
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
