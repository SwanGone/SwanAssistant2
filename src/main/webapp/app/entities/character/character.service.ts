import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICharacter } from 'app/shared/model/character.model';

type EntityResponseType = HttpResponse<ICharacter>;
type EntityArrayResponseType = HttpResponse<ICharacter[]>;

@Injectable({ providedIn: 'root' })
export class CharacterService {
  public resourceUrl = SERVER_API_URL + 'api/characters';

  constructor(protected http: HttpClient) {}

  create(character: ICharacter): Observable<EntityResponseType> {
    return this.http.post<ICharacter>(this.resourceUrl, character, { observe: 'response' });
  }

  update(character: ICharacter): Observable<EntityResponseType> {
    return this.http.put<ICharacter>(this.resourceUrl, character, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharacter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharacter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
