import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOccupation } from 'app/shared/model/occupation.model';

type EntityResponseType = HttpResponse<IOccupation>;
type EntityArrayResponseType = HttpResponse<IOccupation[]>;

@Injectable({ providedIn: 'root' })
export class OccupationService {
  public resourceUrl = SERVER_API_URL + 'api/occupations';

  constructor(protected http: HttpClient) {}

  create(occupation: IOccupation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(occupation);
    return this.http
      .post<IOccupation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(occupation: IOccupation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(occupation);
    return this.http
      .put<IOccupation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOccupation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOccupation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(occupation: IOccupation): IOccupation {
    const copy: IOccupation = Object.assign({}, occupation, {
      dateAdded: occupation.dateAdded != null && occupation.dateAdded.isValid() ? occupation.dateAdded.toJSON() : null
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
      res.body.forEach((occupation: IOccupation) => {
        occupation.dateAdded = occupation.dateAdded != null ? moment(occupation.dateAdded) : null;
      });
    }
    return res;
  }
}
