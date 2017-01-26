import { Component } from "@angular/core"
import { UserService } from "./UserService"
import { Resource } from "./Resource"
@Component({
  selector: "user",
  providers: [UserService],
  templateUrl: "./app/resources/user.html"
})
export class UserComponent {
  constructor(private userService: UserService) { }

  get users(): Resource[] {
    return this.userService.getUsers();
  }
}
