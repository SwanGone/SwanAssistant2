import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISpecies } from 'app/shared/model/species.model';
import { AccountService } from 'app/core';
import { SpeciesService } from './species.service';

@Component({
  selector: 'jhi-species',
  templateUrl: './species.component.html'
})
export class SpeciesComponent implements OnInit, OnDestroy {
  species: ISpecies[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected speciesService: SpeciesService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.speciesService
      .query()
      .pipe(
        filter((res: HttpResponse<ISpecies[]>) => res.ok),
        map((res: HttpResponse<ISpecies[]>) => res.body)
      )
      .subscribe(
        (res: ISpecies[]) => {
          this.species = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInSpecies();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ISpecies) {
    return item.id;
  }

  registerChangeInSpecies() {
    this.eventSubscriber = this.eventManager.subscribe('speciesListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
