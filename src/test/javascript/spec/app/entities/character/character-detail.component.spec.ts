/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Swanassistant2TestModule } from '../../../test.module';
import { CharacterDetailComponent } from 'app/entities/character/character-detail.component';
import { Character } from 'app/shared/model/character.model';

describe('Component Tests', () => {
  describe('Character Management Detail Component', () => {
    let comp: CharacterDetailComponent;
    let fixture: ComponentFixture<CharacterDetailComponent>;
    const route = ({ data: of({ character: new Character(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [Swanassistant2TestModule],
        declarations: [CharacterDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CharacterDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CharacterDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.character).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
