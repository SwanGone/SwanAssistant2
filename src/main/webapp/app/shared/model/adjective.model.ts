import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IAdjective {
  id?: number;
  dateAdded?: Moment;
  content?: string;
  inCirculation?: boolean;
  createdBy?: IUser;
  viewableBies?: IUser[];
}

export class Adjective implements IAdjective {
  constructor(
    public id?: number,
    public dateAdded?: Moment,
    public content?: string,
    public inCirculation?: boolean,
    public createdBy?: IUser,
    public viewableBies?: IUser[]
  ) {
    this.inCirculation = this.inCirculation || false;
  }
}
