import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MemberLoginPage } from './member-login.page';

describe('MemberLoginPage', () => {
  let component: MemberLoginPage;
  let fixture: ComponentFixture<MemberLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
