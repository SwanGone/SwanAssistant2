import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PCCommentThread } from 'app/shared/model/pc-comment-thread.model';
import { PCCommentThreadService } from './pc-comment-thread.service';
import { PCCommentThreadComponent } from './pc-comment-thread.component';
import { PCCommentThreadDetailComponent } from './pc-comment-thread-detail.component';
import { PCCommentThreadUpdateComponent } from './pc-comment-thread-update.component';
import { PCCommentThreadDeletePopupComponent } from './pc-comment-thread-delete-dialog.component';
import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';

@Injectable({ providedIn: 'root' })
export class PCCommentThreadResolve implements Resolve<IPCCommentThread> {
  constructor(private service: PCCommentThreadService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPCCommentThread> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PCCommentThread>) => response.ok),
        map((pCCommentThread: HttpResponse<PCCommentThread>) => pCCommentThread.body)
      );
    }
    return of(new PCCommentThread());
  }
}

export const pCCommentThreadRoute: Routes = [
  {
    path: '',
    component: PCCommentThreadComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCCommentThreads'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PCCommentThreadDetailComponent,
    resolve: {
      pCCommentThread: PCCommentThreadResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCCommentThreads'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PCCommentThreadUpdateComponent,
    resolve: {
      pCCommentThread: PCCommentThreadResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCCommentThreads'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PCCommentThreadUpdateComponent,
    resolve: {
      pCCommentThread: PCCommentThreadResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCCommentThreads'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const pCCommentThreadPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PCCommentThreadDeletePopupComponent,
    resolve: {
      pCCommentThread: PCCommentThreadResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'PCCommentThreads'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
