import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

// Classes
import { Vendor } from './vendor';
import { Category } from './category';

import { GlobalVariable } from '../global';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private storage: SQLiteObject;
  productsList = new BehaviorSubject([]);
  vendorsList = new BehaviorSubject([]);
  categoryList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private platform: Platform, private sqlite: SQLite,
    public global: GlobalVariable) {

    this.platform.ready().then(() => {
      if (localStorage.getItem("app_firstRun") == 'false' || localStorage.getItem("app_firstRun") == null) {
        localStorage.setItem("app_firstRun", 'true');

        this.sqlite.create({
          name: 'rennetech_db.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('create table products(id, product_name VARCHAR(32), sku VARCHAR(32))', [])
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));
  
          db.executeSql('create table leads(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR, businessname VARCHAR, mobile VARCHAR, whatsapp VARCHAR, categoryid INTEGER, address TEXT, userid VARCHAR, inserttime VARCHAR, image TEXT, isUploaded INTEGER, isChanged INTEGER, ins_time INTEGER)', [])
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));

          db.executeSql('create table categories(id INTEGER, category_name VARCHAR, parent_id INTEGER)', [])
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));
  
          this.storage = db;
          this.isDbReady.next(true);
        });
      } else {
        this.sqlite.create({
          name: 'rennetech_db.db',
          location: 'default'
        }).then((db: SQLiteObject) => {

          this.storage = db;
          this.isDbReady.next(true);
          this.getVendors();
          this.getCategories();
        });
      }      
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  // Add Products
  addProduct(id, product_name, sku) {
    let data = [id, product_name, sku];
    return this.storage.executeSql('INSERT INTO products (id, product_name, sku) VALUES (?, ?, ?)', data).then(res => {
      console.log("Add Product -> ", res)
      // this.getSongs();
    });
  }

  // Fetch Vendors
  fetchVendors(): Observable<Vendor[]> {
    return this.vendorsList.asObservable();
  }

  getVendors() {
    return this.storage.executeSql('SELECT * FROM leads WHERE userid = ?', [ this.global.userId ]).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            name: res.rows.item(i).name, 
            businessname: res.rows.item(i).businessname,
            mobile: res.rows.item(i).mobile, whatsapp: res.rows.item(i).whatsapp,
            categoryid: res.rows.item(i).categoryid, address: res.rows.item(i).address,
            image: res.rows.item(i).image, time: res.rows.item(i).inserttime, userid: res.rows.item(i).userid,
            isUploaded: res.rows.item(i).isUploaded, isChanged: res.rows.item(i).isChanged, 
            ins_time: res.rows.item(i).ins_time
          });
        }
      }
      this.vendorsList.next(items);
    });
  }

  // Add Vendors
  addVendors(name, businessname, mobile, whatsapp, categoryid, address, userid, inserttime, image, ins_time) {
    let data = [name, businessname, mobile, whatsapp, categoryid, address, userid, inserttime, image, 0, 0, ins_time];
    return this.storage.executeSql('INSERT INTO leads (name, businessname, mobile, whatsapp, categoryid, address, userid, inserttime, image, isUploaded, isChanged, ins_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(res => {
      this.getVendors();
    });
  }

  // Update
  updateVendor(id, name, businessname, mobile, whatsapp, categoryid, address, userid, inserttime, image, isUploaded, isChanged, ins_time) {
    let data = [name, businessname, mobile, whatsapp, categoryid, address, userid, inserttime, image, isUploaded, isChanged, ins_time, id];
    return this.storage.executeSql('UPDATE leads SET name = ?, businessname = ?, mobile = ?, whatsapp = ?, categoryid = ?, address = ?, userid = ?, inserttime = ?, image = ?, isUploaded = ?, isChanged = ?, ins_time = ? WHERE id = ?', data)
    .then(data => {
      this.getVendors();
    })
  }

  // Delete
  deleteVendor(id) {
    return this.storage.executeSql('DELETE FROM leads WHERE id = ?', [id])
      .then(_ => {
        this.getVendors();
      });
  }

  addCategory(id, categoryname) {
    let data = [id, categoryname, 1];
    return this.storage.executeSql('INSERT INTO categories (id, category_name, parent_id) VALUES (?, ?, ?)', data).then(res => {
      console.log("Add Category -> ", res)
      this.getCategories();
    });
  }

  fetchCategories(): Observable<Category[]> {
    return this.categoryList.asObservable();
  }

  getCategories() {
    return this.storage.executeSql('SELECT * FROM categories', []).then(res => {
      let items = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            category_name: res.rows.item(i).category_name, 
            parent_id: res.rows.item(i).parent_id,
          });
        }
      }
      this.categoryList.next(items);
    });
  }
}
