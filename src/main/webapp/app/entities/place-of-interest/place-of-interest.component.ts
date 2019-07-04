import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPlaceOfInterest } from 'app/shared/model/place-of-interest.model';
import { AccountService } from 'app/core';
import { PlaceOfInterestService } from './place-of-interest.service';

@Component({
  selector: 'jhi-place-of-interest',
  templateUrl: './place-of-interest.component.html'
})
export class PlaceOfInterestComponent implements OnInit, OnDestroy {
  placeOfInterests: IPlaceOfInterest[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected placeOfInterestService: PlaceOfInterestService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.placeOfInterestService
      .query()
      .pipe(
        filter((res: HttpResponse<IPlaceOfInterest[]>) => res.ok),
        map((res: HttpResponse<IPlaceOfInterest[]>) => res.body)
      )
      .subscribe(
        (res: IPlaceOfInterest[]) => {
          this.placeOfInterests = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPlaceOfInterests();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPlaceOfInterest) {
    return item.id;
  }

  registerChangeInPlaceOfInterests() {
    this.eventSubscriber = this.eventManager.subscribe('placeOfInterestListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
