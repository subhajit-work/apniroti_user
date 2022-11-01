import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseDurationPage } from './choose-duration.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseDurationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseDurationPageRoutingModule {}
