import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Occupation } from 'app/shared/model/occupation.model';
import { OccupationService } from './occupation.service';
import { OccupationComponent } from './occupation.component';
import { OccupationDetailComponent } from './occupation-detail.component';
import { OccupationUpdateComponent } from './occupation-update.component';
import { OccupationDeletePopupComponent } from './occupation-delete-dialog.component';
import { IOccupation } from 'app/shared/model/occupation.model';

@Injectable({ providedIn: 'root' })
export class OccupationResolve implements Resolve<IOccupation> {
  constructor(private service: OccupationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOccupation> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Occupation>) => response.ok),
        map((occupation: HttpResponse<Occupation>) => occupation.body)
      );
    }
    return of(new Occupation());
  }
}

export const occupationRoute: Routes = [
  {
    path: '',
    component: OccupationComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Occupations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OccupationDetailComponent,
    resolve: {
      occupation: OccupationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Occupations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OccupationUpdateComponent,
    resolve: {
      occupation: OccupationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Occupations'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OccupationUpdateComponent,
    resolve: {
      occupation: OccupationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Occupations'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const occupationPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OccupationDeletePopupComponent,
    resolve: {
      occupation: OccupationResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Occupations'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
