import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SpComponent }  from './sp/sp.component';
import { HeaderComponent }  from './header/header.component';
import { UserComponent }  from './resources/user.component';
import { UserDetailComponent }  from './resources/user-detail.component';
import { PageNotFoundComponent }  from './misc/404.component';
import { LoginComponent }  from './auth/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  component: LoginComponent },
  { path: 'dashboard',  component: HeaderComponent },
  { path: 'sp',     component: SpComponent },
  { path: 'users',     component: UserComponent },
  { path: 'users/:id',     component: UserDetailComponent },
  //{ path: 'groups',     component: GroupsComponent },
  //{ path: 'devices',     component:DevicesComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
