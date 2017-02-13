import { Component, Input, OnInit } from '@angular/core';
import { Address } from "./User"

@Component({
  moduleId: module.id,
  selector: 'user-address',
  templateUrl: './user-address.html'
})
export class UserAddressComponent {
  @Input()
  addresses: Address[];

  private selectedVts: any = {};

  get notNullAddresses(): Address[] {
    return this.addresses.filter(ad => ad != null);
  }

  add(): void {
    this.addresses.push(new Address());
  }

  delete(): void {
    for(let i =0; i < this.addresses.length; i++) {
      let tmp = this.addresses[i];
      if(tmp == null) {
        continue;
      }

      let exists = this.selectedVts[tmp.type] != null;
      if(exists) {
        delete this.addresses[i];
      }
    }

    this.selectedVts = {}
  }

  enableDelete(): boolean {
    return Object.keys(this.selectedVts).length != 0;
  }

  select(event: any, v: Address): void {
    let checked = event.target['checked']
    if(checked) {
      this.selectedVts[v.type] = true
    } else {
      delete this.selectedVts[v.type];
    }
  }
}
