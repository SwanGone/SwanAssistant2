import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IPCComment, PCComment } from 'app/shared/model/pc-comment.model';
import { PCCommentService } from './pc-comment.service';
import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';
import { PCCommentThreadService } from 'app/entities/pc-comment-thread';

@Component({
  selector: 'jhi-pc-comment-update',
  templateUrl: './pc-comment-update.component.html'
})
export class PCCommentUpdateComponent implements OnInit {
  isSaving: boolean;

  pccommentthreads: IPCCommentThread[];

  editForm = this.fb.group({
    id: [],
    content: [],
    dateAdded: [],
    existsIn: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected pCCommentService: PCCommentService,
    protected pCCommentThreadService: PCCommentThreadService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ pCComment }) => {
      this.updateForm(pCComment);
    });
    this.pCCommentThreadService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPCCommentThread[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPCCommentThread[]>) => response.body)
      )
      .subscribe((res: IPCCommentThread[]) => (this.pccommentthreads = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(pCComment: IPCComment) {
    this.editForm.patchValue({
      id: pCComment.id,
      content: pCComment.content,
      dateAdded: pCComment.dateAdded != null ? pCComment.dateAdded.format(DATE_TIME_FORMAT) : null,
      existsIn: pCComment.existsIn
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const pCComment = this.createFromForm();
    if (pCComment.id !== undefined) {
      this.subscribeToSaveResponse(this.pCCommentService.update(pCComment));
    } else {
      this.subscribeToSaveResponse(this.pCCommentService.create(pCComment));
    }
  }

  private createFromForm(): IPCComment {
    return {
      ...new PCComment(),
      id: this.editForm.get(['id']).value,
      content: this.editForm.get(['content']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined,
      existsIn: this.editForm.get(['existsIn']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPCComment>>) {
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

  trackPCCommentThreadById(index: number, item: IPCCommentThread) {
    return item.id;
  }
}
