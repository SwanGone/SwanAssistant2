import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IHexSector } from 'app/shared/model/hex-sector.model';
import { HexSectorService } from './hex-sector.service';

@Component({
  selector: 'jhi-hex-sector-delete-dialog',
  templateUrl: './hex-sector-delete-dialog.component.html'
})
export class HexSectorDeleteDialogComponent {
  hexSector: IHexSector;

  constructor(protected hexSectorService: HexSectorService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.hexSectorService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'hexSectorListModification',
        content: 'Deleted an hexSector'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-hex-sector-delete-popup',
  template: ''
})
export class HexSectorDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ hexSector }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(HexSectorDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.hexSector = hexSector;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/hex-sector', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/hex-sector', { outlets: { popup: null } }]);
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
