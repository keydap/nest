import 'rxjs/add/operator/switchMap';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { ResourceService } from "./ResourceService"
import { User } from "./User"
import {BaseResourceComponent} from "./base-resource.component"

@Component({
  moduleId: module.id,
  selector: 'user-detail',
  templateUrl: './user-detail.html'
})
export class UserDetailComponent extends BaseResourceComponent implements OnInit {
  user: User;

  constructor(
    private rsService: ResourceService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    super();
  }

  get diagnose(): string {
    return JSON.stringify(this.user);
  }

  ngOnInit(): void {
    this.route.params.switchMap((params: Params) =>
      this.rsService.getResource(ResourceService.apiBase + "/Users/" + params['id'])
        .catch(this.handleError))
      .subscribe(data => {
        this.user = new User().deserialize(data);
      });
  }
  private handleError(error: any): Promise<any> {
    console.error('nginit :', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
