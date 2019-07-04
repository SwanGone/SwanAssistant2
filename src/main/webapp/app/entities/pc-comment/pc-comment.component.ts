import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPCComment } from 'app/shared/model/pc-comment.model';
import { AccountService } from 'app/core';
import { PCCommentService } from './pc-comment.service';

@Component({
  selector: 'jhi-pc-comment',
  templateUrl: './pc-comment.component.html'
})
export class PCCommentComponent implements OnInit, OnDestroy {
  pCComments: IPCComment[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected pCCommentService: PCCommentService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.pCCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<IPCComment[]>) => res.ok),
        map((res: HttpResponse<IPCComment[]>) => res.body)
      )
      .subscribe(
        (res: IPCComment[]) => {
          this.pCComments = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPCComments();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPCComment) {
    return item.id;
  }

  registerChangeInPCComments() {
    this.eventSubscriber = this.eventManager.subscribe('pCCommentListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
