import { Moment } from 'moment';
import { IRemarks } from 'app/shared/model/remarks.model';
import { IUser } from 'app/core/user/user.model';
import { IHexSector } from 'app/shared/model/hex-sector.model';

export interface IPlanet {
  id?: number;
  name?: string;
  dateAdded?: Moment;
  hasUnobtainium?: boolean;
  inCirculation?: boolean;
  remarks?: IRemarks;
  createdBy?: IUser;
  locatedIn?: IHexSector;
  viewableBies?: IUser[];
}

export class Planet implements IPlanet {
  constructor(
    public id?: number,
    public name?: string,
    public dateAdded?: Moment,
    public hasUnobtainium?: boolean,
    public inCirculation?: boolean,
    public remarks?: IRemarks,
    public createdBy?: IUser,
    public locatedIn?: IHexSector,
    public viewableBies?: IUser[]
  ) {
    this.hasUnobtainium = this.hasUnobtainium || false;
    this.inCirculation = this.inCirculation || false;
  }
}
