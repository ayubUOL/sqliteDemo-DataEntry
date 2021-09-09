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

  constructor(private http: HttpClient, public global: GlobalVariable) { 
    if(localStorage.getItem("access_token") != null || localStorage.getItem("access_token") != undefined){
      let token = localStorage.getItem("access_token")
      this.global.access_token = token.replace(/"/g,'');  //For removing "" from token
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

    let url = this.baseURL + 'add-leads';
    return this.http.post(url, formData, { headers: headers })
  }  
}
