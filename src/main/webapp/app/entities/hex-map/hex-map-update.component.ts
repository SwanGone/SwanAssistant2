import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IHexMap, HexMap } from 'app/shared/model/hex-map.model';
import { HexMapService } from './hex-map.service';

@Component({
  selector: 'jhi-hex-map-update',
  templateUrl: './hex-map-update.component.html'
})
export class HexMapUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    seed: []
  });

  constructor(protected hexMapService: HexMapService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ hexMap }) => {
      this.updateForm(hexMap);
    });
  }

  updateForm(hexMap: IHexMap) {
    this.editForm.patchValue({
      id: hexMap.id,
      seed: hexMap.seed
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const hexMap = this.createFromForm();
    if (hexMap.id !== undefined) {
      this.subscribeToSaveResponse(this.hexMapService.update(hexMap));
    } else {
      this.subscribeToSaveResponse(this.hexMapService.create(hexMap));
    }
  }

  private createFromForm(): IHexMap {
    return {
      ...new HexMap(),
      id: this.editForm.get(['id']).value,
      seed: this.editForm.get(['seed']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHexMap>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
