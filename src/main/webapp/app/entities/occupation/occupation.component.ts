import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOccupation } from 'app/shared/model/occupation.model';
import { AccountService } from 'app/core';
import { OccupationService } from './occupation.service';

@Component({
  selector: 'jhi-occupation',
  templateUrl: './occupation.component.html'
})
export class OccupationComponent implements OnInit, OnDestroy {
  occupations: IOccupation[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected occupationService: OccupationService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.occupationService
      .query()
      .pipe(
        filter((res: HttpResponse<IOccupation[]>) => res.ok),
        map((res: HttpResponse<IOccupation[]>) => res.body)
      )
      .subscribe(
        (res: IOccupation[]) => {
          this.occupations = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOccupations();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOccupation) {
    return item.id;
  }

  registerChangeInOccupations() {
    this.eventSubscriber = this.eventManager.subscribe('occupationListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
