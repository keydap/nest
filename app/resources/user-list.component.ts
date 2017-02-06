import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { UserService } from "./UserService"
import { ResourceService } from "./ResourceService"
import { Resource } from "./Resource"

import { User } from "./User"
@Component({
  moduleId: module.id,
  selector: "user-list",
  templateUrl: "./user-list.html"
})
export class UserListComponent implements OnInit {
  users: User[];
  selectedUser: User;
  constructor(private router: Router, private rsService: ResourceService) { }

  ngOnInit(): void {
    console.log("initializing users");
    this.rsService.getResources(this.rsService.apiBase + "/Users")
      .subscribe(searchResults => {
        this.users = new Array<User>(searchResults.totalResults);
        let i = 0;
        for (let r of searchResults.Resources) {
          this.users[i] = new User().unmarshall(r);
          i++;
        }
      });
    //.catch(this.handleError);
  }

  selectUser(u: User): void {
    this.selectedUser = u;
  }

  showUser(): void {
    this.router.navigate(['/users', this.selectedUser.id])
  }

  private handleError(error: any) {
    console.error('An error occurred', error); // for demo purposes only
    return Observable.throw(error.message || error);
  }
}
