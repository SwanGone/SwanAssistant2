import { IHexMap } from 'app/shared/model/hex-map.model';

export interface IHexSector {
  id?: number;
  hexRow?: string;
  hexColumn?: string;
  coordinates?: string;
  isMapped?: boolean;
  locatedIn?: IHexMap;
}

export class HexSector implements IHexSector {
  constructor(
    public id?: number,
    public hexRow?: string,
    public hexColumn?: string,
    public coordinates?: string,
    public isMapped?: boolean,
    public locatedIn?: IHexMap
  ) {
    this.isMapped = this.isMapped || false;
  }
}
