import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth.gaurd';
import { DriverLayoutComponent } from './shared/components/layouts/driver-layout/driver-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';
import { AuthComponent } from './views/auth/auth.component';

const adminRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: './views/dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'icons',
      loadChildren: './views/icons/icons.module#IconsModule'
    }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'driver',
    pathMatch: 'full'
  },
  // AUTH Routs
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

  // Driver Routs
  {
    path: 'driver',
    component: DriverLayoutComponent,
    canActivate: [AuthGuard],
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
      { path: 'auth', component: AuthComponent },
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    canActivate: [AuthGuard],
    children: adminRoutes
  },
  // {
  //   path: '',
  //   component: AuthLayoutComponent,
  //   children: [
  //     {
  //       path: 'sessions',
  //       loadChildren: './views/sessions/sessions.module#SessionsModule'
  //     }
  //   ]
  // },
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
