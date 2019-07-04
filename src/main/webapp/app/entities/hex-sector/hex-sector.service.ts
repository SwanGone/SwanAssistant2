import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IHexSector } from 'app/shared/model/hex-sector.model';

type EntityResponseType = HttpResponse<IHexSector>;
type EntityArrayResponseType = HttpResponse<IHexSector[]>;

@Injectable({ providedIn: 'root' })
export class HexSectorService {
  public resourceUrl = SERVER_API_URL + 'api/hex-sectors';

  constructor(protected http: HttpClient) {}

  create(hexSector: IHexSector): Observable<EntityResponseType> {
    return this.http.post<IHexSector>(this.resourceUrl, hexSector, { observe: 'response' });
  }

  update(hexSector: IHexSector): Observable<EntityResponseType> {
    return this.http.put<IHexSector>(this.resourceUrl, hexSector, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHexSector>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHexSector[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
