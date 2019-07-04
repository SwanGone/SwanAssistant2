import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAdjective } from 'app/shared/model/adjective.model';
import { AdjectiveService } from './adjective.service';

@Component({
  selector: 'jhi-adjective-delete-dialog',
  templateUrl: './adjective-delete-dialog.component.html'
})
export class AdjectiveDeleteDialogComponent {
  adjective: IAdjective;

  constructor(protected adjectiveService: AdjectiveService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.adjectiveService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'adjectiveListModification',
        content: 'Deleted an adjective'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-adjective-delete-popup',
  template: ''
})
export class AdjectiveDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ adjective }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(AdjectiveDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.adjective = adjective;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/adjective', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/adjective', { outlets: { popup: null } }]);
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
