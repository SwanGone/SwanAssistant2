import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IGMComment } from 'app/shared/model/gm-comment.model';

type EntityResponseType = HttpResponse<IGMComment>;
type EntityArrayResponseType = HttpResponse<IGMComment[]>;

@Injectable({ providedIn: 'root' })
export class GMCommentService {
  public resourceUrl = SERVER_API_URL + 'api/gm-comments';

  constructor(protected http: HttpClient) {}

  create(gMComment: IGMComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gMComment);
    return this.http
      .post<IGMComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(gMComment: IGMComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gMComment);
    return this.http
      .put<IGMComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGMComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGMComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(gMComment: IGMComment): IGMComment {
    const copy: IGMComment = Object.assign({}, gMComment, {
      dateAdded: gMComment.dateAdded != null && gMComment.dateAdded.isValid() ? gMComment.dateAdded.toJSON() : null
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
      res.body.forEach((gMComment: IGMComment) => {
        gMComment.dateAdded = gMComment.dateAdded != null ? moment(gMComment.dateAdded) : null;
      });
    }
    return res;
  }
}
