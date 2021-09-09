import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GlobalVariable } from '../app/global';

// plugins
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  providers: [ SQLite, File, Camera, Base64, FilePath, FileChooser, Media,
    GlobalVariable,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
