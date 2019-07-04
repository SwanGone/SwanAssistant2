import { Moment } from 'moment';

export interface IGeneralInfo {
  id?: number;
  content?: string;
  dateAdded?: Moment;
}

export class GeneralInfo implements IGeneralInfo {
  constructor(public id?: number, public content?: string, public dateAdded?: Moment) {}
}
