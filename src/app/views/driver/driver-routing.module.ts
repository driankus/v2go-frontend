import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMapComponent } from '../home-map/home-map.component';

const driverRoutes: Routes = [
    {
      path: '',
      component: HomeMapComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(driverRoutes)],
    exports: [RouterModule]
  })
export class DriverRoutingModule { }
