import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Character } from 'app/shared/model/character.model';
import { CharacterService } from './character.service';
import { CharacterComponent } from './character.component';
import { CharacterDetailComponent } from './character-detail.component';
import { CharacterUpdateComponent } from './character-update.component';
import { CharacterDeletePopupComponent } from './character-delete-dialog.component';
import { ICharacter } from 'app/shared/model/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterResolve implements Resolve<ICharacter> {
  constructor(private service: CharacterService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICharacter> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Character>) => response.ok),
        map((character: HttpResponse<Character>) => character.body)
      );
    }
    return of(new Character());
  }
}

export const characterRoute: Routes = [
  {
    path: '',
    component: CharacterComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Characters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CharacterDetailComponent,
    resolve: {
      character: CharacterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Characters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CharacterUpdateComponent,
    resolve: {
      character: CharacterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Characters'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CharacterUpdateComponent,
    resolve: {
      character: CharacterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Characters'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const characterPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CharacterDeletePopupComponent,
    resolve: {
      character: CharacterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Characters'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
