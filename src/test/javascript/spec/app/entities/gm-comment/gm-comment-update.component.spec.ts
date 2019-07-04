/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { GMCommentUpdateComponent } from 'app/entities/gm-comment/gm-comment-update.component';
import { GMCommentService } from 'app/entities/gm-comment/gm-comment.service';
import { GMComment } from 'app/shared/model/gm-comment.model';

describe('Component Tests', () => {
  describe('GMComment Management Update Component', () => {
    let comp: GMCommentUpdateComponent;
    let fixture: ComponentFixture<GMCommentUpdateComponent>;
    let service: GMCommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [GMCommentUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(GMCommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GMCommentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GMCommentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new GMComment(123);
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
        const entity = new GMComment();
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
