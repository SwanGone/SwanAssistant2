import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OriginDetails } from 'app/shared/model/origin-details.model';
import { OriginDetailsService } from './origin-details.service';
import { OriginDetailsComponent } from './origin-details.component';
import { OriginDetailsDetailComponent } from './origin-details-detail.component';
import { OriginDetailsUpdateComponent } from './origin-details-update.component';
import { OriginDetailsDeletePopupComponent } from './origin-details-delete-dialog.component';
import { IOriginDetails } from 'app/shared/model/origin-details.model';

@Injectable({ providedIn: 'root' })
export class OriginDetailsResolve implements Resolve<IOriginDetails> {
  constructor(private service: OriginDetailsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOriginDetails> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OriginDetails>) => response.ok),
        map((originDetails: HttpResponse<OriginDetails>) => originDetails.body)
      );
    }
    return of(new OriginDetails());
  }
}

export const originDetailsRoute: Routes = [
  {
    path: '',
    component: OriginDetailsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'OriginDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OriginDetailsDetailComponent,
    resolve: {
      originDetails: OriginDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'OriginDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OriginDetailsUpdateComponent,
    resolve: {
      originDetails: OriginDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'OriginDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OriginDetailsUpdateComponent,
    resolve: {
      originDetails: OriginDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'OriginDetails'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const originDetailsPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OriginDetailsDeletePopupComponent,
    resolve: {
      originDetails: OriginDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'OriginDetails'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
