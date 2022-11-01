import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleTrackerPage } from './vehicle-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleTrackerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleTrackerPageRoutingModule {}
