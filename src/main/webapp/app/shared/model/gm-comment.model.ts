import { Moment } from 'moment';

export interface IGMComment {
  id?: number;
  content?: string;
  dateAdded?: Moment;
}

export class GMComment implements IGMComment {
  constructor(public id?: number, public content?: string, public dateAdded?: Moment) {}
}
