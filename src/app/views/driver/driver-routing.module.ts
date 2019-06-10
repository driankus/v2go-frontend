import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMapComponent } from '../home-map/home-map.component';
import { ReservationComponent } from '../reservation/reservation.component';

const driverRoutes: Routes = [
    {
      path: '',
      component: HomeMapComponent
    },
    {
      path: 'reserve/:nk',
      component: ReservationComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(driverRoutes)],
    exports: [RouterModule]
  })
export class DriverRoutingModule { }
