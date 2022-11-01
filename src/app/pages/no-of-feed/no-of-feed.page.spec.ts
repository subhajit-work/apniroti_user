import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoOfFeedPage } from './no-of-feed.page';

describe('NoOfFeedPage', () => {
  let component: NoOfFeedPage;
  let fixture: ComponentFixture<NoOfFeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoOfFeedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoOfFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
