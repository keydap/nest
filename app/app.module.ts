import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { SpComponent } from './sp/sp.component';
import { HeaderComponent } from './header/header.component';
import { UserListComponent } from './resources/user-list.component';
import { UserDetailComponent } from './resources/user-detail.component';
import { UserService } from './resources/UserService';
import { PageNotFoundComponent }  from './misc/404.component';
import { LoginComponent }  from './auth/login.component';
import { AuthService }  from './auth/AuthService';
import { AuthGuard }  from './auth/AuthGuard';
import {ResourceService} from "./resources/ResourceService"
import {RolesFormatter} from "./resources/roles.pipe"

@NgModule({
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpModule],
  providers: [UserService, AuthService, AuthGuard, ResourceService],
  declarations: [SpComponent, HeaderComponent, UserListComponent,
                 UserDetailComponent, PageNotFoundComponent, LoginComponent,
                 RolesFormatter],
  bootstrap: [HeaderComponent, LoginComponent]
})
export class AppModule { }
