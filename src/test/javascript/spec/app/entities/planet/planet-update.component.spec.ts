/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PlanetUpdateComponent } from 'app/entities/planet/planet-update.component';
import { PlanetService } from 'app/entities/planet/planet.service';
import { Planet } from 'app/shared/model/planet.model';

describe('Component Tests', () => {
  describe('Planet Management Update Component', () => {
    let comp: PlanetUpdateComponent;
    let fixture: ComponentFixture<PlanetUpdateComponent>;
    let service: PlanetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PlanetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PlanetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlanetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlanetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Planet(123);
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
        const entity = new Planet();
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
