import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IAdjective, Adjective } from 'app/shared/model/adjective.model';
import { AdjectiveService } from './adjective.service';
import { IUser, UserService } from 'app/core';
import { AccountService } from 'app/core';

@Component({
  selector: 'jhi-adjective-update-user',
  templateUrl: './adjective-update-user.component.html',
  styleUrls: ['./adjective-update-user.component.scss']
})
export class AdjectiveUpdateUserComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];
  currentAccount: any;

  editForm = this.fb.group({
    id: [],
    dateAdded: [],
    content: [],
    inCirculation: [],
    createdBy: [],
    viewableBies: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected adjectiveService: AdjectiveService,
    protected userService: UserService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ adjective }) => {
      this.updateForm(adjective);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
  }

  updateForm(adjective: IAdjective) {
    this.editForm.patchValue({
      id: adjective.id,
      dateAdded: adjective.dateAdded != null ? adjective.dateAdded.format(DATE_TIME_FORMAT) : null,
      content: adjective.content,
      inCirculation: adjective.inCirculation,
      createdBy: adjective.createdBy,
      viewableBies: adjective.viewableBies
    });
  }

  getCurrentUser() {
    for (let user of this.users) {
      if (user.id == this.currentAccount.id) {
        return user;
      }
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const adjective = this.createFromForm();
    if (adjective.id !== undefined) {
      this.subscribeToSaveResponse(this.adjectiveService.update(adjective));
    } else {
      this.subscribeToSaveResponse(this.adjectiveService.create(adjective));
    }
  }

  private createFromForm(): IAdjective {
    return {
      ...new Adjective(),
      id: this.editForm.get(['id']).value,
      dateAdded: moment(),
      content: this.editForm.get(['content']).value,
      inCirculation: false,
      createdBy: this.getCurrentUser()
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdjective>>) {
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

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
