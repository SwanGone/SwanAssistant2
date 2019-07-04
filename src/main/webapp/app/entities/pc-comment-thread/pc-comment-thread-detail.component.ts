import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPCCommentThread } from 'app/shared/model/pc-comment-thread.model';

@Component({
  selector: 'jhi-pc-comment-thread-detail',
  templateUrl: './pc-comment-thread-detail.component.html'
})
export class PCCommentThreadDetailComponent implements OnInit {
  pCCommentThread: IPCCommentThread;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pCCommentThread }) => {
      this.pCCommentThread = pCCommentThread;
    });
  }

  previousState() {
    window.history.back();
  }
}
