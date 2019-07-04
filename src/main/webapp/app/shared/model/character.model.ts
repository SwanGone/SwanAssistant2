import { IBackstory } from 'app/shared/model/backstory.model';
import { IRemarks } from 'app/shared/model/remarks.model';
import { IUser } from 'app/core/user/user.model';
import { IPlanet } from 'app/shared/model/planet.model';

export interface ICharacter {
  id?: number;
  name?: string;
  inCirculation?: boolean;
  isMostCurrent?: boolean;
  isPlayerCharacter?: boolean;
  isDiplomat?: boolean;
  origin?: IBackstory;
  remarks?: IRemarks;
  createdBy?: IUser;
  currentLocation?: IPlanet;
  viewableBies?: IUser[];
}

export class Character implements ICharacter {
  constructor(
    public id?: number,
    public name?: string,
    public inCirculation?: boolean,
    public isMostCurrent?: boolean,
    public isPlayerCharacter?: boolean,
    public isDiplomat?: boolean,
    public origin?: IBackstory,
    public remarks?: IRemarks,
    public createdBy?: IUser,
    public currentLocation?: IPlanet,
    public viewableBies?: IUser[]
  ) {
    this.inCirculation = this.inCirculation || false;
    this.isMostCurrent = this.isMostCurrent || false;
    this.isPlayerCharacter = this.isPlayerCharacter || false;
    this.isDiplomat = this.isDiplomat || false;
  }
}
