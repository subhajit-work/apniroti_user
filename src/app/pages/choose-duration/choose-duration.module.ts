import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseDurationPageRoutingModule } from './choose-duration-routing.module';

import { ChooseDurationPage } from './choose-duration.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChooseDurationPageRoutingModule
  ],
  declarations: [ChooseDurationPage]
})
export class ChooseDurationPageModule {}
