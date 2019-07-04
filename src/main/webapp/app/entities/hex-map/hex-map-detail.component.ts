import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHexMap } from 'app/shared/model/hex-map.model';

@Component({
  selector: 'jhi-hex-map-detail',
  templateUrl: './hex-map-detail.component.html'
})
export class HexMapDetailComponent implements OnInit {
  hexMap: IHexMap;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ hexMap }) => {
      this.hexMap = hexMap;
    });
  }

  previousState() {
    window.history.back();
  }
}
