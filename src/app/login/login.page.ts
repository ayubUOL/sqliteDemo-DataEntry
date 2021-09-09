import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { DbService } from '../services/db.service';
import { ServerService } from '../services/server.service';
import { GlobalVariable } from '../global';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mainForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController,
    private toast: ToastController, private restAPI: ServerService, 
    public loadingCtrl: LoadingController, public global: GlobalVariable,
    private db: DbService) { 
      
    this.mainForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    console.log("Local Storage User -> ", localStorage.getItem("user"));
    if(localStorage.getItem("user") == null || localStorage.getItem("user") == undefined){

    } else {
      this.categoryToDB();
      this.navCtrl.navigateRoot('/home');
    }
  }

  async categoryToDB(){
    const loading = await this.loadingCtrl.create({
      message: 'Fetching Categories...',
      duration: 2000
    });
    await loading.present();

    let response = this.restAPI.getCategories();
    response.subscribe((data: any) => {
      if(data.status){
        data.category;
        data.category.forEach(element => {
          this.db.addCategory(element.id, element.category_name).then((res) => {
            
          });
        });
      }
    }, error => {
      loading.dismiss();
      console.log(error);
    });
  }

  async openPage(page){
    if (!this.mainForm.valid) {
      this.submitAttempt = true;
      this.presentToast('Please fill the required fields');
    } else {
      const loading = await this.loadingCtrl.create({
        message: 'Logging In...',
        duration: 2000
      });
      await loading.present();

      let response = this.restAPI.login(this.mainForm.value.username, this.mainForm.value.password);
      response.subscribe((data: any) => {
        loading.dismiss();
        console.log("Data res: ", data);
        if(data.status){
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("access_token", JSON.stringify(data.access_token));
          this.global.access_token = data.access_token;
          this.categoryToDB();
          this.navCtrl.navigateRoot(page);
        } else {
          this.presentToast(data.message.email[0])
        }
      }, error => {
        loading.dismiss();
        console.log(error);
      });
    }
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
        message: msg,
        duration: 1500
    });
    toast.present();
  }
}
