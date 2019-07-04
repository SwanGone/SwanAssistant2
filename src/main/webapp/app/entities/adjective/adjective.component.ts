import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAdjective } from 'app/shared/model/adjective.model';
import { AccountService } from 'app/core';
import { AdjectiveService } from './adjective.service';

@Component({
  selector: 'jhi-adjective',
  templateUrl: './adjective.component.html'
})
export class AdjectiveComponent implements OnInit, OnDestroy {
  adjectives: IAdjective[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected adjectiveService: AdjectiveService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.adjectiveService
      .query()
      .pipe(
        filter((res: HttpResponse<IAdjective[]>) => res.ok),
        map((res: HttpResponse<IAdjective[]>) => res.body)
      )
      .subscribe(
        (res: IAdjective[]) => {
          this.adjectives = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInAdjectives();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IAdjective) {
    return item.id;
  }

  registerChangeInAdjectives() {
    this.eventSubscriber = this.eventManager.subscribe('adjectiveListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
