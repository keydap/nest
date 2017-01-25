import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SpComponent }  from './sp/sp.component';
import { HeaderComponent }  from './header/header.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: HeaderComponent },
  { path: 'sp',     component: SpComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
