import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOriginDetails } from 'app/shared/model/origin-details.model';
import { AccountService } from 'app/core';
import { OriginDetailsService } from './origin-details.service';

@Component({
  selector: 'jhi-origin-details',
  templateUrl: './origin-details.component.html'
})
export class OriginDetailsComponent implements OnInit, OnDestroy {
  originDetails: IOriginDetails[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected originDetailsService: OriginDetailsService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.originDetailsService
      .query()
      .pipe(
        filter((res: HttpResponse<IOriginDetails[]>) => res.ok),
        map((res: HttpResponse<IOriginDetails[]>) => res.body)
      )
      .subscribe(
        (res: IOriginDetails[]) => {
          this.originDetails = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOriginDetails();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOriginDetails) {
    return item.id;
  }

  registerChangeInOriginDetails() {
    this.eventSubscriber = this.eventManager.subscribe('originDetailsListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
