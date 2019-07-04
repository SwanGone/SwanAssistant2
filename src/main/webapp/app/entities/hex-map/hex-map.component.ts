import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IHexMap } from 'app/shared/model/hex-map.model';
import { AccountService } from 'app/core';
import { HexMapService } from './hex-map.service';

@Component({
  selector: 'jhi-hex-map',
  templateUrl: './hex-map.component.html'
})
export class HexMapComponent implements OnInit, OnDestroy {
  hexMaps: IHexMap[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected hexMapService: HexMapService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.hexMapService
      .query()
      .pipe(
        filter((res: HttpResponse<IHexMap[]>) => res.ok),
        map((res: HttpResponse<IHexMap[]>) => res.body)
      )
      .subscribe(
        (res: IHexMap[]) => {
          this.hexMaps = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInHexMaps();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IHexMap) {
    return item.id;
  }

  registerChangeInHexMaps() {
    this.eventSubscriber = this.eventManager.subscribe('hexMapListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
