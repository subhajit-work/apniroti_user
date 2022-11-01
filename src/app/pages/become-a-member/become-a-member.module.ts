import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BecomeAMemberPageRoutingModule } from './become-a-member-routing.module';

import { BecomeAMemberPage } from './become-a-member.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BecomeAMemberPageRoutingModule
  ],
  declarations: [BecomeAMemberPage]
})
export class BecomeAMemberPageModule {}
