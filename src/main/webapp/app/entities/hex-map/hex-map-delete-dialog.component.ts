import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IHexMap } from 'app/shared/model/hex-map.model';
import { HexMapService } from './hex-map.service';

@Component({
  selector: 'jhi-hex-map-delete-dialog',
  templateUrl: './hex-map-delete-dialog.component.html'
})
export class HexMapDeleteDialogComponent {
  hexMap: IHexMap;

  constructor(protected hexMapService: HexMapService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.hexMapService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'hexMapListModification',
        content: 'Deleted an hexMap'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-hex-map-delete-popup',
  template: ''
})
export class HexMapDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ hexMap }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(HexMapDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.hexMap = hexMap;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/hex-map', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/hex-map', { outlets: { popup: null } }]);
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
