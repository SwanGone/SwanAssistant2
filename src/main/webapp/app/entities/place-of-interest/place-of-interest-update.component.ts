import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPlaceOfInterest, PlaceOfInterest } from 'app/shared/model/place-of-interest.model';
import { PlaceOfInterestService } from './place-of-interest.service';
import { IRemarks } from 'app/shared/model/remarks.model';
import { RemarksService } from 'app/entities/remarks';
import { IPlanet } from 'app/shared/model/planet.model';
import { PlanetService } from 'app/entities/planet';

@Component({
  selector: 'jhi-place-of-interest-update',
  templateUrl: './place-of-interest-update.component.html'
})
export class PlaceOfInterestUpdateComponent implements OnInit {
  isSaving: boolean;

  remarks: IRemarks[];

  planets: IPlanet[];

  editForm = this.fb.group({
    id: [],
    name: [],
    inCirculation: [],
    remarks: [],
    locatedOn: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected placeOfInterestService: PlaceOfInterestService,
    protected remarksService: RemarksService,
    protected planetService: PlanetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ placeOfInterest }) => {
      this.updateForm(placeOfInterest);
    });
    this.remarksService
      .query({ filter: 'placeofinterest-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IRemarks[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRemarks[]>) => response.body)
      )
      .subscribe(
        (res: IRemarks[]) => {
          if (!this.editForm.get('remarks').value || !this.editForm.get('remarks').value.id) {
            this.remarks = res;
          } else {
            this.remarksService
              .find(this.editForm.get('remarks').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IRemarks>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IRemarks>) => subResponse.body)
              )
              .subscribe(
                (subRes: IRemarks) => (this.remarks = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.planetService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPlanet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPlanet[]>) => response.body)
      )
      .subscribe((res: IPlanet[]) => (this.planets = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(placeOfInterest: IPlaceOfInterest) {
    this.editForm.patchValue({
      id: placeOfInterest.id,
      name: placeOfInterest.name,
      inCirculation: placeOfInterest.inCirculation,
      remarks: placeOfInterest.remarks,
      locatedOn: placeOfInterest.locatedOn
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const placeOfInterest = this.createFromForm();
    if (placeOfInterest.id !== undefined) {
      this.subscribeToSaveResponse(this.placeOfInterestService.update(placeOfInterest));
    } else {
      this.subscribeToSaveResponse(this.placeOfInterestService.create(placeOfInterest));
    }
  }

  private createFromForm(): IPlaceOfInterest {
    return {
      ...new PlaceOfInterest(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      inCirculation: this.editForm.get(['inCirculation']).value,
      remarks: this.editForm.get(['remarks']).value,
      locatedOn: this.editForm.get(['locatedOn']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlaceOfInterest>>) {
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

  trackRemarksById(index: number, item: IRemarks) {
    return item.id;
  }

  trackPlanetById(index: number, item: IPlanet) {
    return item.id;
  }
}
