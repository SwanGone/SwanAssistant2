/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlaceOfInterestUpdateComponent } from 'app/entities/place-of-interest/place-of-interest-update.component';
import { PlaceOfInterestService } from 'app/entities/place-of-interest/place-of-interest.service';
import { PlaceOfInterest } from 'app/shared/model/place-of-interest.model';

describe('Component Tests', () => {
  describe('PlaceOfInterest Management Update Component', () => {
    let comp: PlaceOfInterestUpdateComponent;
    let fixture: ComponentFixture<PlaceOfInterestUpdateComponent>;
    let service: PlaceOfInterestService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlaceOfInterestUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PlaceOfInterestUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlaceOfInterestUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlaceOfInterestService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PlaceOfInterest(123);
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
        const entity = new PlaceOfInterest();
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
