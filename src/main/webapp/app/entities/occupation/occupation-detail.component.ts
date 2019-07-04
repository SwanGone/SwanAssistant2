import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOccupation } from 'app/shared/model/occupation.model';

@Component({
  selector: 'jhi-occupation-detail',
  templateUrl: './occupation-detail.component.html'
})
export class OccupationDetailComponent implements OnInit {
  occupation: IOccupation;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ occupation }) => {
      this.occupation = occupation;
    });
  }

  previousState() {
    window.history.back();
  }
}
