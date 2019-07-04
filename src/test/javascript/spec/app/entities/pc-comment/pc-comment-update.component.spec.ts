/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentUpdateComponent } from 'app/entities/pc-comment/pc-comment-update.component';
import { PCCommentService } from 'app/entities/pc-comment/pc-comment.service';
import { PCComment } from 'app/shared/model/pc-comment.model';

describe('Component Tests', () => {
  describe('PCComment Management Update Component', () => {
    let comp: PCCommentUpdateComponent;
    let fixture: ComponentFixture<PCCommentUpdateComponent>;
    let service: PCCommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PCCommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PCCommentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PCCommentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PCComment(123);
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
        const entity = new PCComment();
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
