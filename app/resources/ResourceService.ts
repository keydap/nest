import { Injectable } from "@angular/core"
import { Http, Headers, Response } from "@angular/http"
import { Router } from "@angular/router"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthService } from "../auth/AuthService"
import { Resource } from "./Resource"

@Injectable()
export class ResourceService {
  static apiBase = "/v2";

  constructor(private http: Http, private authService: AuthService) { }

  getResources(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getAutzHeader() }).map(response => {
      let searchResults = response.json();
      return searchResults;
    });
    //.catch(this.handleError);
  }

  private getAutzHeader(): Headers {
    let headers = new Headers();
    //headers.append('Authorization', 'Bearer ' + this.authService.token);
    headers.append('Content-Type', 'application/scim+json; charset=UTF-8');
    return headers;
  }

  getResource(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getAutzHeader() }).map(response => {
      let data = response.json();
      return data;
    });
  }

  addResource(url: string, data: any): Observable<any> {
    return this.http.post(url, data, { headers: this.getAutzHeader() }).map(response => {
      let data = response.json();
      return data;
    });
  }

  updateResource(url: string, data: any, version: string): Observable<any> {
    let headers = this.getAutzHeader();
    headers.append('If-None-Match', version);
    return this.http.patch(url, data, { headers }).map(response => {
      let data = response.json();
      return data;
    });
  }

  deleteResource(url: string, version: string): Observable<any> {
    let headers = this.getAutzHeader();
    headers.append('If-None-Match', version);
    return this.http.delete(url, { headers }).map(response => {
      let data = response.json();
      return data;
    });
  }
}
