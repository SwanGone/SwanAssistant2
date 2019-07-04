/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { BackstoryUpdateComponent } from 'app/entities/backstory/backstory-update.component';
import { BackstoryService } from 'app/entities/backstory/backstory.service';
import { Backstory } from 'app/shared/model/backstory.model';

describe('Component Tests', () => {
  describe('Backstory Management Update Component', () => {
    let comp: BackstoryUpdateComponent;
    let fixture: ComponentFixture<BackstoryUpdateComponent>;
    let service: BackstoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [BackstoryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(BackstoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BackstoryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BackstoryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Backstory(123);
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
        const entity = new Backstory();
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
