import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { DriverLayoutComponent } from './shared/components/layouts/driver-layout/driver-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: './views/dashboard/dashboard.module#DashboardModule'
    },
];

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'dashboard/v1',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: './views/sessions/sessions.module#SessionsModule'
      }
    ]
  },
  // Driver Routs
  {
    path: 'driver',
    component: DriverLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './views/driver/driver.module#DriverModule'
      },
      {
        path: 'forms',
        loadChildren: './views/forms/forms.module#AppFormsModule'
      },
      {
        path: 'calendar',
        loadChildren: './views/calendar/calendar.module#CalendarAppModule'
      },
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    // component: DriverLayoutComponent,
    canActivate: [AuthGaurd],
    children: adminRoutes
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
