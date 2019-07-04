import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPlanet } from 'app/shared/model/planet.model';

type EntityResponseType = HttpResponse<IPlanet>;
type EntityArrayResponseType = HttpResponse<IPlanet[]>;

@Injectable({ providedIn: 'root' })
export class PlanetService {
  public resourceUrl = SERVER_API_URL + 'api/planets';

  constructor(protected http: HttpClient) {}

  create(planet: IPlanet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(planet);
    return this.http
      .post<IPlanet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(planet: IPlanet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(planet);
    return this.http
      .put<IPlanet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPlanet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlanet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(planet: IPlanet): IPlanet {
    const copy: IPlanet = Object.assign({}, planet, {
      dateAdded: planet.dateAdded != null && planet.dateAdded.isValid() ? planet.dateAdded.toJSON() : null
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
      res.body.forEach((planet: IPlanet) => {
        planet.dateAdded = planet.dateAdded != null ? moment(planet.dateAdded) : null;
      });
    }
    return res;
  }
}
