import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPCComment } from 'app/shared/model/pc-comment.model';
import { PCCommentService } from './pc-comment.service';

@Component({
  selector: 'jhi-pc-comment-delete-dialog',
  templateUrl: './pc-comment-delete-dialog.component.html'
})
export class PCCommentDeleteDialogComponent {
  pCComment: IPCComment;

  constructor(protected pCCommentService: PCCommentService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.pCCommentService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'pCCommentListModification',
        content: 'Deleted an pCComment'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-pc-comment-delete-popup',
  template: ''
})
export class PCCommentDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pCComment }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PCCommentDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.pCComment = pCComment;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/pc-comment', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/pc-comment', { outlets: { popup: null } }]);
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
