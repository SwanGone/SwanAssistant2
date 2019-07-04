import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IRemarks } from 'app/shared/model/remarks.model';

type EntityResponseType = HttpResponse<IRemarks>;
type EntityArrayResponseType = HttpResponse<IRemarks[]>;

@Injectable({ providedIn: 'root' })
export class RemarksService {
  public resourceUrl = SERVER_API_URL + 'api/remarks';

  constructor(protected http: HttpClient) {}

  create(remarks: IRemarks): Observable<EntityResponseType> {
    return this.http.post<IRemarks>(this.resourceUrl, remarks, { observe: 'response' });
  }

  update(remarks: IRemarks): Observable<EntityResponseType> {
    return this.http.put<IRemarks>(this.resourceUrl, remarks, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRemarks>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRemarks[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
