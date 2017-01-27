import 'rxjs/add/operator/switchMap';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from "./UserService"
import { User } from "./User"

@Component({
  moduleId: module.id,
  selector: 'user-detail',
  templateUrl: './user-detail.html'
})
export class UserDetailComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  get diagnose(): string {
    return JSON.stringify(this.user);
  }

  ngOnInit(): void {
    this.route.params.switchMap((params: Params) => this.userService.getUser(params['id']).catch(this.handleError))
      .subscribe(user => this.user = user);
  }
  private handleError(error: any): Promise<any> {
    console.error('nginit :', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
