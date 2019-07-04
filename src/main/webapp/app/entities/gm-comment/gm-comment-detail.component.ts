import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGMComment } from 'app/shared/model/gm-comment.model';

@Component({
  selector: 'jhi-gm-comment-detail',
  templateUrl: './gm-comment-detail.component.html'
})
export class GMCommentDetailComponent implements OnInit {
  gMComment: IGMComment;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ gMComment }) => {
      this.gMComment = gMComment;
    });
  }

  previousState() {
    window.history.back();
  }
}
