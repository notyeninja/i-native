import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'geoloc',
    loadChildren: () => import('./geoloc/geoloc.module').then( m => m.GeolocPageModule)
  },
  {
    path: 'sensors',
    loadChildren: () => import('./sensors/sensors.module').then( m => m.SensorsPageModule)
  },
  {
    path: 'fence',
    loadChildren: () => import('./fence/fence.module').then( m => m.FencePageModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then( m => m.ErrorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
