import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICharacter } from 'app/shared/model/character.model';
import { CharacterService } from './character.service';

@Component({
  selector: 'jhi-character-delete-dialog',
  templateUrl: './character-delete-dialog.component.html'
})
export class CharacterDeleteDialogComponent {
  character: ICharacter;

  constructor(protected characterService: CharacterService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.characterService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'characterListModification',
        content: 'Deleted an character'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-character-delete-popup',
  template: ''
})
export class CharacterDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ character }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CharacterDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.character = character;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/character', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/character', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
