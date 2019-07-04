import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IHexMap } from 'app/shared/model/hex-map.model';

type EntityResponseType = HttpResponse<IHexMap>;
type EntityArrayResponseType = HttpResponse<IHexMap[]>;

@Injectable({ providedIn: 'root' })
export class HexMapService {
  public resourceUrl = SERVER_API_URL + 'api/hex-maps';

  constructor(protected http: HttpClient) {}

  create(hexMap: IHexMap): Observable<EntityResponseType> {
    return this.http.post<IHexMap>(this.resourceUrl, hexMap, { observe: 'response' });
  }

  update(hexMap: IHexMap): Observable<EntityResponseType> {
    return this.http.put<IHexMap>(this.resourceUrl, hexMap, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHexMap>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHexMap[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
