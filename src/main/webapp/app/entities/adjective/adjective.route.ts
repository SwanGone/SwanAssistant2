import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Adjective } from 'app/shared/model/adjective.model';
import { AdjectiveService } from './adjective.service';
import { AdjectiveComponent } from './adjective.component';
import { AdjectiveDetailComponent } from './adjective-detail.component';
import { AdjectiveUpdateComponent } from './adjective-update.component';
import { AdjectiveDeletePopupComponent } from './adjective-delete-dialog.component';
import { IAdjective } from 'app/shared/model/adjective.model';
import { AdjectiveUpdateUserComponent } from 'app/entities/adjective/adjective-update-user.component';

@Injectable({ providedIn: 'root' })
export class AdjectiveResolve implements Resolve<IAdjective> {
  constructor(private service: AdjectiveService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAdjective> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Adjective>) => response.ok),
        map((adjective: HttpResponse<Adjective>) => adjective.body)
      );
    }
    return of(new Adjective());
  }
}

export const adjectiveRoute: Routes = [
  {
    path: '',
    component: AdjectiveComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Adjectives'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: AdjectiveDetailComponent,
    resolve: {
      adjective: AdjectiveResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Adjectives'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: AdjectiveUpdateComponent,
    resolve: {
      adjective: AdjectiveResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Adjectives'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'submitnew',
    component: AdjectiveUpdateUserComponent,
    resolve: {
      adjective: AdjectiveResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Adjectives'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: AdjectiveUpdateComponent,
    resolve: {
      adjective: AdjectiveResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Adjectives'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const adjectivePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: AdjectiveDeletePopupComponent,
    resolve: {
      adjective: AdjectiveResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Adjectives'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
