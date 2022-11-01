import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseDurationPage } from './choose-duration.page';

describe('ChooseDurationPage', () => {
  let component: ChooseDurationPage;
  let fixture: ComponentFixture<ChooseDurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseDurationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
