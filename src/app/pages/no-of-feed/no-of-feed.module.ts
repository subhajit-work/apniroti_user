import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoOfFeedPageRoutingModule } from './no-of-feed-routing.module';

import { NoOfFeedPage } from './no-of-feed.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NoOfFeedPageRoutingModule
  ],
  declarations: [NoOfFeedPage]
})
export class NoOfFeedPageModule {}
