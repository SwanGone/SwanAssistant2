import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HexMap } from 'app/shared/model/hex-map.model';
import { HexMapService } from './hex-map.service';
import { HexMapComponent } from './hex-map.component';
import { HexMapDetailComponent } from './hex-map-detail.component';
import { HexMapUpdateComponent } from './hex-map-update.component';
import { HexMapDeletePopupComponent } from './hex-map-delete-dialog.component';
import { IHexMap } from 'app/shared/model/hex-map.model';

@Injectable({ providedIn: 'root' })
export class HexMapResolve implements Resolve<IHexMap> {
  constructor(private service: HexMapService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IHexMap> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<HexMap>) => response.ok),
        map((hexMap: HttpResponse<HexMap>) => hexMap.body)
      );
    }
    return of(new HexMap());
  }
}

export const hexMapRoute: Routes = [
  {
    path: '',
    component: HexMapComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexMaps'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: HexMapDetailComponent,
    resolve: {
      hexMap: HexMapResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexMaps'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: HexMapUpdateComponent,
    resolve: {
      hexMap: HexMapResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexMaps'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: HexMapUpdateComponent,
    resolve: {
      hexMap: HexMapResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexMaps'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const hexMapPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: HexMapDeletePopupComponent,
    resolve: {
      hexMap: HexMapResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'HexMaps'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
