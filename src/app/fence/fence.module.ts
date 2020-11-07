import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FencePageRoutingModule } from './fence-routing.module';

import { FencePage } from './fence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FencePageRoutingModule
  ],
  declarations: [FencePage]
})
export class FencePageModule {}
