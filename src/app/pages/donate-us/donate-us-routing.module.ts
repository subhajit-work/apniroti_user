import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonateUsPage } from './donate-us.page';

const routes: Routes = [
  {
    path: '',
    component: DonateUsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonateUsPageRoutingModule {}
