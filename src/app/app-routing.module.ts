import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth.guard';
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
    },
    {
      path: 'pages',
      loadChildren: './views/pages/pages.module#PagesModule'
    },
    {
      path: 'uikits',
      loadChildren: './views/ui-kits/ui-kits.module#UiKitsModule'
    },
    {
      path: 'forms',
      loadChildren: './views/forms/forms.module#AppFormsModule'
    },
    {
      path: 'calendar',
      loadChildren: './views/calendar/calendar.module#CalendarAppModule'
    },
];

const routes: Routes = [
  // Default rout
  {
    path: '',
    redirectTo: 'driver',
    pathMatch: 'full'
  },
  // AUTH Rout
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
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
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
