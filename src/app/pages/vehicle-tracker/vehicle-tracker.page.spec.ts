import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VehicleTrackerPage } from './vehicle-tracker.page';

describe('VehicleTrackerPage', () => {
  let component: VehicleTrackerPage;
  let fixture: ComponentFixture<VehicleTrackerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTrackerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
