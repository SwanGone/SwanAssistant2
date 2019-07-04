import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISpecies } from 'app/shared/model/species.model';

@Component({
  selector: 'jhi-species-detail',
  templateUrl: './species-detail.component.html'
})
export class SpeciesDetailComponent implements OnInit {
  species: ISpecies;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ species }) => {
      this.species = species;
    });
  }

  previousState() {
    window.history.back();
  }
}
