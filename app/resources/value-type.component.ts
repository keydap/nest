import { Component, Input, OnInit } from '@angular/core';
import { ValueTypeAt } from "./User"

@Component({
  moduleId: module.id,
  selector: 'value-type',
  templateUrl: './value-type.html'
})
export class ValueTypeComponent {
  @Input()
  vts: ValueTypeAt[];

  private selectedVts: any = {};

  get nonNullVts(): ValueTypeAt[] {
    return this.vts.filter(v => v != null);
  }

  add(): void {
    this.vts.push(new ValueTypeAt());
  }

  delete(): void {
    for(let i =0; i < this.vts.length; i++) {
      let tmp = this.vts[i];
      if(tmp == null) {
        continue;
      }

      let exists = this.selectedVts[tmp.value] != null;
      if(exists) {
        delete this.vts[i];
      }
    }

    this.selectedVts = {}
  }

  enableDelete(): boolean {
    return Object.keys(this.selectedVts).length != 0;
  }

  select(event: any, v: ValueTypeAt): void {
    let checked = event.target['checked']
    if(checked) {
      this.selectedVts[v.value] = true
    } else {
      delete this.selectedVts[v.value];
    }
  }
}
