import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGeneralInfo } from 'app/shared/model/general-info.model';

@Component({
  selector: 'jhi-general-info-detail',
  templateUrl: './general-info-detail.component.html'
})
export class GeneralInfoDetailComponent implements OnInit {
  generalInfo: IGeneralInfo;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ generalInfo }) => {
      this.generalInfo = generalInfo;
    });
  }

  previousState() {
    window.history.back();
  }
}
