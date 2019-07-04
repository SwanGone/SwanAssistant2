import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGMComment } from 'app/shared/model/gm-comment.model';
import { GMCommentService } from './gm-comment.service';

@Component({
  selector: 'jhi-gm-comment-delete-dialog',
  templateUrl: './gm-comment-delete-dialog.component.html'
})
export class GMCommentDeleteDialogComponent {
  gMComment: IGMComment;

  constructor(protected gMCommentService: GMCommentService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.gMCommentService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'gMCommentListModification',
        content: 'Deleted an gMComment'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-gm-comment-delete-popup',
  template: ''
})
export class GMCommentDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ gMComment }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(GMCommentDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.gMComment = gMComment;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/gm-comment', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/gm-comment', { outlets: { popup: null } }]);
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
