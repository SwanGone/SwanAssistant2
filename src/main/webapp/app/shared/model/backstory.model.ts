import { IAdjective } from 'app/shared/model/adjective.model';
import { ISpecies } from 'app/shared/model/species.model';
import { IOccupation } from 'app/shared/model/occupation.model';
import { IPlanet } from 'app/shared/model/planet.model';
import { IOriginDetails } from 'app/shared/model/origin-details.model';

export interface IBackstory {
  id?: number;
  text?: string;
  adjective?: IAdjective;
  species?: ISpecies;
  occupation?: IOccupation;
  homeworld?: IPlanet;
  originDetails?: IOriginDetails;
}

export class Backstory implements IBackstory {
  constructor(
    public id?: number,
    public text?: string,
    public adjective?: IAdjective,
    public species?: ISpecies,
    public occupation?: IOccupation,
    public homeworld?: IPlanet,
    public originDetails?: IOriginDetails
  ) {}
}
