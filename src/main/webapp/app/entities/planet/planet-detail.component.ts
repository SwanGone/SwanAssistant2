import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlanet } from 'app/shared/model/planet.model';

@Component({
  selector: 'jhi-planet-detail',
  templateUrl: './planet-detail.component.html'
})
export class PlanetDetailComponent implements OnInit {
  planet: IPlanet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ planet }) => {
      this.planet = planet;
    });
  }

  previousState() {
    window.history.back();
  }
}
