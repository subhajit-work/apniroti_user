import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BecomeAVolunteerPageRoutingModule } from './become-a-volunteer-routing.module';

import { BecomeAVolunteerPage } from './become-a-volunteer.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BecomeAVolunteerPageRoutingModule
  ],
  declarations: [BecomeAVolunteerPage]
})
export class BecomeAVolunteerPageModule {}
