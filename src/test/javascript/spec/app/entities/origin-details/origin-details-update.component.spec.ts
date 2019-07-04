/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { OriginDetailsUpdateComponent } from 'app/entities/origin-details/origin-details-update.component';
import { OriginDetailsService } from 'app/entities/origin-details/origin-details.service';
import { OriginDetails } from 'app/shared/model/origin-details.model';

describe('Component Tests', () => {
  describe('OriginDetails Management Update Component', () => {
    let comp: OriginDetailsUpdateComponent;
    let fixture: ComponentFixture<OriginDetailsUpdateComponent>;
    let service: OriginDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [OriginDetailsUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OriginDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OriginDetailsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OriginDetailsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OriginDetails(123);
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
        const entity = new OriginDetails();
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
