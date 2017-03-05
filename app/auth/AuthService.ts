import { Injectable } from "@angular/core"
import { Http, Response } from "@angular/http"
import { Router } from "@angular/router"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  token: any;
  error: string;
  domain: string;
  userId: string;
  private authUrl = "/v2/token";
  private oidcUrl = "/oauth2/authorize?client_id=adminapp0&redirect_uri=http://localhost:7000/";
  private userInfoUrl = "/v2/Me";

  constructor(private http: Http) {
    //FIXME getting _body:ProgressEvent error
      /*console.log('token is null, attempting to fetch /Me')
      this.http.get(this.userInfoUrl)
      .map((response) => {
        console.log('mapped /Me')
        this.token = response.json();
      })
      .subscribe(
        data => {
          console.log('subscribe /Me')
          this.parseUserDetails(this);
        },
        error => console.log(error),
        () => console.log('completed')
      );*/
      this.token = {"active":true,"displayName":"Administrator","emails":[{"primary":true,"type":"work","value":"admin@example.com"}],"groups":[{"display":"Administrator","value":"00000000-1000-0000-0000-000000000000"}],"id":"10000000-0000-0000-0000-000000000000","meta":{"created":"2017-03-05T08:29:33Z","lastModified":"2017-03-05T08:29:33Z","location":"/Users/10000000-0000-0000-0000-000000000000","resourceType":"User","version":"1488702573994"},"password":"{sha256}CBWogzdUQovRpURIL6twunmekxd7rJNxYIYuOU2lXG7d9beDO_npew","schemas":["urn:ietf:params:scim:schemas:core:2.0:User"],"userName":"admin"}
      this.parseUserDetails(this);
  }

  isLoggedIn(): boolean {
    //console.log(this.token);
    return (this.token != null);
  }

  login(username: string, password: string): Observable<boolean> {
    console.log("calling login")
    let data = { "username": username, "domain": "example.com", "password": password }
    console.log(data)
    return this.http.post(this.authUrl, data)
      .map((response) => {
        this.token = response.text();
        this.parseUserDetails(this);
      })
      .catch(this.handleError);
  }

  private parseUserDetails(self: AuthService): void {
    console.log('parseUserDetails')
    self.domain = 'example.com';
    self.userId = this.token['id'];
  }

  private handleError(error: Response | any) {
    console.log('error')
    console.log(error)
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
