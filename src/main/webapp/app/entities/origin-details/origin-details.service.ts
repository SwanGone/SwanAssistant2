import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOriginDetails } from 'app/shared/model/origin-details.model';

type EntityResponseType = HttpResponse<IOriginDetails>;
type EntityArrayResponseType = HttpResponse<IOriginDetails[]>;

@Injectable({ providedIn: 'root' })
export class OriginDetailsService {
  public resourceUrl = SERVER_API_URL + 'api/origin-details';

  constructor(protected http: HttpClient) {}

  create(originDetails: IOriginDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(originDetails);
    return this.http
      .post<IOriginDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(originDetails: IOriginDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(originDetails);
    return this.http
      .put<IOriginDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOriginDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOriginDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(originDetails: IOriginDetails): IOriginDetails {
    const copy: IOriginDetails = Object.assign({}, originDetails, {
      dateAdded: originDetails.dateAdded != null && originDetails.dateAdded.isValid() ? originDetails.dateAdded.toJSON() : null
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
      res.body.forEach((originDetails: IOriginDetails) => {
        originDetails.dateAdded = originDetails.dateAdded != null ? moment(originDetails.dateAdded) : null;
      });
    }
    return res;
  }
}
