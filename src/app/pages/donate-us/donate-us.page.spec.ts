import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DonateUsPage } from './donate-us.page';

describe('DonateUsPage', () => {
  let component: DonateUsPage;
  let fixture: ComponentFixture<DonateUsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonateUsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DonateUsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
