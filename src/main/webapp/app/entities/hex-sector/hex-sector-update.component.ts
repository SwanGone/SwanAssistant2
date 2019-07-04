import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IHexSector, HexSector } from 'app/shared/model/hex-sector.model';
import { HexSectorService } from './hex-sector.service';
import { IHexMap } from 'app/shared/model/hex-map.model';
import { HexMapService } from 'app/entities/hex-map';

@Component({
  selector: 'jhi-hex-sector-update',
  templateUrl: './hex-sector-update.component.html'
})
export class HexSectorUpdateComponent implements OnInit {
  isSaving: boolean;

  hexmaps: IHexMap[];

  editForm = this.fb.group({
    id: [],
    hexRow: [],
    hexColumn: [],
    coordinates: [],
    isMapped: [],
    locatedIn: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected hexSectorService: HexSectorService,
    protected hexMapService: HexMapService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ hexSector }) => {
      this.updateForm(hexSector);
    });
    this.hexMapService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IHexMap[]>) => mayBeOk.ok),
        map((response: HttpResponse<IHexMap[]>) => response.body)
      )
      .subscribe((res: IHexMap[]) => (this.hexmaps = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(hexSector: IHexSector) {
    this.editForm.patchValue({
      id: hexSector.id,
      hexRow: hexSector.hexRow,
      hexColumn: hexSector.hexColumn,
      coordinates: hexSector.coordinates,
      isMapped: hexSector.isMapped,
      locatedIn: hexSector.locatedIn
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const hexSector = this.createFromForm();
    if (hexSector.id !== undefined) {
      this.subscribeToSaveResponse(this.hexSectorService.update(hexSector));
    } else {
      this.subscribeToSaveResponse(this.hexSectorService.create(hexSector));
    }
  }

  private createFromForm(): IHexSector {
    return {
      ...new HexSector(),
      id: this.editForm.get(['id']).value,
      hexRow: this.editForm.get(['hexRow']).value,
      hexColumn: this.editForm.get(['hexColumn']).value,
      coordinates: this.editForm.get(['coordinates']).value,
      isMapped: this.editForm.get(['isMapped']).value,
      locatedIn: this.editForm.get(['locatedIn']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHexSector>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackHexMapById(index: number, item: IHexMap) {
    return item.id;
  }
}
