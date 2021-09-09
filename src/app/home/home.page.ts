import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ModalController, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

import { DbService } from '../services/db.service';
import { ServerService } from '../services/server.service';

import { GlobalVariable } from '../global';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  category_list = [];
  vendors_list: any = [];
  private win: any = window;
  syncInterval: any;

  constructor(public navCtrl: NavController, private toast: ToastController,
    private db: DbService, private ref: ChangeDetectorRef, private restAPI: ServerService,
    public loadingCtrl: LoadingController, public global: GlobalVariable, private file: File) {

  }

  openPage(page) {
    this.navCtrl.navigateForward(page);
  }

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.getCategories();
      }
    });

    var that = this;
    this.syncInterval = setInterval(function () {
      if (that.global.isOnline) {
        console.log("- Is Online - ", that.vendors_list)
        if (that.vendors_list.length > 0) {
          that.vendors_list.forEach(lead => {
            if (lead.isUploaded == 0) {
              let formData = new FormData();
              formData.append('lead_name', lead.name)
              formData.append('business_name', lead.businessname)
              formData.append('mobile', lead.mobile)
              formData.append('whatsapp', lead.whatsapp)
              formData.append('address', lead.address)
              formData.append('category_id', lead.categoryid)

              let filename = lead.image.substr(lead.image.lastIndexOf('/') + 1);
              if (filename.includes("?")) {
                filename = filename.substr(0, filename.lastIndexOf('?'));
              }
              let dirpath = lead.image.substr(0, lead.image.lastIndexOf('/') + 1);
              dirpath = dirpath.includes('file://') ? dirpath : 'file://' + dirpath;

              // that.file.readAsArrayBuffer(dirpath, filename).then((blob) => {
              //   formData.append('image', blob);
              //   that.uploadLeads(formData, lead)
              // }, (err) => {
              //   console.log("Move File Err -> ", err);
              // });
            }
          });
        }
      } else {

      }
    }, 10000)
  }

  async uploadLeads(formData, lead) {
    let response = this.restAPI.addLeads(formData)
    response.subscribe((data: any) => {
      console.log("Lead Uploaded -> ", data)

      lead.isUploaded = 1;
      let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      this.db.updateVendor(lead.id, lead.name, lead.businessname, lead.mobile,
        lead.whatsapp, lead.categoryid, lead.address, lead.userid, currentTime,
        lead.image, lead.isUploaded, lead.imgBlob
      ).then((res) => {
        this.getVendors();
      })
    }, error => {
      console.log(error);
    });
  }

  ionViewWillLeave() {
    clearInterval(this.syncInterval)
  }

  async getCategories() {
    this.db.fetchCategories().subscribe(item => {
      this.category_list = [];
      this.category_list = item;
      this.getVendors();
    });
  }

  getVendors() {
    this.db.getVendors();
    this.db.fetchVendors().subscribe(item => {
      console.log("Getting Vendors in Home -> ", item);
      this.vendors_list = [];
      this.vendors_list = JSON.parse(JSON.stringify(item));

      this.vendors_list.forEach(element => {
        this.category_list.forEach(category => {
          if (element.categoryid == category.id) {
            element.businessType = category.category_name;
          }
        });
      });

      setTimeout(() => {
        this.ref.detectChanges()
      }, 400)
    });
  }

  getRestVendors() {
    let response = this.restAPI.getLeads()
    response.subscribe((data: any) => {
      if (data.status) {
        this.vendors_list = [];
        this.vendors_list = data.data
      }
    }, error => {
      console.log(error);
    });
  }

  async delVendors(id) {
    this.db.deleteVendor(id).then(async (res) => {
      let toast = await this.toast.create({
        message: 'Customer deleted',
        duration: 1500
      });
      toast.present();
    });
    this.getVendors();
  }

  editAlert(item) {
    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    this.navCtrl.navigateForward('/edit-vendors', navigationExtras);
  }
}
