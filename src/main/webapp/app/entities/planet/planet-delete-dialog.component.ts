import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPlanet } from 'app/shared/model/planet.model';
import { PlanetService } from './planet.service';

@Component({
  selector: 'jhi-planet-delete-dialog',
  templateUrl: './planet-delete-dialog.component.html'
})
export class PlanetDeleteDialogComponent {
  planet: IPlanet;

  constructor(protected planetService: PlanetService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.planetService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'planetListModification',
        content: 'Deleted an planet'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-planet-delete-popup',
  template: ''
})
export class PlanetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ planet }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PlanetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.planet = planet;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/planet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/planet', { outlets: { popup: null } }]);
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
