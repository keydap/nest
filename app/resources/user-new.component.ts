import { Component, OnInit } from "@angular/core"
import { Router, ActivatedRoute, Params } from "@angular/router"
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { UserService } from "./UserService"
import { ResourceService } from "./ResourceService"
import { User } from "./User"
import {BaseResourceComponent} from "./base-resource.component"

@Component({
  moduleId: module.id,
  templateUrl: "./user-detail.html"
})
export class NewUserComponent extends BaseResourceComponent {
  user: User;

  constructor(
    private rsService: ResourceService,
    private router: Router,
    private location: Location
  ) {
    super();
    this.isNew = true;
    this.user = new User();
  }

  get diagnose(): string {
    return JSON.stringify(this.user);
  }

  save(): void {
    this.user.schemas.push(User.schemaId);
    // let json = JSON.stringify(this.user);
    // let obj = JSON.parse(json);
    delete this.user.enterpriseUser;
    this.rsService.addResource(ResourceService.apiBase+ "/Users", this.user)
    .subscribe(resource => {
        this.router.navigate(["/users", resource.id]);
    });
  }
}
