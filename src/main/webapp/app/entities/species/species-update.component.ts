import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { ISpecies, Species } from 'app/shared/model/species.model';
import { SpeciesService } from './species.service';
import { IRemarks } from 'app/shared/model/remarks.model';
import { RemarksService } from 'app/entities/remarks';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-species-update',
  templateUrl: './species-update.component.html'
})
export class SpeciesUpdateComponent implements OnInit {
  isSaving: boolean;

  remarks: IRemarks[];

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    name: [],
    physicalCharacteristics: [],
    dateAdded: [],
    inCirculation: [],
    remarks: [],
    createdBy: [],
    viewableBies: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected speciesService: SpeciesService,
    protected remarksService: RemarksService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ species }) => {
      this.updateForm(species);
    });
    this.remarksService
      .query({ filter: 'species-is-null' })
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
  }

  updateForm(species: ISpecies) {
    this.editForm.patchValue({
      id: species.id,
      name: species.name,
      physicalCharacteristics: species.physicalCharacteristics,
      dateAdded: species.dateAdded != null ? species.dateAdded.format(DATE_TIME_FORMAT) : null,
      inCirculation: species.inCirculation,
      remarks: species.remarks,
      createdBy: species.createdBy,
      viewableBies: species.viewableBies
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const species = this.createFromForm();
    if (species.id !== undefined) {
      this.subscribeToSaveResponse(this.speciesService.update(species));
    } else {
      this.subscribeToSaveResponse(this.speciesService.create(species));
    }
  }

  private createFromForm(): ISpecies {
    return {
      ...new Species(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      physicalCharacteristics: this.editForm.get(['physicalCharacteristics']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined,
      inCirculation: this.editForm.get(['inCirculation']).value,
      remarks: this.editForm.get(['remarks']).value,
      createdBy: this.editForm.get(['createdBy']).value,
      viewableBies: this.editForm.get(['viewableBies']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpecies>>) {
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
