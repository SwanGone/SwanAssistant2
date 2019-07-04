import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBackstory } from 'app/shared/model/backstory.model';

@Component({
  selector: 'jhi-backstory-detail',
  templateUrl: './backstory-detail.component.html'
})
export class BackstoryDetailComponent implements OnInit {
  backstory: IBackstory;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ backstory }) => {
      this.backstory = backstory;
    });
  }

  previousState() {
    window.history.back();
  }
}
