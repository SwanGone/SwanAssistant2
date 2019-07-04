import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IHexSector } from 'app/shared/model/hex-sector.model';
import { AccountService } from 'app/core';
import { HexSectorService } from './hex-sector.service';

@Component({
  selector: 'jhi-hex-sector',
  templateUrl: './hex-sector.component.html'
})
export class HexSectorComponent implements OnInit, OnDestroy {
  hexSectors: IHexSector[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected hexSectorService: HexSectorService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.hexSectorService
      .query()
      .pipe(
        filter((res: HttpResponse<IHexSector[]>) => res.ok),
        map((res: HttpResponse<IHexSector[]>) => res.body)
      )
      .subscribe(
        (res: IHexSector[]) => {
          this.hexSectors = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInHexSectors();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IHexSector) {
    return item.id;
  }

  registerChangeInHexSectors() {
    this.eventSubscriber = this.eventManager.subscribe('hexSectorListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
