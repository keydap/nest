import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { SpComponent } from './sp/sp.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './resources/user.component';
import { UserDetailComponent } from './resources/user-detail.component';
import { UserService } from './resources/UserService';
import { PageNotFoundComponent }  from './misc/404.component';
import { LoginComponent }  from './auth/login.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpModule],
  providers: [UserService],
  declarations: [SpComponent, HeaderComponent, UserComponent,
                 UserDetailComponent, PageNotFoundComponent, LoginComponent],
  bootstrap: [HeaderComponent, LoginComponent]
})
export class AppModule { }
