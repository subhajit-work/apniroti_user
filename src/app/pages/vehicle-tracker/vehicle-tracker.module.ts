import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleTrackerPageRoutingModule } from './vehicle-tracker-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { VehicleTrackerPage } from './vehicle-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleTrackerPageRoutingModule,
    SharedModule
  ],
  declarations: [VehicleTrackerPage]
})
export class VehicleTrackerPageModule {}
