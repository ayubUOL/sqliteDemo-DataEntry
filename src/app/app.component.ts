import { Component } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController } from '@ionic/angular';

import { DbService } from '../app/services/db.service';
import { ServerService } from '../app/services/server.service';
import { GlobalVariable } from './global';

import { Observable, Subscription, fromEvent } from 'rxjs';

import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public onlineEvent: Observable<Event>;
  public offlineEvent: Observable<Event>;
  public subscriptions: Subscription[] = [];

  constructor(private platform: Platform, private db: DbService, public global: GlobalVariable
    , public loadingCtrl: LoadingController, private network: Network) {

    if (this.network.type == 'none') {
      this.global.isOnline = false;
    } else {
      this.global.isOnline = true;
    }

    var that = this;
    let netStatus = setInterval(function () {
      that.onlineEvent = fromEvent(window, 'online');
      that.offlineEvent = fromEvent(window, 'offline');
      that.subscriptions.push(that.onlineEvent.subscribe(event => {
        that.global.isOnline = true;
        console.log('Network Online', that.global.isOnline);
      }));

      that.subscriptions.push(that.offlineEvent.subscribe(e => {
        that.global.isOnline = false;
        console.log('Network OFFline', that.global.isOnline);
      }));
    }, 1000);
  }

}
