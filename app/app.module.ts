import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SpComponent }  from './sp/sp.component';
import { HeaderComponent }  from './header/header.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ SpComponent, HeaderComponent ],
  bootstrap:    [ SpComponent, HeaderComponent ]
})
export class AppModule { }
