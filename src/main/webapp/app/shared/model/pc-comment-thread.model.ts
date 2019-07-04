import { Moment } from 'moment';
import { IRemarks } from 'app/shared/model/remarks.model';

export interface IPCCommentThread {
  id?: number;
  headline?: string;
  dateAdded?: Moment;
  existsIn?: IRemarks;
}

export class PCCommentThread implements IPCCommentThread {
  constructor(public id?: number, public headline?: string, public dateAdded?: Moment, public existsIn?: IRemarks) {}
}
