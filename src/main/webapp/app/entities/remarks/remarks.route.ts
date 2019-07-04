import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Remarks } from 'app/shared/model/remarks.model';
import { RemarksService } from './remarks.service';
import { RemarksComponent } from './remarks.component';
import { RemarksDetailComponent } from './remarks-detail.component';
import { RemarksUpdateComponent } from './remarks-update.component';
import { RemarksDeletePopupComponent } from './remarks-delete-dialog.component';
import { IRemarks } from 'app/shared/model/remarks.model';

@Injectable({ providedIn: 'root' })
export class RemarksResolve implements Resolve<IRemarks> {
  constructor(private service: RemarksService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRemarks> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Remarks>) => response.ok),
        map((remarks: HttpResponse<Remarks>) => remarks.body)
      );
    }
    return of(new Remarks());
  }
}

export const remarksRoute: Routes = [
  {
    path: '',
    component: RemarksComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Remarks'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: RemarksDetailComponent,
    resolve: {
      remarks: RemarksResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Remarks'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: RemarksUpdateComponent,
    resolve: {
      remarks: RemarksResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Remarks'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: RemarksUpdateComponent,
    resolve: {
      remarks: RemarksResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Remarks'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const remarksPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: RemarksDeletePopupComponent,
    resolve: {
      remarks: RemarksResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Remarks'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
