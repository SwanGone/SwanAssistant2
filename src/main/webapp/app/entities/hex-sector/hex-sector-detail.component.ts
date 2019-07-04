import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHexSector } from 'app/shared/model/hex-sector.model';

@Component({
  selector: 'jhi-hex-sector-detail',
  templateUrl: './hex-sector-detail.component.html'
})
export class HexSectorDetailComponent implements OnInit {
  hexSector: IHexSector;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ hexSector }) => {
      this.hexSector = hexSector;
    });
  }

  previousState() {
    window.history.back();
  }
}
