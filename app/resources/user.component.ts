import { Component, OnInit } from "@angular/core"
import {Router} from "@angular/router"

import { UserService } from "./UserService"
import { User } from "./User"
@Component({
  moduleId: module.id,
  selector: "user", // FIXME rename to user-list or users
  templateUrl: "./user.html"
})
export class UserComponent implements OnInit {
  selectedUser: User;
  users: User[] = [];
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().then(users => this.users = users.slice()).catch(this.handleError);
  }

  selectUser(u: User): void {
    this.selectedUser = u;
  }

  showUser(): void {
    this.router.navigate(['/users', this.selectedUser.id()])
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
