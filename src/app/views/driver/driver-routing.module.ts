import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMapComponent } from '../home-map/home-map.component';
import { ProfileComponent } from './profile/profile.component';

const driverRoutes: Routes = [
    { path: '', component: HomeMapComponent },
    { path: 'my-account', component: ProfileComponent },
];

@NgModule({
    imports: [RouterModule.forChild(driverRoutes)],
    exports: [RouterModule]
  })
export class DriverRoutingModule { }
