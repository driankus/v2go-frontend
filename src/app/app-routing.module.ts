import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth.guard';
import { DriverLayoutComponent } from './shared/components/layouts/driver-layout/driver-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { AuthComponent } from './views/auth/auth.component';

const routes: Routes = [
  // Default route
  {
    path: '',
    redirectTo: 'driver',
    pathMatch: 'full'
  },
  // AUTH Route
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        component: AuthComponent
      },
    ]
  },
  // Driver Routes
  {
    path: 'driver',
    component: DriverLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './views/driver/driver.module#DriverModule'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
