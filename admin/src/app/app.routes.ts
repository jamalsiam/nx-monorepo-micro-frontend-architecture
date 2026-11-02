import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user-setting'
  },
  {
    path: 'user-setting',
    loadComponent: () =>
      import('./user-setting/user-setting.component').then(
        (m) => m.UserSettingComponent
      )
  },
  {
    path: 'item-setting',
    loadComponent: () =>
      import('./item-setting/item-setting.component').then(
        (m) => m.ItemSettingComponent
      )
  },
  {
    path: '**',
    redirectTo: 'user-setting'
  }
];
