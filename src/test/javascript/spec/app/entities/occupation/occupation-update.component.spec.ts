/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { OccupationUpdateComponent } from 'app/entities/occupation/occupation-update.component';
import { OccupationService } from 'app/entities/occupation/occupation.service';
import { Occupation } from 'app/shared/model/occupation.model';

describe('Component Tests', () => {
  describe('Occupation Management Update Component', () => {
    let comp: OccupationUpdateComponent;
    let fixture: ComponentFixture<OccupationUpdateComponent>;
    let service: OccupationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [OccupationUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OccupationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OccupationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OccupationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Occupation(123);
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
        const entity = new Occupation();
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
