import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISpecies } from 'app/shared/model/species.model';

type EntityResponseType = HttpResponse<ISpecies>;
type EntityArrayResponseType = HttpResponse<ISpecies[]>;

@Injectable({ providedIn: 'root' })
export class SpeciesService {
  public resourceUrl = SERVER_API_URL + 'api/species';

  constructor(protected http: HttpClient) {}

  create(species: ISpecies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(species);
    return this.http
      .post<ISpecies>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(species: ISpecies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(species);
    return this.http
      .put<ISpecies>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISpecies>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISpecies[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(species: ISpecies): ISpecies {
    const copy: ISpecies = Object.assign({}, species, {
      dateAdded: species.dateAdded != null && species.dateAdded.isValid() ? species.dateAdded.toJSON() : null
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
      res.body.forEach((species: ISpecies) => {
        species.dateAdded = species.dateAdded != null ? moment(species.dateAdded) : null;
      });
    }
    return res;
  }
}
