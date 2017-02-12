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

  add(): void {
    if (this.vts == null) {
      this.vts = [];
    }

    this.vts.push(new ValueTypeAt());
  }

  delete(): void {
  }

  select(event: any, v: ValueTypeAt): void {
    console.log('email value ' + v.value);
    console.log(event);
  }
}
