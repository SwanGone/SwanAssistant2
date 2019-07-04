import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICharacter, Character } from 'app/shared/model/character.model';
import { CharacterService } from './character.service';
import { IBackstory } from 'app/shared/model/backstory.model';
import { BackstoryService } from 'app/entities/backstory';
import { IRemarks } from 'app/shared/model/remarks.model';
import { RemarksService } from 'app/entities/remarks';
import { IUser, UserService } from 'app/core';
import { IPlanet } from 'app/shared/model/planet.model';
import { PlanetService } from 'app/entities/planet';

@Component({
  selector: 'jhi-character-update',
  templateUrl: './character-update.component.html'
})
export class CharacterUpdateComponent implements OnInit {
  isSaving: boolean;

  origins: IBackstory[];

  remarks: IRemarks[];

  users: IUser[];

  planets: IPlanet[];

  editForm = this.fb.group({
    id: [],
    name: [],
    inCirculation: [],
    isMostCurrent: [],
    isPlayerCharacter: [],
    isDiplomat: [],
    origin: [],
    remarks: [],
    createdBy: [],
    currentLocation: [],
    viewableBies: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected characterService: CharacterService,
    protected backstoryService: BackstoryService,
    protected remarksService: RemarksService,
    protected userService: UserService,
    protected planetService: PlanetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ character }) => {
      this.updateForm(character);
    });
    this.backstoryService
      .query({ filter: 'character-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IBackstory[]>) => mayBeOk.ok),
        map((response: HttpResponse<IBackstory[]>) => response.body)
      )
      .subscribe(
        (res: IBackstory[]) => {
          if (!this.editForm.get('origin').value || !this.editForm.get('origin').value.id) {
            this.origins = res;
          } else {
            this.backstoryService
              .find(this.editForm.get('origin').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IBackstory>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IBackstory>) => subResponse.body)
              )
              .subscribe(
                (subRes: IBackstory) => (this.origins = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.remarksService
      .query({ filter: 'character-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IRemarks[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRemarks[]>) => response.body)
      )
      .subscribe(
        (res: IRemarks[]) => {
          if (!this.editForm.get('remarks').value || !this.editForm.get('remarks').value.id) {
            this.remarks = res;
          } else {
            this.remarksService
              .find(this.editForm.get('remarks').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IRemarks>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IRemarks>) => subResponse.body)
              )
              .subscribe(
                (subRes: IRemarks) => (this.remarks = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.planetService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPlanet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPlanet[]>) => response.body)
      )
      .subscribe((res: IPlanet[]) => (this.planets = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(character: ICharacter) {
    this.editForm.patchValue({
      id: character.id,
      name: character.name,
      inCirculation: character.inCirculation,
      isMostCurrent: character.isMostCurrent,
      isPlayerCharacter: character.isPlayerCharacter,
      isDiplomat: character.isDiplomat,
      origin: character.origin,
      remarks: character.remarks,
      createdBy: character.createdBy,
      currentLocation: character.currentLocation,
      viewableBies: character.viewableBies
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const character = this.createFromForm();
    if (character.id !== undefined) {
      this.subscribeToSaveResponse(this.characterService.update(character));
    } else {
      this.subscribeToSaveResponse(this.characterService.create(character));
    }
  }

  private createFromForm(): ICharacter {
    return {
      ...new Character(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      inCirculation: this.editForm.get(['inCirculation']).value,
      isMostCurrent: this.editForm.get(['isMostCurrent']).value,
      isPlayerCharacter: this.editForm.get(['isPlayerCharacter']).value,
      isDiplomat: this.editForm.get(['isDiplomat']).value,
      origin: this.editForm.get(['origin']).value,
      remarks: this.editForm.get(['remarks']).value,
      createdBy: this.editForm.get(['createdBy']).value,
      currentLocation: this.editForm.get(['currentLocation']).value,
      viewableBies: this.editForm.get(['viewableBies']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharacter>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackBackstoryById(index: number, item: IBackstory) {
    return item.id;
  }

  trackRemarksById(index: number, item: IRemarks) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackPlanetById(index: number, item: IPlanet) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
