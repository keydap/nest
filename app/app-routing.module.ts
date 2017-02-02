import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SpComponent } from './sp/sp.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './resources/user.component';
import { UserDetailComponent } from './resources/user-detail.component';
import { PageNotFoundComponent } from './misc/404.component';
import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './auth/AuthGuard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [AuthGuard], component: HeaderComponent },
  { path: 'sp', canActivate: [AuthGuard], component: SpComponent },
  { path: 'users', canActivate: [AuthGuard], component: UserComponent },
  { path: 'users/:id', canActivate: [AuthGuard], component: UserDetailComponent },
  //{ path: 'groups',     component: GroupsComponent },
  //{ path: 'devices',     component:DevicesComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
