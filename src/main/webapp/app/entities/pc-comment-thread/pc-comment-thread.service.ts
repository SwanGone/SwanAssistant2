import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';

type EntityResponseType = HttpResponse<IPCCommentThread>;
type EntityArrayResponseType = HttpResponse<IPCCommentThread[]>;

@Injectable({ providedIn: 'root' })
export class PCCommentThreadService {
  public resourceUrl = SERVER_API_URL + 'api/pc-comment-threads';

  constructor(protected http: HttpClient) {}

  create(pCCommentThread: IPCCommentThread): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pCCommentThread);
    return this.http
      .post<IPCCommentThread>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pCCommentThread: IPCCommentThread): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pCCommentThread);
    return this.http
      .put<IPCCommentThread>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPCCommentThread>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPCCommentThread[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(pCCommentThread: IPCCommentThread): IPCCommentThread {
    const copy: IPCCommentThread = Object.assign({}, pCCommentThread, {
      dateAdded: pCCommentThread.dateAdded != null && pCCommentThread.dateAdded.isValid() ? pCCommentThread.dateAdded.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAdded = res.body.dateAdded != null ? moment(res.body.dateAdded) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pCCommentThread: IPCCommentThread) => {
        pCCommentThread.dateAdded = pCCommentThread.dateAdded != null ? moment(pCCommentThread.dateAdded) : null;
      });
    }
    return res;
  }
}
