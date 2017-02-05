import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';

import {AuthService} from "./AuthService"

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('------');
    console.log('AuthGuard#canActivate called');
    console.log(route);
    console.log(state);
    console.log('------');
    console.log(this.authService.isLoggedIn());
    if (!this.authService.isLoggedIn() && state.url != "/login") {
      console.log('redirecting to login from ' + state.url);
      this.router.navigate(['/login']);
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
