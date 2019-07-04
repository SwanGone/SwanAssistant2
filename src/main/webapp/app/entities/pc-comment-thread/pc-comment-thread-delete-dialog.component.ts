import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';
import { PCCommentThreadService } from './pc-comment-thread.service';

@Component({
  selector: 'jhi-pc-comment-thread-delete-dialog',
  templateUrl: './pc-comment-thread-delete-dialog.component.html'
})
export class PCCommentThreadDeleteDialogComponent {
  pCCommentThread: IPCCommentThread;

  constructor(
    protected pCCommentThreadService: PCCommentThreadService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.pCCommentThreadService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'pCCommentThreadListModification',
        content: 'Deleted an pCCommentThread'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-pc-comment-thread-delete-popup',
  template: ''
})
export class PCCommentThreadDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pCCommentThread }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PCCommentThreadDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.pCCommentThread = pCCommentThread;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/pc-comment-thread', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/pc-comment-thread', { outlets: { popup: null } }]);
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
