import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Backstory } from 'app/shared/model/backstory.model';
import { BackstoryService } from './backstory.service';
import { BackstoryComponent } from './backstory.component';
import { BackstoryDetailComponent } from './backstory-detail.component';
import { BackstoryUpdateComponent } from './backstory-update.component';
import { BackstoryDeletePopupComponent } from './backstory-delete-dialog.component';
import { IBackstory } from 'app/shared/model/backstory.model';

@Injectable({ providedIn: 'root' })
export class BackstoryResolve implements Resolve<IBackstory> {
  constructor(private service: BackstoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBackstory> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Backstory>) => response.ok),
        map((backstory: HttpResponse<Backstory>) => backstory.body)
      );
    }
    return of(new Backstory());
  }
}

export const backstoryRoute: Routes = [
  {
    path: '',
    component: BackstoryComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Backstories'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: BackstoryDetailComponent,
    resolve: {
      backstory: BackstoryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Backstories'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: BackstoryUpdateComponent,
    resolve: {
      backstory: BackstoryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Backstories'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: BackstoryUpdateComponent,
    resolve: {
      backstory: BackstoryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Backstories'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const backstoryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: BackstoryDeletePopupComponent,
    resolve: {
      backstory: BackstoryResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Backstories'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
