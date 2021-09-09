import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class GlobalVariable {
    isOnline: boolean = false;
    access_token: any;

    constructor(public toastCtrl: ToastController) { }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 1500
        });
        toast.present();
    }
}