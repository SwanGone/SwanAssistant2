import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Planet } from 'app/shared/model/planet.model';
import { PlanetService } from './planet.service';
import { PlanetComponent } from './planet.component';
import { PlanetDetailComponent } from './planet-detail.component';
import { PlanetUpdateComponent } from './planet-update.component';
import { PlanetDeletePopupComponent } from './planet-delete-dialog.component';
import { IPlanet } from 'app/shared/model/planet.model';

@Injectable({ providedIn: 'root' })
export class PlanetResolve implements Resolve<IPlanet> {
  constructor(private service: PlanetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPlanet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Planet>) => response.ok),
        map((planet: HttpResponse<Planet>) => planet.body)
      );
    }
    return of(new Planet());
  }
}

export const planetRoute: Routes = [
  {
    path: '',
    component: PlanetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Planets'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PlanetDetailComponent,
    resolve: {
      planet: PlanetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Planets'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PlanetUpdateComponent,
    resolve: {
      planet: PlanetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Planets'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PlanetUpdateComponent,
    resolve: {
      planet: PlanetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Planets'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const planetPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PlanetDeletePopupComponent,
    resolve: {
      planet: PlanetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Planets'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
