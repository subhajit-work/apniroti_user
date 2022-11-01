import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BecomeAMemberPage } from './become-a-member.page';

describe('BecomeAMemberPage', () => {
  let component: BecomeAMemberPage;
  let fixture: ComponentFixture<BecomeAMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAMemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeAMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
