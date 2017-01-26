import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule }  from './app-routing.module';
import { SpComponent }  from './sp/sp.component';
import { HeaderComponent }  from './header/header.component';
import { UserComponent }  from './resources/user.component';

@NgModule({
  imports:      [ BrowserModule, AppRoutingModule ],
  declarations: [ SpComponent, HeaderComponent, UserComponent ],
  bootstrap:    [ HeaderComponent ]
})
export class AppModule { }
