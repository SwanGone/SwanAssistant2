import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GeneralInfo } from 'app/shared/model/general-info.model';
import { GeneralInfoService } from './general-info.service';
import { GeneralInfoComponent } from './general-info.component';
import { GeneralInfoDetailComponent } from './general-info-detail.component';
import { GeneralInfoUpdateComponent } from './general-info-update.component';
import { GeneralInfoDeletePopupComponent } from './general-info-delete-dialog.component';
import { IGeneralInfo } from 'app/shared/model/general-info.model';

@Injectable({ providedIn: 'root' })
export class GeneralInfoResolve implements Resolve<IGeneralInfo> {
  constructor(private service: GeneralInfoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGeneralInfo> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<GeneralInfo>) => response.ok),
        map((generalInfo: HttpResponse<GeneralInfo>) => generalInfo.body)
      );
    }
    return of(new GeneralInfo());
  }
}

export const generalInfoRoute: Routes = [
  {
    path: '',
    component: GeneralInfoComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GeneralInfos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GeneralInfoDetailComponent,
    resolve: {
      generalInfo: GeneralInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GeneralInfos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: GeneralInfoUpdateComponent,
    resolve: {
      generalInfo: GeneralInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GeneralInfos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: GeneralInfoUpdateComponent,
    resolve: {
      generalInfo: GeneralInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GeneralInfos'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const generalInfoPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: GeneralInfoDeletePopupComponent,
    resolve: {
      generalInfo: GeneralInfoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GeneralInfos'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
