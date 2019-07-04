import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICharacter } from 'app/shared/model/character.model';
import { AccountService } from 'app/core';
import { CharacterService } from './character.service';

@Component({
  selector: 'jhi-character',
  templateUrl: './character.component.html'
})
export class CharacterComponent implements OnInit, OnDestroy {
  characters: ICharacter[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected characterService: CharacterService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.characterService
      .query()
      .pipe(
        filter((res: HttpResponse<ICharacter[]>) => res.ok),
        map((res: HttpResponse<ICharacter[]>) => res.body)
      )
      .subscribe(
        (res: ICharacter[]) => {
          this.characters = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCharacters();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICharacter) {
    return item.id;
  }

  registerChangeInCharacters() {
    this.eventSubscriber = this.eventManager.subscribe('characterListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
