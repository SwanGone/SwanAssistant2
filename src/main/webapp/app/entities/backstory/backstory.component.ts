import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBackstory } from 'app/shared/model/backstory.model';
import { AccountService } from 'app/core';
import { BackstoryService } from './backstory.service';

@Component({
  selector: 'jhi-backstory',
  templateUrl: './backstory.component.html'
})
export class BackstoryComponent implements OnInit, OnDestroy {
  backstories: IBackstory[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected backstoryService: BackstoryService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.backstoryService
      .query()
      .pipe(
        filter((res: HttpResponse<IBackstory[]>) => res.ok),
        map((res: HttpResponse<IBackstory[]>) => res.body)
      )
      .subscribe(
        (res: IBackstory[]) => {
          this.backstories = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInBackstories();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IBackstory) {
    return item.id;
  }

  registerChangeInBackstories() {
    this.eventSubscriber = this.eventManager.subscribe('backstoryListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
