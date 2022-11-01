import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CmsPage } from './cms.page';

describe('CmsPage', () => {
  let component: CmsPage;
  let fixture: ComponentFixture<CmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
