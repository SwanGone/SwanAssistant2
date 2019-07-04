import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IOriginDetails, OriginDetails } from 'app/shared/model/origin-details.model';
import { OriginDetailsService } from './origin-details.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-origin-details-update',
  templateUrl: './origin-details-update.component.html'
})
export class OriginDetailsUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    content: [],
    dateAdded: [],
    inCirculation: [],
    createdBy: [],
    viewableBies: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected originDetailsService: OriginDetailsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ originDetails }) => {
      this.updateForm(originDetails);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(originDetails: IOriginDetails) {
    this.editForm.patchValue({
      id: originDetails.id,
      content: originDetails.content,
      dateAdded: originDetails.dateAdded != null ? originDetails.dateAdded.format(DATE_TIME_FORMAT) : null,
      inCirculation: originDetails.inCirculation,
      createdBy: originDetails.createdBy,
      viewableBies: originDetails.viewableBies
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const originDetails = this.createFromForm();
    if (originDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.originDetailsService.update(originDetails));
    } else {
      this.subscribeToSaveResponse(this.originDetailsService.create(originDetails));
    }
  }

  private createFromForm(): IOriginDetails {
    return {
      ...new OriginDetails(),
      id: this.editForm.get(['id']).value,
      content: this.editForm.get(['content']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined,
      inCirculation: this.editForm.get(['inCirculation']).value,
      createdBy: this.editForm.get(['createdBy']).value,
      viewableBies: this.editForm.get(['viewableBies']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOriginDetails>>) {
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
