import { Moment } from 'moment';
import { IRemarks } from 'app/shared/model/remarks.model';
import { IUser } from 'app/core/user/user.model';

export interface IOccupation {
  id?: number;
  name?: string;
  dateAdded?: Moment;
  inCirculation?: boolean;
  remarks?: IRemarks;
  createdBy?: IUser;
  viewableBies?: IUser[];
}

export class Occupation implements IOccupation {
  constructor(
    public id?: number,
    public name?: string,
    public dateAdded?: Moment,
    public inCirculation?: boolean,
    public remarks?: IRemarks,
    public createdBy?: IUser,
    public viewableBies?: IUser[]
  ) {
    this.inCirculation = this.inCirculation || false;
  }
}
