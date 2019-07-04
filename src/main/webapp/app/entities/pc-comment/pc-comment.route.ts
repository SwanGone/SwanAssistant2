import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PCComment } from 'app/shared/model/pc-comment.model';
import { PCCommentService } from './pc-comment.service';
import { PCCommentComponent } from './pc-comment.component';
import { PCCommentDetailComponent } from './pc-comment-detail.component';
import { PCCommentUpdateComponent } from './pc-comment-update.component';
import { PCCommentDeletePopupComponent } from './pc-comment-delete-dialog.component';
import { IPCComment } from 'app/shared/model/pc-comment.model';

@Injectable({ providedIn: 'root' })
export class PCCommentResolve implements Resolve<IPCComment> {
  constructor(private service: PCCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPCComment> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PCComment>) => response.ok),
        map((pCComment: HttpResponse<PCComment>) => pCComment.body)
      );
    }
    return of(new PCComment());
  }
}

export const pCCommentRoute: Routes = [
  {
    path: '',
    component: PCCommentComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCComments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PCCommentDetailComponent,
    resolve: {
      pCComment: PCCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCComments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PCCommentUpdateComponent,
    resolve: {
      pCComment: PCCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCComments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PCCommentUpdateComponent,
    resolve: {
      pCComment: PCCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCComments'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const pCCommentPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PCCommentDeletePopupComponent,
    resolve: {
      pCComment: PCCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCComments'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
