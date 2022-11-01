import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BecomeAVolunteerPage } from './become-a-volunteer.page';

const routes: Routes = [
  {
    path: '',
    component: BecomeAVolunteerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BecomeAVolunteerPageRoutingModule {}
