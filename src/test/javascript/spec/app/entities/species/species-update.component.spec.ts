/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { SpeciesUpdateComponent } from 'app/entities/species/species-update.component';
import { SpeciesService } from 'app/entities/species/species.service';
import { Species } from 'app/shared/model/species.model';

describe('Component Tests', () => {
  describe('Species Management Update Component', () => {
    let comp: SpeciesUpdateComponent;
    let fixture: ComponentFixture<SpeciesUpdateComponent>;
    let service: SpeciesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [SpeciesUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(SpeciesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SpeciesUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SpeciesService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Species(123);
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
        const entity = new Species();
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
