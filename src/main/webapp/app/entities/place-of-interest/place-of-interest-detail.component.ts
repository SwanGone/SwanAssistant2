import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlaceOfInterest } from 'app/shared/model/place-of-interest.model';

@Component({
  selector: 'jhi-place-of-interest-detail',
  templateUrl: './place-of-interest-detail.component.html'
})
export class PlaceOfInterestDetailComponent implements OnInit {
  placeOfInterest: IPlaceOfInterest;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ placeOfInterest }) => {
      this.placeOfInterest = placeOfInterest;
    });
  }

  previousState() {
    window.history.back();
  }
}
