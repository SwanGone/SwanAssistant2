import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharacter } from 'app/shared/model/character.model';

@Component({
  selector: 'jhi-character-detail',
  templateUrl: './character-detail.component.html'
})
export class CharacterDetailComponent implements OnInit {
  character: ICharacter;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ character }) => {
      this.character = character;
    });
  }

  previousState() {
    window.history.back();
  }
}
