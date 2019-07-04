import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOriginDetails } from 'app/shared/model/origin-details.model';

@Component({
  selector: 'jhi-origin-details-detail',
  templateUrl: './origin-details-detail.component.html'
})
export class OriginDetailsDetailComponent implements OnInit {
  originDetails: IOriginDetails;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ originDetails }) => {
      this.originDetails = originDetails;
    });
  }

  previousState() {
    window.history.back();
  }
}
