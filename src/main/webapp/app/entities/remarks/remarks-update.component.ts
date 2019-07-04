import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IRemarks, Remarks } from 'app/shared/model/remarks.model';
import { RemarksService } from './remarks.service';
import { IGMComment } from 'app/shared/model/gm-comment.model';
import { GMCommentService } from 'app/entities/gm-comment';
import { IGeneralInfo } from 'app/shared/model/general-info.model';
import { GeneralInfoService } from 'app/entities/general-info';

@Component({
  selector: 'jhi-remarks-update',
  templateUrl: './remarks-update.component.html'
})
export class RemarksUpdateComponent implements OnInit {
  isSaving: boolean;

  gmcomments: IGMComment[];

  generalinfos: IGeneralInfo[];

  editForm = this.fb.group({
    id: [],
    title: [],
    gmComment: [],
    generalInfo: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected remarksService: RemarksService,
    protected gMCommentService: GMCommentService,
    protected generalInfoService: GeneralInfoService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ remarks }) => {
      this.updateForm(remarks);
    });
    this.gMCommentService
      .query({ filter: 'remarks-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IGMComment[]>) => mayBeOk.ok),
        map((response: HttpResponse<IGMComment[]>) => response.body)
      )
      .subscribe(
        (res: IGMComment[]) => {
          if (!this.editForm.get('gmComment').value || !this.editForm.get('gmComment').value.id) {
            this.gmcomments = res;
          } else {
            this.gMCommentService
              .find(this.editForm.get('gmComment').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IGMComment>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IGMComment>) => subResponse.body)
              )
              .subscribe(
                (subRes: IGMComment) => (this.gmcomments = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.generalInfoService
      .query({ filter: 'remarks-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IGeneralInfo[]>) => mayBeOk.ok),
        map((response: HttpResponse<IGeneralInfo[]>) => response.body)
      )
      .subscribe(
        (res: IGeneralInfo[]) => {
          if (!this.editForm.get('generalInfo').value || !this.editForm.get('generalInfo').value.id) {
            this.generalinfos = res;
          } else {
            this.generalInfoService
              .find(this.editForm.get('generalInfo').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IGeneralInfo>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IGeneralInfo>) => subResponse.body)
              )
              .subscribe(
                (subRes: IGeneralInfo) => (this.generalinfos = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(remarks: IRemarks) {
    this.editForm.patchValue({
      id: remarks.id,
      title: remarks.title,
      gmComment: remarks.gmComment,
      generalInfo: remarks.generalInfo
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const remarks = this.createFromForm();
    if (remarks.id !== undefined) {
      this.subscribeToSaveResponse(this.remarksService.update(remarks));
    } else {
      this.subscribeToSaveResponse(this.remarksService.create(remarks));
    }
  }

  private createFromForm(): IRemarks {
    return {
      ...new Remarks(),
      id: this.editForm.get(['id']).value,
      title: this.editForm.get(['title']).value,
      gmComment: this.editForm.get(['gmComment']).value,
      generalInfo: this.editForm.get(['generalInfo']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRemarks>>) {
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

  trackGMCommentById(index: number, item: IGMComment) {
    return item.id;
  }

  trackGeneralInfoById(index: number, item: IGeneralInfo) {
    return item.id;
  }
}
