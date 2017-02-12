import 'rxjs/add/operator/switchMap';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { createScimPatch } from "scim-rfc6902"
import { Operation } from "scim-rfc6902/diff"

import { ResourceService } from "./ResourceService"
import { User } from "./User"
import { BaseResourceComponent } from "./base-resource.component"

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
    private router: Router,
    private location: Location
  ) {
    super();
  }

  get diagnose(): any {
    return this.user;
  }

  patchOps(): Operation[] {
    let input = new User().deserialize(this.user.data);
    delete input.data;
    let patch = createScimPatch(input, this.user.serializeForPatch());
    return patch;
  }

  ngOnInit(): void {
    this.route.params.switchMap((params: Params) =>
      this.rsService.getResource(ResourceService.apiBase + "/Users/" + params['id'])
        .catch(this.handleError))
      .subscribe(data => {
        this.user = new User().deserialize(data);
      });

    this.route.params.subscribe((params: Params) => {
      this.rsService.getResource(ResourceService.apiBase + "/Users/" + params['id'])
    });
  }

  save(): void {
    let ops = this.patchOps();
    if (ops.length == 0) {
      return;
    }

    let preq = { "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"] };
    preq['Operations'] = ops;

    this.rsService.updateResource(ResourceService.apiBase + "/Users/" + this.user.id, preq, this.user.meta.version)
      .subscribe(response => {
        this.router.navigate(["/users", this.user.id]);
      });
  }

  deleteUser(): void {
    this.rsService.deleteResource(ResourceService.apiBase + "/Users/" + this.user.id, this.user.meta.version)
      .subscribe(response => {
        this.router.navigate(["/users"]);
      });
  }

  private handleError(error: any): Promise<any> {
    console.error('nginit :', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
