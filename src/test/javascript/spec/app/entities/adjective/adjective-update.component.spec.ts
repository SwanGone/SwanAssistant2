/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { AdjectiveUpdateComponent } from 'app/entities/adjective/adjective-update.component';
import { AdjectiveService } from 'app/entities/adjective/adjective.service';
import { Adjective } from 'app/shared/model/adjective.model';

describe('Component Tests', () => {
  describe('Adjective Management Update Component', () => {
    let comp: AdjectiveUpdateComponent;
    let fixture: ComponentFixture<AdjectiveUpdateComponent>;
    let service: AdjectiveService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [AdjectiveUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(AdjectiveUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdjectiveUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AdjectiveService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Adjective(123);
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
        const entity = new Adjective();
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
