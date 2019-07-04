import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IGMComment, GMComment } from 'app/shared/model/gm-comment.model';
import { GMCommentService } from './gm-comment.service';

@Component({
  selector: 'jhi-gm-comment-update',
  templateUrl: './gm-comment-update.component.html'
})
export class GMCommentUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    content: [],
    dateAdded: []
  });

  constructor(protected gMCommentService: GMCommentService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ gMComment }) => {
      this.updateForm(gMComment);
    });
  }

  updateForm(gMComment: IGMComment) {
    this.editForm.patchValue({
      id: gMComment.id,
      content: gMComment.content,
      dateAdded: gMComment.dateAdded != null ? gMComment.dateAdded.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const gMComment = this.createFromForm();
    if (gMComment.id !== undefined) {
      this.subscribeToSaveResponse(this.gMCommentService.update(gMComment));
    } else {
      this.subscribeToSaveResponse(this.gMCommentService.create(gMComment));
    }
  }

  private createFromForm(): IGMComment {
    return {
      ...new GMComment(),
      id: this.editForm.get(['id']).value,
      content: this.editForm.get(['content']).value,
      dateAdded:
        this.editForm.get(['dateAdded']).value != null ? moment(this.editForm.get(['dateAdded']).value, DATE_TIME_FORMAT) : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGMComment>>) {
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
