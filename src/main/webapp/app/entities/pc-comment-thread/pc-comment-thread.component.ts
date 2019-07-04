import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';
import { AccountService } from 'app/core';
import { PCCommentThreadService } from './pc-comment-thread.service';

@Component({
  selector: 'jhi-pc-comment-thread',
  templateUrl: './pc-comment-thread.component.html'
})
export class PCCommentThreadComponent implements OnInit, OnDestroy {
  pCCommentThreads: IPCCommentThread[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected pCCommentThreadService: PCCommentThreadService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.pCCommentThreadService
      .query()
      .pipe(
        filter((res: HttpResponse<IPCCommentThread[]>) => res.ok),
        map((res: HttpResponse<IPCCommentThread[]>) => res.body)
      )
      .subscribe(
        (res: IPCCommentThread[]) => {
          this.pCCommentThreads = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPCCommentThreads();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPCCommentThread) {
    return item.id;
  }

  registerChangeInPCCommentThreads() {
    this.eventSubscriber = this.eventManager.subscribe('pCCommentThreadListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
