import { Component } from "@angular/core"
import { Http, Response } from "@angular/http"
import {Router} from "@angular/router"
import {AuthService} from "./AuthService"

@Component({
  moduleId: module.id,
  //selector: "login",
  templateUrl: "./login.html"
})
export class LoginComponent {
  username: string;
  password: string;

  constructor(private http: Http, private router: Router, private authService: AuthService) { }

  // ngOnInit(): void {
  //   if(this.token != null) {
  //     this.router.navigate(['/dashboard'])
  //   }
  // }

  login(): void {
    this.authService.login(this.username, this.password);
  }

}
