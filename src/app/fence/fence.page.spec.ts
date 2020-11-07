import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FencePage } from './fence.page';

describe('FencePage', () => {
  let component: FencePage;
  let fixture: ComponentFixture<FencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
