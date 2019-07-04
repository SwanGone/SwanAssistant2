import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HexSector } from 'app/shared/model/hex-sector.model';
import { HexSectorService } from './hex-sector.service';
import { HexSectorComponent } from './hex-sector.component';
import { HexSectorDetailComponent } from './hex-sector-detail.component';
import { HexSectorUpdateComponent } from './hex-sector-update.component';
import { HexSectorDeletePopupComponent } from './hex-sector-delete-dialog.component';
import { IHexSector } from 'app/shared/model/hex-sector.model';

@Injectable({ providedIn: 'root' })
export class HexSectorResolve implements Resolve<IHexSector> {
  constructor(private service: HexSectorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IHexSector> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<HexSector>) => response.ok),
        map((hexSector: HttpResponse<HexSector>) => hexSector.body)
      );
    }
    return of(new HexSector());
  }
}

export const hexSectorRoute: Routes = [
  {
    path: '',
    component: HexSectorComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexSectors'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: HexSectorDetailComponent,
    resolve: {
      hexSector: HexSectorResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexSectors'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: HexSectorUpdateComponent,
    resolve: {
      hexSector: HexSectorResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexSectors'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: HexSectorUpdateComponent,
    resolve: {
      hexSector: HexSectorResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexSectors'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const hexSectorPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: HexSectorDeletePopupComponent,
    resolve: {
      hexSector: HexSectorResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexSectors'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
