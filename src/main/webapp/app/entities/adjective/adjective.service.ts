import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAdjective } from 'app/shared/model/adjective.model';

type EntityResponseType = HttpResponse<IAdjective>;
type EntityArrayResponseType = HttpResponse<IAdjective[]>;

@Injectable({ providedIn: 'root' })
export class AdjectiveService {
  public resourceUrl = SERVER_API_URL + 'api/adjectives';

  constructor(protected http: HttpClient) {}

  create(adjective: IAdjective): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adjective);
    return this.http
      .post<IAdjective>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(adjective: IAdjective): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(adjective);
    return this.http
      .put<IAdjective>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAdjective>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAdjective[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(adjective: IAdjective): IAdjective {
    const copy: IAdjective = Object.assign({}, adjective, {
      dateAdded: adjective.dateAdded != null && adjective.dateAdded.isValid() ? adjective.dateAdded.toJSON() : null
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
      res.body.forEach((adjective: IAdjective) => {
        adjective.dateAdded = adjective.dateAdded != null ? moment(adjective.dateAdded) : null;
      });
    }
    return res;
  }
}
