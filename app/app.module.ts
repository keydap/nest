import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { SpComponent } from './sp/sp.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './resources/user.component';
import { UserDetailComponent } from './resources/user-detail.component';
import { UserService } from './resources/UserService';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [UserService],
  declarations: [SpComponent, HeaderComponent, UserComponent, UserDetailComponent],
  bootstrap: [HeaderComponent]
})
export class AppModule { }
