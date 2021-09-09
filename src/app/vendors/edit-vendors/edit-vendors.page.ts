import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, Platform, NavController, LoadingController } from '@ionic/angular';

import { DbService } from '../../services/db.service';
import { ServerService } from '../../services/server.service';

// Plugins
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-vendors',
  templateUrl: './edit-vendors.page.html',
  styleUrls: ['./edit-vendors.page.scss'],
})
export class EditVendorsPage implements OnInit {
  mainForm: FormGroup;
  submitAttempt: boolean = false;

  category_list = [];

  dateTimeInterval: any;
  currentTime: any;
  currentDate: any;

  imageURI: any = '';
  categoryid = '';
  userid = 1;
  isUploaded: any;
  imgBlob: any;
  private win: any = window;
  itemId = '';

  show_businessTypeList: boolean = false;
  businessType: any;

  searchItem = '';
  searchedItems = [];

  constructor(private db: DbService, public formBuilder: FormBuilder,
    private toast: ToastController, public navCtrl: NavController, private router: Router,
    private route: ActivatedRoute, public alertController: AlertController,
    private camera: Camera, private file: File, public platform: Platform,
    private restAPI: ServerService, public loadingCtrl: LoadingController) {

    this.db.dbState().subscribe((res) => {
      if (res) {
        this.getCategories();
      }
    });

    this.mainForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      businessname: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required])],
      whatsapp: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      categoryid: ['', Validators.compose([Validators.required])],
      image: ['', Validators.compose([Validators.required])]
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        if (this.router.getCurrentNavigation().extras.state.item == undefined) {

        } else {
          let detail = this.router.getCurrentNavigation().extras.state.item;

          this.itemId = detail.id;
          this.isUploaded = detail.isUploaded;
          this.imgBlob = detail.imgBlob;
          this.mainForm.controls['name'].setValue(detail.name);
          this.mainForm.controls['businessname'].setValue(detail.businessname);
          this.mainForm.controls['mobile'].setValue(detail.mobile);
          this.mainForm.controls['whatsapp'].setValue(detail.whatsapp);
          this.mainForm.controls['address'].setValue(detail.address);
          this.mainForm.controls['categoryid'].setValue(detail.categoryid);
          this.mainForm.controls['image'].setValue(detail.image);

          this.category_list.forEach(element => {
            if(element.id == this.mainForm.value.categoryid){
              this.businessType = element.category_name;
            }
          });
          console.log("Detail -> ", detail, this.category_list)
        }
      }
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.dateTimeInterval = setInterval(() => {
      this.currentDate = Date.now();
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }, 1000)
  }

  ionViewWillLeave() {
    clearInterval(this.dateTimeInterval);
  }

  closeSearch() {
    this.show_businessTypeList = false;
  }

  openBusinessList() {
    this.show_businessTypeList = true;
  }

  selectType(item) {
    this.businessType = item.category_name;
    this.mainForm.controls['categoryid'].setValue(item.id);
  }

  searchCategory(){
    console.log("searching -> ", this.searchItem)
    this.searchedItems = [];

    if(this.searchItem == ''){
      this.searchedItems = [];
    }

    let val = this.searchItem;

    if (val) {
      if (val && val.trim() != '') {
        this.category_list.filter((element) => {
          let nameSTR = String(element.category_name.toLowerCase());

          if(nameSTR.includes(val)){
            this.searchedItems.push(element); 
          }
        });

        // Remove duplicates from searched Items
        this.searchedItems = this.searchedItems.reduce((unique, o) => {
          if (!unique.some(obj => obj.name === o.name)) {
            unique.push(o);
          }
          return unique;
        }, []);
      } else {
        
      }
    }
  }

  openPage(page) {
    if(page == '/home'){
      this.navCtrl.navigateRoot(page);
    } else {
      this.router.navigateByUrl(page, { replaceUrl: true }) 
    }
  }

  async getCategories() {
    this.db.fetchCategories().subscribe(item => {
      console.log("Getting Category After Adding -> ", item);
      this.category_list = item;
    });
  }

  getVendors() {
    this.db.fetchVendors().subscribe(item => {
      console.log("Getting Vendors in Edit -> ", item);
    });
  }

  async addBusinessType() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Create Business type',
      mode: "ios",
      inputs: [
        {
          name: 'type',
          type: 'text',
          placeholder: 'Enter Business type'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data.type);
            let lastData = this.category_list[this.category_list.length - 1];
            this.db.addCategory(lastData.id + 1, data.type).then((res) => {
              this.getCategories();
              this.presentToast('Record Saved');
            })
          }
        }
      ]
    });

    await alert.present();
  }

  editData(){ 
    if (!this.mainForm.valid) {
      this.submitAttempt = true;
      this.presentToast('Please fill the required fields');
    } else {
      this.submitAttempt = false;
      
      if(this.imageURI == ''){
        // if image not changed
        let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        this.db.updateVendor(this.itemId, this.mainForm.value.name, this.mainForm.value.businessname,
          this.mainForm.value.mobile, this.mainForm.value.whatsapp, this.mainForm.value.categoryid,
          this.mainForm.value.address, this.userid, currentTime, this.mainForm.value.image, this.isUploaded, this.imgBlob
        ).then((res) => {
          this.getVendors();
          this.mainForm.reset();
          this.mainForm.controls['image'].setValue('');
          this.presentToast('Record Saved');
          this.openPage('/home');
        }, err => {
          console.log("Update query Err -> ", err)
        });
      } else {
        // if image is changed
        this.uriToNativeURL(this.imageURI);
      }
    }
  }

  async imagePickAlert() {
    const alert = await this.alertController.create({
      cssClass: 'edit-alert-css',
      header: 'Take shop, business card or client image',
      mode: 'ios',
      buttons: [
        {
          text: 'Open Camera',
          cssClass: 'edit-alert-btn',
          handler: (blah) => {
            this.openCamera();
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Open Gallery',
          cssClass: 'edit-alert-btn',
          handler: () => {
            this.openGallery();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
    alert.onDidDismiss().then((data) => {

    });
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(async (uri) => {
      // imageData is either a base64 encoded string or a file URI
      this.mainForm.controls['image'].setValue('');
      this.mainForm.controls['image'].setValue(this.win.Ionic.WebView.convertFileSrc(uri))

      console.log("Camera Img -> ", this.mainForm.value.image)
      this.imageURI = uri;
    }, (err) => {
      console.log("Error from camera ", err);// Handle error
    });
  }

  openGallery() {
    const options: CameraOptions =
    {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then(async (uri) => {
      this.mainForm.controls['image'].setValue('');
      this.mainForm.controls['image'].setValue(this.win.Ionic.WebView.convertFileSrc(uri))
      this.imageURI = uri;
      console.log("Gallery Image -> ", uri);
    }, (err) => {
      console.log("Error from gallery ", err);
    });
  }

  async uriToNativeURL(uri) {
    let filename = uri.substr(uri.lastIndexOf('/') + 1);
    if (filename.includes("?")) {
      filename = filename.substr(0, filename.lastIndexOf('?'));
    }
    let dirpath = uri.substr(0, uri.lastIndexOf('/') + 1);
    dirpath = dirpath.includes('file://') ? dirpath : 'file://' + dirpath;

    try {
      const dirUrl = await this.file.resolveDirectoryUrl(dirpath);
      const retrievedFile = await this.file.getFile(dirUrl, filename, {});
      retrievedFile.file(async data => {
        console.log('NativeURL = ' + retrievedFile.nativeURL);
        this.moveFile(dirpath, retrievedFile.nativeURL, filename)
      });
    } catch (err) {
      console.log('resolveDirectoryUrl error=' + err);
      return
    }
  }

  moveFile(dirpath, fileurl: string, name) {
    this.file.readAsArrayBuffer(dirpath, name).then((result) => {
      console.log("Res read as buffer -> ", result);
      var fileblob = result
      console.log("Blob -> ", fileblob)
      console.log("Name -> ", name)
      if (this.platform.is('ios')) {
        this.writeFileToDir(this.file.documentsDirectory, name, fileblob);
      } else {
        this.writeFileToDir(this.file.externalApplicationStorageDirectory, name, fileblob);
      }
    }, (err) => {
      console.log("Move File -> ", err);
    });
  }

  writeFileToDir(dirType, fileName, fileBlob) {
    this.file.checkDir(dirType, 'RenneTechChatImg').then(_ => {
      this.file.writeFile(dirType + 'RenneTechChatImg/', fileName, fileBlob, { replace: false }).then(entry => {

        let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        this.db.updateVendor(this.itemId, this.mainForm.value.name, this.mainForm.value.businessname,
          this.mainForm.value.mobile, this.mainForm.value.whatsapp, this.mainForm.value.categoryid,
          this.mainForm.value.address, this.userid, currentTime, entry.nativeURL, this.isUploaded, fileBlob
        ).then((res) => {
          this.getVendors();
          this.mainForm.reset();
          this.mainForm.controls['image'].setValue('');
          this.presentToast('Record Saved');
          this.openPage('/home');
        });

      }).catch(err => {
        console.log("Write to Dir err -> ", err);
      })
    }).catch(err => {
      this.file.createDir(dirType, 'RenneTechChatImg', false).then(result => {
        this.file.writeFile(dirType + 'RenneTechChatImg/', fileName, fileBlob, { replace: false }).then(entry => {
          console.log("After wirting to file -> ", entry);
          // this.setImageSrc(entry.nativeURL, entry);

          let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          this.db.updateVendor(this.itemId,this.mainForm.value.name, this.mainForm.value.businessname,
            this.mainForm.value.mobile, this.mainForm.value.whatsapp, this.mainForm.value.categoryid,
            this.mainForm.value.address, this.userid, currentTime, entry.nativeURL, this.isUploaded, fileBlob
          ).then((res) => {
            this.getVendors();
            this.presentToast('Record Saved');
            this.mainForm.reset();
            this.mainForm.controls['image'].setValue('');
            this.openPage('/home');
          })

        }).catch(err => {
          console.log("Write to Dir err -> ", err);
        });
      }).catch(err => {
        console.log("Create Dir err -> ", err);
      });
    });
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 1500
    });
    toast.present();
  }
}
