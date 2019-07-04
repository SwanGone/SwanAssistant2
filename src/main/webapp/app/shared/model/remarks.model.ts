import { IGMComment } from 'app/shared/model/gm-comment.model';
import { IGeneralInfo } from 'app/shared/model/general-info.model';

export interface IRemarks {
  id?: number;
  title?: string;
  gmComment?: IGMComment;
  generalInfo?: IGeneralInfo;
}

export class Remarks implements IRemarks {
  constructor(public id?: number, public title?: string, public gmComment?: IGMComment, public generalInfo?: IGeneralInfo) {}
}
