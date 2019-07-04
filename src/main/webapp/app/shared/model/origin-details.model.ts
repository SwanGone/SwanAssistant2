import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IOriginDetails {
  id?: number;
  content?: string;
  dateAdded?: Moment;
  inCirculation?: boolean;
  createdBy?: IUser;
  viewableBies?: IUser[];
}

export class OriginDetails implements IOriginDetails {
  constructor(
    public id?: number,
    public content?: string,
    public dateAdded?: Moment,
    public inCirculation?: boolean,
    public createdBy?: IUser,
    public viewableBies?: IUser[]
  ) {
    this.inCirculation = this.inCirculation || false;
  }
}
