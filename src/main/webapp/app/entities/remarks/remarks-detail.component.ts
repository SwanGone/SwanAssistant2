import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRemarks } from 'app/shared/model/remarks.model';

@Component({
  selector: 'jhi-remarks-detail',
  templateUrl: './remarks-detail.component.html'
})
export class RemarksDetailComponent implements OnInit {
  remarks: IRemarks;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ remarks }) => {
      this.remarks = remarks;
    });
  }

  previousState() {
    window.history.back();
  }
}
