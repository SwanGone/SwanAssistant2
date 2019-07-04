/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Swanassistant2TestModule } from '../../../test.module';
import { AdjectiveComponent } from 'app/entities/adjective/adjective.component';
import { AdjectiveService } from 'app/entities/adjective/adjective.service';
import { Adjective } from 'app/shared/model/adjective.model';

describe('Component Tests', () => {
  describe('Adjective Management Component', () => {
    let comp: AdjectiveComponent;
    let fixture: ComponentFixture<AdjectiveComponent>;
    let service: AdjectiveService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [AdjectiveComponent],
        providers: []
      })
        .overrideTemplate(AdjectiveComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdjectiveComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AdjectiveService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Adjective(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.adjectives[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
