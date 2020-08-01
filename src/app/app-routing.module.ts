import { DefaultComponent } from './layouts/default/default.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './_guards';
import { AppointmentsComponent } from './modules/appointments/appointments.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      component: DashboardComponent,
      canActivate: [AuthGuard],
      data: { roles: [1] }
    }, {
      path: 'appointments',
      component: AppointmentsComponent,
      data: { roles: [1, 2] }
    }]
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
