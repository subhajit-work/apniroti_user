import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonateUsPageRoutingModule } from './donate-us-routing.module';

import { DonateUsPage } from './donate-us.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DonateUsPageRoutingModule
  ],
  declarations: [DonateUsPage]
})
export class DonateUsPageModule {}
