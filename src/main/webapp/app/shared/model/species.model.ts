import { Moment } from 'moment';
import { IRemarks } from 'app/shared/model/remarks.model';
import { IUser } from 'app/core/user/user.model';

export interface ISpecies {
  id?: number;
  name?: string;
  physicalCharacteristics?: string;
  dateAdded?: Moment;
  inCirculation?: boolean;
  remarks?: IRemarks;
  createdBy?: IUser;
  viewableBies?: IUser[];
}

export class Species implements ISpecies {
  constructor(
    public id?: number,
    public name?: string,
    public physicalCharacteristics?: string,
    public dateAdded?: Moment,
    public inCirculation?: boolean,
    public remarks?: IRemarks,
    public createdBy?: IUser,
    public viewableBies?: IUser[]
  ) {
    this.inCirculation = this.inCirculation || false;
  }
}
