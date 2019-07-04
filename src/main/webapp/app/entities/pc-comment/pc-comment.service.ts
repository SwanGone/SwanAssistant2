import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPCComment } from 'app/shared/model/pc-comment.model';

type EntityResponseType = HttpResponse<IPCComment>;
type EntityArrayResponseType = HttpResponse<IPCComment[]>;

@Injectable({ providedIn: 'root' })
export class PCCommentService {
  public resourceUrl = SERVER_API_URL + 'api/pc-comments';

  constructor(protected http: HttpClient) {}

  create(pCComment: IPCComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pCComment);
    return this.http
      .post<IPCComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pCComment: IPCComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pCComment);
    return this.http
      .put<IPCComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPCComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPCComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(pCComment: IPCComment): IPCComment {
    const copy: IPCComment = Object.assign({}, pCComment, {
      dateAdded: pCComment.dateAdded != null && pCComment.dateAdded.isValid() ? pCComment.dateAdded.toJSON() : null
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
      res.body.forEach((pCComment: IPCComment) => {
        pCComment.dateAdded = pCComment.dateAdded != null ? moment(pCComment.dateAdded) : null;
      });
    }
    return res;
  }
}
