import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Species } from 'app/shared/model/species.model';
import { SpeciesService } from './species.service';
import { SpeciesComponent } from './species.component';
import { SpeciesDetailComponent } from './species-detail.component';
import { SpeciesUpdateComponent } from './species-update.component';
import { SpeciesDeletePopupComponent } from './species-delete-dialog.component';
import { ISpecies } from 'app/shared/model/species.model';

@Injectable({ providedIn: 'root' })
export class SpeciesResolve implements Resolve<ISpecies> {
  constructor(private service: SpeciesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISpecies> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Species>) => response.ok),
        map((species: HttpResponse<Species>) => species.body)
      );
    }
    return of(new Species());
  }
}

export const speciesRoute: Routes = [
  {
    path: '',
    component: SpeciesComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Species'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: SpeciesDetailComponent,
    resolve: {
      species: SpeciesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Species'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: SpeciesUpdateComponent,
    resolve: {
      species: SpeciesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Species'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: SpeciesUpdateComponent,
    resolve: {
      species: SpeciesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Species'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const speciesPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: SpeciesDeletePopupComponent,
    resolve: {
      species: SpeciesResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Species'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
