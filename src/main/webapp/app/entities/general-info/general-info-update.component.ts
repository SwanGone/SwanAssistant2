import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IGeneralInfo, GeneralInfo } from 'app/shared/model/general-info.model';
import { GeneralInfoService } from './general-info.service';

@Component({
  selector: 'jhi-general-info-update',
  templateUrl: './general-info-update.component.html'
})
export class GeneralInfoUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    content: [],
    dateAdded: []
  });

  constructor(protected generalInfoService: GeneralInfoService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ generalInfo }) => {
      this.updateForm(generalInfo);
    });
  }

  updateForm(generalInfo: IGeneralInfo) {
    this.editForm.patchValue({
      id: generalInfo.id,
      content: generalInfo.content,
      dateAdded: generalInfo.dateAdded != null ? generalInfo.dateAdded.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const generalInfo = this.createFromForm();
    if (generalInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.generalInfoService.update(generalInfo));
    } else {
      this.subscribeToSaveResponse(this.generalInfoService.create(generalInfo));
    }
  }

  private createFromForm(): IGeneralInfo {
    return {
      ...new GeneralInfo(),
      id: this.editForm.get(['id']).value,
      content: this.editForm.get(['content']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGeneralInfo>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
