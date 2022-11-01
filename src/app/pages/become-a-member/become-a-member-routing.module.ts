import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BecomeAMemberPage } from './become-a-member.page';

const routes: Routes = [
  {
    path: '',
    component: BecomeAMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BecomeAMemberPageRoutingModule {}
