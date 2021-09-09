import { Component } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController } from '@ionic/angular';

import { DbService } from '../app/services/db.service';
import { ServerService } from '../app/services/server.service';
import { GlobalVariable } from './global';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private db: DbService, public global: GlobalVariable
    , public loadingCtrl: LoadingController, private restAPI: ServerService) {

    var that = this;
    let netStatus = setInterval(function () {
      if (navigator.onLine) {
        that.global.isOnline = true;
        console.log("Online")
      } else {
        that.global.isOnline = false;
        console.log("Offline")
      }
    }, 1000);
  }
}
