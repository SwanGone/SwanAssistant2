/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { GeneralInfoUpdateComponent } from 'app/entities/general-info/general-info-update.component';
import { GeneralInfoService } from 'app/entities/general-info/general-info.service';
import { GeneralInfo } from 'app/shared/model/general-info.model';

describe('Component Tests', () => {
  describe('GeneralInfo Management Update Component', () => {
    let comp: GeneralInfoUpdateComponent;
    let fixture: ComponentFixture<GeneralInfoUpdateComponent>;
    let service: GeneralInfoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GeneralInfoUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(GeneralInfoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GeneralInfoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GeneralInfoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new GeneralInfo(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new GeneralInfo();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
