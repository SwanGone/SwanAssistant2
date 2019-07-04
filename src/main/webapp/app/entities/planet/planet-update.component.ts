import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IPlanet, Planet } from 'app/shared/model/planet.model';
import { PlanetService } from './planet.service';
import { IRemarks } from 'app/shared/model/remarks.model';
import { RemarksService } from 'app/entities/remarks';
import { IUser, UserService } from 'app/core';
import { IHexSector } from 'app/shared/model/hex-sector.model';
import { HexSectorService } from 'app/entities/hex-sector';

@Component({
  selector: 'jhi-planet-update',
  templateUrl: './planet-update.component.html'
})
export class PlanetUpdateComponent implements OnInit {
  isSaving: boolean;

  remarks: IRemarks[];

  users: IUser[];

  hexsectors: IHexSector[];

  editForm = this.fb.group({
    id: [],
    name: [],
    dateAdded: [],
    hasUnobtainium: [],
    inCirculation: [],
    remarks: [],
    createdBy: [],
    locatedIn: [],
    viewableBies: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected planetService: PlanetService,
    protected remarksService: RemarksService,
    protected userService: UserService,
    protected hexSectorService: HexSectorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ planet }) => {
      this.updateForm(planet);
    });
    this.remarksService
      .query({ filter: 'planet-is-null' })
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
    this.hexSectorService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IHexSector[]>) => mayBeOk.ok),
        map((response: HttpResponse<IHexSector[]>) => response.body)
      )
      .subscribe((res: IHexSector[]) => (this.hexsectors = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(planet: IPlanet) {
    this.editForm.patchValue({
      id: planet.id,
      name: planet.name,
      dateAdded: planet.dateAdded != null ? planet.dateAdded.format(DATE_TIME_FORMAT) : null,
      hasUnobtainium: planet.hasUnobtainium,
      inCirculation: planet.inCirculation,
      remarks: planet.remarks,
      createdBy: planet.createdBy,
      locatedIn: planet.locatedIn,
      viewableBies: planet.viewableBies
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const planet = this.createFromForm();
    if (planet.id !== undefined) {
      this.subscribeToSaveResponse(this.planetService.update(planet));
    } else {
      this.subscribeToSaveResponse(this.planetService.create(planet));
    }
  }

  private createFromForm(): IPlanet {
    return {
      ...new Planet(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined,
      hasUnobtainium: this.editForm.get(['hasUnobtainium']).value,
      inCirculation: this.editForm.get(['inCirculation']).value,
      remarks: this.editForm.get(['remarks']).value,
      createdBy: this.editForm.get(['createdBy']).value,
      locatedIn: this.editForm.get(['locatedIn']).value,
      viewableBies: this.editForm.get(['viewableBies']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlanet>>) {
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

  trackRemarksById(index: number, item: IRemarks) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackHexSectorById(index: number, item: IHexSector) {
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
