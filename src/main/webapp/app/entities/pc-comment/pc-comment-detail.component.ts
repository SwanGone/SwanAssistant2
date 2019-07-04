import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPCComment } from 'app/shared/model/pc-comment.model';

@Component({
  selector: 'jhi-pc-comment-detail',
  templateUrl: './pc-comment-detail.component.html'
})
export class PCCommentDetailComponent implements OnInit {
  pCComment: IPCComment;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pCComment }) => {
      this.pCComment = pCComment;
    });
  }

  previousState() {
    window.history.back();
  }
}
