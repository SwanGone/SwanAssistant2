/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { CharacterUpdateComponent } from 'app/entities/character/character-update.component';
import { CharacterService } from 'app/entities/character/character.service';
import { Character } from 'app/shared/model/character.model';

describe('Component Tests', () => {
  describe('Character Management Update Component', () => {
    let comp: CharacterUpdateComponent;
    let fixture: ComponentFixture<CharacterUpdateComponent>;
    let service: CharacterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [CharacterUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CharacterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CharacterUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CharacterService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Character(123);
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
        const entity = new Character();
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
