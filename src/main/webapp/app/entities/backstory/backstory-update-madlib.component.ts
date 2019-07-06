import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
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
  templateUrl: './backstory-update-madlib.component.html',
  styleUrls: ['./backstory-update-madlib.component.scss']
})
export class BackstoryUpdateMadlibComponent implements OnInit {
  isSaving: boolean;

  adjectives: IAdjective[];

  species: ISpecies[];

  occupations: IOccupation[];

  planets: IPlanet[];

  origindetails: IOriginDetails[];

  randomSelectedAdjective: IAdjective;
  randomSelectedSpecies: ISpecies;
  randomSelectedOccupation: IOccupation;
  randomSelectedPlanet: IPlanet;
  randomSelectedOriginDetail: IOriginDetails;

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

  fillTheMadlib(): void {
    this.randomSelectedAdjective = BackstoryUpdateMadlibComponent.randomEntityFromArray(this.adjectives);
    this.randomSelectedSpecies = BackstoryUpdateMadlibComponent.randomEntityFromArray(this.species);
    this.randomSelectedOccupation = BackstoryUpdateMadlibComponent.randomEntityFromArray(this.occupations);
    this.randomSelectedPlanet = BackstoryUpdateMadlibComponent.randomEntityFromArray(this.planets);
    this.randomSelectedOriginDetail = BackstoryUpdateMadlibComponent.randomEntityFromArray(this.origindetails);
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

  static hasAVowel(item: string): boolean {
    return (
      item.toUpperCase().includes('A') ||
      item.toUpperCase().includes('E') ||
      item.toUpperCase().includes('I') ||
      item.toUpperCase().includes('O') ||
      item.toUpperCase().includes('U')
    );
  }

  startsWithAVowel(item: string): boolean {
    return BackstoryUpdateMadlibComponent.hasAVowel(item.charAt(0));
  }

  static randomEntityFromArray(item: any) {
    return item[Math.floor(Math.random() * item.length)];
  }

  getRandomSelectedAdjectiveName(): string {
    if (this.randomSelectedAdjective) {
      return this.randomSelectedAdjective.content;
    } else {
      return 'ADJECTIVE';
    }
  }

  getRandomSelectedSpeciesName(): string {
    if (this.randomSelectedSpecies) {
      return this.randomSelectedSpecies.name;
    } else {
      return 'SPECIES';
    }
  }

  getRandomSelectedOccupationName(): string {
    if (this.randomSelectedOccupation) {
      return this.randomSelectedOccupation.name;
    } else {
      return 'OCCUPATION';
    }
  }

  getRandomSelectedPlanetName(): string {
    if (this.randomSelectedPlanet) {
      return this.randomSelectedPlanet.name;
    } else {
      return 'PLANET';
    }
  }

  getRandomSelectedOriginDetail(): string {
    if (this.randomSelectedOriginDetail) {
      return this.randomSelectedOriginDetail.content;
    } else {
      return 'ORIGIN DETAIL';
    }
  }

  concatenateMadlib(): string {
    return (
      this.getRandomSelectedAdjectiveName().toUpperCase() +
      ' ' +
      this.getRandomSelectedSpeciesName().toUpperCase() +
      ' ' +
      this.getRandomSelectedOccupationName().toUpperCase() +
      ' FROM ' +
      this.getRandomSelectedPlanetName().toUpperCase() +
      ' WHO ' +
      this.getRandomSelectedOriginDetail().toUpperCase()
    );
  }
}
