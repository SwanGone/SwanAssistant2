import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PlaceOfInterest } from 'app/shared/model/place-of-interest.model';
import { PlaceOfInterestService } from './place-of-interest.service';
import { PlaceOfInterestComponent } from './place-of-interest.component';
import { PlaceOfInterestDetailComponent } from './place-of-interest-detail.component';
import { PlaceOfInterestUpdateComponent } from './place-of-interest-update.component';
import { PlaceOfInterestDeletePopupComponent } from './place-of-interest-delete-dialog.component';
import { IPlaceOfInterest } from 'app/shared/model/place-of-interest.model';

@Injectable({ providedIn: 'root' })
export class PlaceOfInterestResolve implements Resolve<IPlaceOfInterest> {
  constructor(private service: PlaceOfInterestService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlaceOfInterest> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PlaceOfInterest>) => response.ok),
        map((placeOfInterest: HttpResponse<PlaceOfInterest>) => placeOfInterest.body)
      );
    }
    return of(new PlaceOfInterest());
  }
}

export const placeOfInterestRoute: Routes = [
  {
    path: '',
    component: PlaceOfInterestComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PlaceOfInterests'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PlaceOfInterestDetailComponent,
    resolve: {
      placeOfInterest: PlaceOfInterestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PlaceOfInterests'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PlaceOfInterestUpdateComponent,
    resolve: {
      placeOfInterest: PlaceOfInterestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PlaceOfInterests'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PlaceOfInterestUpdateComponent,
    resolve: {
      placeOfInterest: PlaceOfInterestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PlaceOfInterests'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const placeOfInterestPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PlaceOfInterestDeletePopupComponent,
    resolve: {
      placeOfInterest: PlaceOfInterestResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PlaceOfInterests'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
