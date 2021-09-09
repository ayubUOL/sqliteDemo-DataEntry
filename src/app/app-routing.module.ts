import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'add-vendors',
    loadChildren: () => import('./vendors/add-vendors/add-vendors.module').then( m => m.AddVendorsPageModule)
  },
  {
    path: 'edit-vendors',
    loadChildren: () => import('./vendors/edit-vendors/edit-vendors.module').then( m => m.EditVendorsPageModule)
  },
  {
    path: 'records',
    loadChildren: () => import('./records/records.module').then( m => m.RecordsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
