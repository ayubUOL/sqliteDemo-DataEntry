import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVendorsPageRoutingModule } from './add-vendors-routing.module';

import { AddVendorsPage } from './add-vendors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddVendorsPageRoutingModule
  ],
  declarations: [AddVendorsPage]
})
export class AddVendorsPageModule {}
