import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { GlobalVariable } from '../global';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  baseURL = 'http://collection.techdaftar.com/api/';
  // baseURL = 'http://collection.rennetech.com/api/';
  user: any;

  constructor(private http: HttpClient, public global: GlobalVariable) { 
    if(localStorage.getItem("access_token") != null || localStorage.getItem("access_token") != undefined){
      let token = localStorage.getItem("access_token")
      this.global.access_token = token.replace(/"/g,'');  //For removing "" from token
    }

    if(localStorage.getItem("user") != null || localStorage.getItem("user") != undefined){
      this.user = JSON.parse(localStorage.getItem("user"));
      this.global.userId = this.user.id
    }
  }

  login(email, password){
    let url = this.baseURL + 'login';
    var body = { 
      email: email,
	    password: password
    }

    return this.http.post(url, body)
  }

  getCategories(){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.global.access_token);

    let url = this.baseURL + 'category';
    return this.http.get(url, { headers: headers })
  }

  getLeads(){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.global.access_token);

    let url = this.baseURL + 'lead';
    return this.http.get(url, { headers: headers })
  }

  addLeads(formData){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.global.access_token);
    console.log("formdata Add lead -> ", formData)
    let url = this.baseURL + 'add-leads';
    return this.http.post(url, formData, { headers: headers })
  }  

  updateLead(formData){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + this.global.access_token);
    console.log("formdata lead update -> ", formData)
    let url = this.baseURL + 'update-lead';
    return this.http.post(url, formData, { headers: headers })
  }
}
