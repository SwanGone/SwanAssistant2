import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISpecies } from 'app/shared/model/species.model';
import { SpeciesService } from './species.service';

@Component({
  selector: 'jhi-species-delete-dialog',
  templateUrl: './species-delete-dialog.component.html'
})
export class SpeciesDeleteDialogComponent {
  species: ISpecies;

  constructor(protected speciesService: SpeciesService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.speciesService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'speciesListModification',
        content: 'Deleted an species'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-species-delete-popup',
  template: ''
})
export class SpeciesDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ species }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(SpeciesDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.species = species;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/species', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/species', { outlets: { popup: null } }]);
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
