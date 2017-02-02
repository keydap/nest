import { Component } from "@angular/core"

import {AuthService} from "../auth/AuthService"

@Component({
  moduleId: module.id,
  // selector: "header",
  templateUrl: "./header.html"
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  showServiceProviders(): void {
  }

  show(): boolean {
    return this.authService.isLoggedIn();
  }
}
