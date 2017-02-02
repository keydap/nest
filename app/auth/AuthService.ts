import { Injectable } from "@angular/core"
import { Http, Response } from "@angular/http"
import { Router } from "@angular/router"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  token: string;
  error: string;
  private authUrl = "/v2/token";

  constructor(private http: Http) { }

  isLoggedIn(): boolean {
    return false;
  }

  login(username: string, password: string): void {
    console.log("calling login")
    let data = { "username": username, "domain": "example.com", "password": password }
    console.log(data)
    this.http.post(this.authUrl, data)
      .map(this.extractToken)
      .catch(this.handleError).subscribe();
  }

  private extractToken(res: Response) {
    let body = res.text();
    this.token = body || null;

    console.log(this.token);
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    this.error = errMsg;
    return Observable.throw(errMsg);
  }

}
