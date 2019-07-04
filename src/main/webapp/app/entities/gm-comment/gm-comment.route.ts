import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GMComment } from 'app/shared/model/gm-comment.model';
import { GMCommentService } from './gm-comment.service';
import { GMCommentComponent } from './gm-comment.component';
import { GMCommentDetailComponent } from './gm-comment-detail.component';
import { GMCommentUpdateComponent } from './gm-comment-update.component';
import { GMCommentDeletePopupComponent } from './gm-comment-delete-dialog.component';
import { IGMComment } from 'app/shared/model/gm-comment.model';

@Injectable({ providedIn: 'root' })
export class GMCommentResolve implements Resolve<IGMComment> {
  constructor(private service: GMCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGMComment> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<GMComment>) => response.ok),
        map((gMComment: HttpResponse<GMComment>) => gMComment.body)
      );
    }
    return of(new GMComment());
  }
}

export const gMCommentRoute: Routes = [
  {
    path: '',
    component: GMCommentComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GMComments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GMCommentDetailComponent,
    resolve: {
      gMComment: GMCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GMComments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: GMCommentUpdateComponent,
    resolve: {
      gMComment: GMCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GMComments'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: GMCommentUpdateComponent,
    resolve: {
      gMComment: GMCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GMComments'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const gMCommentPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: GMCommentDeletePopupComponent,
    resolve: {
      gMComment: GMCommentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GMComments'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
