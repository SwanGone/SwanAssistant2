import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBackstory } from 'app/shared/model/backstory.model';
import { BackstoryService } from './backstory.service';

@Component({
  selector: 'jhi-backstory-delete-dialog',
  templateUrl: './backstory-delete-dialog.component.html'
})
export class BackstoryDeleteDialogComponent {
  backstory: IBackstory;

  constructor(protected backstoryService: BackstoryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.backstoryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'backstoryListModification',
        content: 'Deleted an backstory'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-backstory-delete-popup',
  template: ''
})
export class BackstoryDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ backstory }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(BackstoryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.backstory = backstory;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/backstory', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/backstory', { outlets: { popup: null } }]);
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
