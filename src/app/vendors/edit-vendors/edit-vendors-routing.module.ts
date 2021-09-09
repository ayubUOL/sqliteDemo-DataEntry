import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditVendorsPage } from './edit-vendors.page';

const routes: Routes = [
  {
    path: '',
    component: EditVendorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditVendorsPageRoutingModule {}
