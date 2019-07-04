import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAdjective } from 'app/shared/model/adjective.model';

@Component({
  selector: 'jhi-adjective-detail',
  templateUrl: './adjective-detail.component.html'
})
export class AdjectiveDetailComponent implements OnInit {
  adjective: IAdjective;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ adjective }) => {
      this.adjective = adjective;
    });
  }

  previousState() {
    window.history.back();
  }
}
