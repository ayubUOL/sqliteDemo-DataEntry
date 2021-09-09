import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditVendorsPageRoutingModule } from './edit-vendors-routing.module';

import { EditVendorsPage } from './edit-vendors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditVendorsPageRoutingModule
  ],
  declarations: [EditVendorsPage]
})
export class EditVendorsPageModule {}
