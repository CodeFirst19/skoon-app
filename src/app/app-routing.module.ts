import { HomeComponent } from './home/home.component';
import { PasswordChangeComponent } from './authentication/profile/password-change/password-change.component';
import { ProfileViewComponent } from './authentication/profile/profile-view/profile-view.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { AuthGuard } from './authentication/auth.guard';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login/login.component';
import { ServiceViewComponent } from './service-requests/service-view/service-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceListComponent } from './service-requests/service-list/service-list.component';
import { ServiceCreateComponent } from './service-requests/service-create/service-create.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'my-profile', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'update-profile', component: PasswordChangeComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServiceListComponent, canActivate: [AuthGuard] },
  { path: 'request-service', component: ServiceCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
