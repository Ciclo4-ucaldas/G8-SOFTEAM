import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'menu', component: MenuComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
