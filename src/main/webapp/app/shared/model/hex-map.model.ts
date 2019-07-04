export interface IHexMap {
  id?: number;
  seed?: string;
}

export class HexMap implements IHexMap {
  constructor(public id?: number, public seed?: string) {}
}
