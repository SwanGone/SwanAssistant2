import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IRemarks } from 'app/shared/model/remarks.model';
import { AccountService } from 'app/core';
import { RemarksService } from './remarks.service';

@Component({
  selector: 'jhi-remarks',
  templateUrl: './remarks.component.html'
})
export class RemarksComponent implements OnInit, OnDestroy {
  remarks: IRemarks[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected remarksService: RemarksService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.remarksService
      .query()
      .pipe(
        filter((res: HttpResponse<IRemarks[]>) => res.ok),
        map((res: HttpResponse<IRemarks[]>) => res.body)
      )
      .subscribe(
        (res: IRemarks[]) => {
          this.remarks = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInRemarks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IRemarks) {
    return item.id;
  }

  registerChangeInRemarks() {
    this.eventSubscriber = this.eventManager.subscribe('remarksListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
