/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { HexSectorUpdateComponent } from 'app/entities/hex-sector/hex-sector-update.component';
import { HexSectorService } from 'app/entities/hex-sector/hex-sector.service';
import { HexSector } from 'app/shared/model/hex-sector.model';

describe('Component Tests', () => {
  describe('HexSector Management Update Component', () => {
    let comp: HexSectorUpdateComponent;
    let fixture: ComponentFixture<HexSectorUpdateComponent>;
    let service: HexSectorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [HexSectorUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(HexSectorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HexSectorUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(HexSectorService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new HexSector(123);
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
        const entity = new HexSector();
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
