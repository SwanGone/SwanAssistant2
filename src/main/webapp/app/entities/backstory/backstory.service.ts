import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBackstory } from 'app/shared/model/backstory.model';

type EntityResponseType = HttpResponse<IBackstory>;
type EntityArrayResponseType = HttpResponse<IBackstory[]>;

@Injectable({ providedIn: 'root' })
export class BackstoryService {
  public resourceUrl = SERVER_API_URL + 'api/backstories';

  constructor(protected http: HttpClient) {}

  create(backstory: IBackstory): Observable<EntityResponseType> {
    return this.http.post<IBackstory>(this.resourceUrl, backstory, { observe: 'response' });
  }

  update(backstory: IBackstory): Observable<EntityResponseType> {
    return this.http.put<IBackstory>(this.resourceUrl, backstory, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBackstory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBackstory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
