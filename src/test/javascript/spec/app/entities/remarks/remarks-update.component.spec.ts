/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { RemarksUpdateComponent } from 'app/entities/remarks/remarks-update.component';
import { RemarksService } from 'app/entities/remarks/remarks.service';
import { Remarks } from 'app/shared/model/remarks.model';

describe('Component Tests', () => {
  describe('Remarks Management Update Component', () => {
    let comp: RemarksUpdateComponent;
    let fixture: ComponentFixture<RemarksUpdateComponent>;
    let service: RemarksService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [RemarksUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(RemarksUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RemarksUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RemarksService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Remarks(123);
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
        const entity = new Remarks();
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
