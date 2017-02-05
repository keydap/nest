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
  apiBase = "/v2";

  constructor(private http: Http, private authService: AuthService) { }

  getResources(url: string): Observable<Resource[]> {
    return this.http.get(url, { headers: this.getAutzHeader() }).map(response => {
      let searchResults = response.json();
      let arr = new Array<Resource>(searchResults.totalResults);
      let i = 0;
      for (let r of searchResults.Resources) {
        arr[i] = new Resource(r);
      }
      return arr;
    });
    //.catch(this.handleError);
  }

  private getAutzHeader(): Headers {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.token);
    return headers;
  }

  getResource(url: string): Observable<Resource> {
    return this.http.get(url, { headers: this.getAutzHeader() }).map(response => {
      let data = response.json();
      return new Resource(data);
    });
  }
}
