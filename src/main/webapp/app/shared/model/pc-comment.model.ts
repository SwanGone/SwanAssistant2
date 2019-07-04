import { Moment } from 'moment';
import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';

export interface IPCComment {
  id?: number;
  content?: string;
  dateAdded?: Moment;
  existsIn?: IPCCommentThread;
}

export class PCComment implements IPCComment {
  constructor(public id?: number, public content?: string, public dateAdded?: Moment, public existsIn?: IPCCommentThread) {}
}
