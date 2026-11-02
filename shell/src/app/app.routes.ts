import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'catalog'
  },
  {
    path: 'catalog',
    loadComponent: () =>
      loadRemoteModule('onlineShopping', './Component').then(
        (m) => m.AppComponent
      )
  },
  {
    path: 'admin',
    loadComponent: () =>
      loadRemoteModule('admin', './Component').then((m) => m.AppComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user-setting'
      },
      {
        path: 'user-setting',
        loadComponent: () =>
          loadRemoteModule('admin', './Routes').then(
            (m) => m.routes.find((r: any) => r.path === 'user-setting').loadComponent()
          )
      },
      {
        path: 'item-setting',
        loadComponent: () =>
          loadRemoteModule('admin', './Routes').then(
            (m) => m.routes.find((r: any) => r.path === 'item-setting').loadComponent()
          )
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      loadRemoteModule('dashboard', './DashboardComponent').then(
        (m) => m.DashboardComponent
      )
  },
  {
    path: '**',
    redirectTo: 'catalog'
  }
];
