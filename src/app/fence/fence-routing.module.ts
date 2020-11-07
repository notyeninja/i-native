import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FencePage } from './fence.page';

const routes: Routes = [
  {
    path: '',
    component: FencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FencePageRoutingModule {}
