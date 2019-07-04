import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGMComment } from 'app/shared/model/gm-comment.model';
import { AccountService } from 'app/core';
import { GMCommentService } from './gm-comment.service';

@Component({
  selector: 'jhi-gm-comment',
  templateUrl: './gm-comment.component.html'
})
export class GMCommentComponent implements OnInit, OnDestroy {
  gMComments: IGMComment[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected gMCommentService: GMCommentService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.gMCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<IGMComment[]>) => res.ok),
        map((res: HttpResponse<IGMComment[]>) => res.body)
      )
      .subscribe(
        (res: IGMComment[]) => {
          this.gMComments = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInGMComments();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IGMComment) {
    return item.id;
  }

  registerChangeInGMComments() {
    this.eventSubscriber = this.eventManager.subscribe('gMCommentListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
