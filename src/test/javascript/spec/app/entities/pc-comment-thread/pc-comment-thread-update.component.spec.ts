/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { PCCommentThreadUpdateComponent } from 'app/entities/pc-comment-thread/pc-comment-thread-update.component';
import { PCCommentThreadService } from 'app/entities/pc-comment-thread/pc-comment-thread.service';
import { PCCommentThread } from 'app/shared/model/pc-comment-thread.model';

describe('Component Tests', () => {
  describe('PCCommentThread Management Update Component', () => {
    let comp: PCCommentThreadUpdateComponent;
    let fixture: ComponentFixture<PCCommentThreadUpdateComponent>;
    let service: PCCommentThreadService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [PCCommentThreadUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PCCommentThreadUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PCCommentThreadUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PCCommentThreadService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PCCommentThread(123);
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
        const entity = new PCCommentThread();
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
