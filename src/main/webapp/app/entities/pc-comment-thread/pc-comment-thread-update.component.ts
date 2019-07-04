import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IPCCommentThread, PCCommentThread } from 'app/shared/model/pc-comment-thread.model';
import { PCCommentThreadService } from './pc-comment-thread.service';
import { IRemarks } from 'app/shared/model/remarks.model';
import { RemarksService } from 'app/entities/remarks';

@Component({
  selector: 'jhi-pc-comment-thread-update',
  templateUrl: './pc-comment-thread-update.component.html'
})
export class PCCommentThreadUpdateComponent implements OnInit {
  isSaving: boolean;

  remarks: IRemarks[];

  editForm = this.fb.group({
    id: [],
    headline: [],
    dateAdded: [],
    existsIn: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected pCCommentThreadService: PCCommentThreadService,
    protected remarksService: RemarksService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ pCCommentThread }) => {
      this.updateForm(pCCommentThread);
    });
    this.remarksService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRemarks[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRemarks[]>) => response.body)
      )
      .subscribe((res: IRemarks[]) => (this.remarks = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(pCCommentThread: IPCCommentThread) {
    this.editForm.patchValue({
      id: pCCommentThread.id,
      headline: pCCommentThread.headline,
      dateAdded: pCCommentThread.dateAdded != null ? pCCommentThread.dateAdded.format(DATE_TIME_FORMAT) : null,
      existsIn: pCCommentThread.existsIn
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const pCCommentThread = this.createFromForm();
    if (pCCommentThread.id !== undefined) {
      this.subscribeToSaveResponse(this.pCCommentThreadService.update(pCCommentThread));
    } else {
      this.subscribeToSaveResponse(this.pCCommentThreadService.create(pCCommentThread));
    }
  }

  private createFromForm(): IPCCommentThread {
    return {
      ...new PCCommentThread(),
      id: this.editForm.get(['id']).value,
      headline: this.editForm.get(['headline']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined,
      existsIn: this.editForm.get(['existsIn']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPCCommentThread>>) {
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
}
