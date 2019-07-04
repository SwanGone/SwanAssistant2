/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { BackstoryDetailComponent } from 'app/entities/backstory/backstory-detail.component';
import { Backstory } from 'app/shared/model/backstory.model';

describe('Component Tests', () => {
  describe('Backstory Management Detail Component', () => {
    let comp: BackstoryDetailComponent;
    let fixture: ComponentFixture<BackstoryDetailComponent>;
    const route = ({ data: of({ backstory: new Backstory(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [BackstoryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(BackstoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BackstoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.backstory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
