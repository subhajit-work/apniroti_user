import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoOfFeedPage } from './no-of-feed.page';

const routes: Routes = [
  {
    path: '',
    component: NoOfFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoOfFeedPageRoutingModule {}
