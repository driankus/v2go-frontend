import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { DriverLayoutComponent } from './shared/components/layouts/driver-layout/driver-layout.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: './views/dashboard/dashboard.module#DashboardModule'
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
      path: 'invoice',
      loadChildren: './views/invoice/invoice.module#InvoiceModule'
    },
    {
      path: 'inbox',
      loadChildren: './views/inbox/inbox.module#InboxModule'
    },
    {
      path: 'calendar',
      loadChildren: './views/calendar/calendar.module#CalendarAppModule'
    },
    {
      path: 'chat',
      loadChildren: './views/chat/chat.module#ChatModule'
    },
    {
      path: 'tables',
      loadChildren: './views/data-tables/data-tables.module#DataTablesModule'
    },
    {
      path: 'pages',
      loadChildren: './views/pages/pages.module#PagesModule'
    },
    {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
    }
  ];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/v1',
    pathMatch: 'full'
  },
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
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'others',
        loadChildren: './views/others/others.module#OthersModule'
      }
    ]
  },
  // Driver Rout
  // {
  //   path: 'driver',
  //   component: DriverLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: './views/others/others.module#OthersModule'
  //     }
  //   ]
  // },
  {
    path: '',
    component: DriverLayoutComponent,
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
