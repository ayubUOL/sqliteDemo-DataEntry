import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVendorsPage } from './add-vendors.page';

const routes: Routes = [
  {
    path: '',
    component: AddVendorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVendorsPageRoutingModule {}
