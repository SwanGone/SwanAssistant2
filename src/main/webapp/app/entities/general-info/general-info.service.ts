import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IGeneralInfo } from 'app/shared/model/general-info.model';

type EntityResponseType = HttpResponse<IGeneralInfo>;
type EntityArrayResponseType = HttpResponse<IGeneralInfo[]>;

@Injectable({ providedIn: 'root' })
export class GeneralInfoService {
  public resourceUrl = SERVER_API_URL + 'api/general-infos';

  constructor(protected http: HttpClient) {}

  create(generalInfo: IGeneralInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(generalInfo);
    return this.http
      .post<IGeneralInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(generalInfo: IGeneralInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(generalInfo);
    return this.http
      .put<IGeneralInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGeneralInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGeneralInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(generalInfo: IGeneralInfo): IGeneralInfo {
    const copy: IGeneralInfo = Object.assign({}, generalInfo, {
      dateAdded: generalInfo.dateAdded != null && generalInfo.dateAdded.isValid() ? generalInfo.dateAdded.toJSON() : null
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
      res.body.forEach((generalInfo: IGeneralInfo) => {
        generalInfo.dateAdded = generalInfo.dateAdded != null ? moment(generalInfo.dateAdded) : null;
      });
    }
    return res;
  }
}
