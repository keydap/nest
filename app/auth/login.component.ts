import { Component } from "@angular/core"
import { Http, Response } from "@angular/http"
import { Router } from "@angular/router"
import { AuthService } from "./AuthService"

@Component({
  moduleId: module.id,
  //selector: "login",
  templateUrl: "./login.html"
})
export class LoginComponent {
  username: string;
  password: string;

  constructor(private http: Http, private router: Router, private authService: AuthService) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log(response);
        console.log(this.authService);
        console.log("logged in, token " + this.authService.token);
        if (this.authService.isLoggedIn()) {
          this.router.navigate(["/dashboard"]);
        }
      }
    );
  }

  errorMsg(): string {
    return this.authService.error;
  }
}
