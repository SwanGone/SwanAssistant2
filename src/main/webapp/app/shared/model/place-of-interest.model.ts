import { IRemarks } from 'app/shared/model/remarks.model';
import { IPlanet } from 'app/shared/model/planet.model';

export interface IPlaceOfInterest {
  id?: number;
  name?: string;
  inCirculation?: boolean;
  remarks?: IRemarks;
  locatedOn?: IPlanet;
}

export class PlaceOfInterest implements IPlaceOfInterest {
  constructor(
    public id?: number,
    public name?: string,
    public inCirculation?: boolean,
    public remarks?: IRemarks,
    public locatedOn?: IPlanet
  ) {
    this.inCirculation = this.inCirculation || false;
  }
}
