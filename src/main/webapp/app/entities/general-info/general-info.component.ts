import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGeneralInfo } from 'app/shared/model/general-info.model';
import { AccountService } from 'app/core';
import { GeneralInfoService } from './general-info.service';

@Component({
  selector: 'jhi-general-info',
  templateUrl: './general-info.component.html'
})
export class GeneralInfoComponent implements OnInit, OnDestroy {
  generalInfos: IGeneralInfo[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected generalInfoService: GeneralInfoService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.generalInfoService
      .query()
      .pipe(
        filter((res: HttpResponse<IGeneralInfo[]>) => res.ok),
        map((res: HttpResponse<IGeneralInfo[]>) => res.body)
      )
      .subscribe(
        (res: IGeneralInfo[]) => {
          this.generalInfos = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInGeneralInfos();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IGeneralInfo) {
    return item.id;
  }

  registerChangeInGeneralInfos() {
    this.eventSubscriber = this.eventManager.subscribe('generalInfoListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
