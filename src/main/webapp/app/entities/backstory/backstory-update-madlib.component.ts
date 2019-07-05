import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBackstory, Backstory } from 'app/shared/model/backstory.model';
import { BackstoryService } from './backstory.service';
import { IAdjective } from 'app/shared/model/adjective.model';
import { AdjectiveService } from 'app/entities/adjective';
import { ISpecies } from 'app/shared/model/species.model';
import { SpeciesService } from 'app/entities/species';
import { IOccupation } from 'app/shared/model/occupation.model';
import { OccupationService } from 'app/entities/occupation';
import { IPlanet } from 'app/shared/model/planet.model';
import { PlanetService } from 'app/entities/planet';
import { IOriginDetails } from 'app/shared/model/origin-details.model';
import { OriginDetailsService } from 'app/entities/origin-details';

@Component({
  selector: 'jhi-backstory-update-madlib',
  templateUrl: './backstory-update-madlib.component.html'
})
export class BackstoryUpdateMadlibComponent implements OnInit {
  isSaving: boolean;

  adjectives: IAdjective[];

  species: ISpecies[];

  occupations: IOccupation[];

  planets: IPlanet[];

  origindetails: IOriginDetails[];

  editForm = this.fb.group({
    id: [],
    text: [],
    adjective: [],
    species: [],
    occupation: [],
    homeworld: [],
    originDetails: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected backstoryService: BackstoryService,
    protected adjectiveService: AdjectiveService,
    protected speciesService: SpeciesService,
    protected occupationService: OccupationService,
    protected planetService: PlanetService,
    protected originDetailsService: OriginDetailsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ backstory }) => {
      this.updateForm(backstory);
    });
    this.adjectiveService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IAdjective[]>) => mayBeOk.ok),
        map((response: HttpResponse<IAdjective[]>) => response.body)
      )
      .subscribe((res: IAdjective[]) => (this.adjectives = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.speciesService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ISpecies[]>) => mayBeOk.ok),
        map((response: HttpResponse<ISpecies[]>) => response.body)
      )
      .subscribe((res: ISpecies[]) => (this.species = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.occupationService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOccupation[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOccupation[]>) => response.body)
      )
      .subscribe((res: IOccupation[]) => (this.occupations = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.planetService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPlanet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPlanet[]>) => response.body)
      )
      .subscribe((res: IPlanet[]) => (this.planets = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.originDetailsService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOriginDetails[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOriginDetails[]>) => response.body)
      )
      .subscribe((res: IOriginDetails[]) => (this.origindetails = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(backstory: IBackstory) {
    this.editForm.patchValue({
      id: backstory.id,
      text: backstory.text,
      adjective: backstory.adjective,
      species: backstory.species,
      occupation: backstory.occupation,
      homeworld: backstory.homeworld,
      originDetails: backstory.originDetails
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const backstory = this.createFromForm();
    if (backstory.id !== undefined) {
      this.subscribeToSaveResponse(this.backstoryService.update(backstory));
    } else {
      this.subscribeToSaveResponse(this.backstoryService.create(backstory));
    }
  }

  private createFromForm(): IBackstory {
    return {
      ...new Backstory(),
      id: this.editForm.get(['id']).value,
      text: this.editForm.get(['text']).value,
      adjective: this.editForm.get(['adjective']).value,
      species: this.editForm.get(['species']).value,
      occupation: this.editForm.get(['occupation']).value,
      homeworld: this.editForm.get(['homeworld']).value,
      originDetails: this.editForm.get(['originDetails']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBackstory>>) {
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

  trackAdjectiveById(index: number, item: IAdjective) {
    return item.id;
  }

  trackSpeciesById(index: number, item: ISpecies) {
    return item.id;
  }

  trackOccupationById(index: number, item: IOccupation) {
    return item.id;
  }

  trackPlanetById(index: number, item: IPlanet) {
    return item.id;
  }

  trackOriginDetailsById(index: number, item: IOriginDetails) {
    return item.id;
  }
}
