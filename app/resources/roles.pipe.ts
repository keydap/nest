import { Pipe, PipeTransform } from "@angular/core"

@Pipe({ name: 'formatRoles' })
export class RolesFormatter implements PipeTransform {
  transform(groups: Array<Object>): string {
    if (groups == undefined || groups == null) {
      return '-None-';
    }

    let fmt = '';
    for (let g of groups) {
      if (fmt != '') {
        fmt += '|';
      }

      let display = g['display'];
      if (display == undefined || display == null) {
        display = '-No Name-';
      }

      fmt += display;
    }

    return fmt;
  }
}
