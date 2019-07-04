/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexMapUpdateComponent } from 'app/entities/hex-map/hex-map-update.component';
import { HexMapService } from 'app/entities/hex-map/hex-map.service';
import { HexMap } from 'app/shared/model/hex-map.model';

describe('Component Tests', () => {
  describe('HexMap Management Update Component', () => {
    let comp: HexMapUpdateComponent;
    let fixture: ComponentFixture<HexMapUpdateComponent>;
    let service: HexMapService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexMapUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(HexMapUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HexMapUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(HexMapService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new HexMap(123);
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
        const entity = new HexMap();
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
