import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentCreateComponent } from './payments/payment-create/payment-create.component';
import { UserSubscriptionComponent } from './users/user-subscription/user-subscription.component';
import { UserServicesComponent } from './users/user-services/user-services.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { PasswordChangeComponent } from './authentication/profile/password-change/password-change.component';
import { ProfileViewComponent } from './authentication/profile/profile-view/profile-view.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { AuthGuard } from './authentication/auth.guard';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceListComponent } from './service-requests/service-list/service-list.component';
import { ServiceCreateComponent } from './service-requests/service-create/service-create.component';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'my-profile', component: ProfileViewComponent, canActivate: [AuthGuard] },
      { path: 'subscribe', component: UserSubscriptionComponent, canActivate: [AuthGuard] },
      { path: 'update-password', component: PasswordChangeComponent, canActivate: [AuthGuard] },
      { path: 'all-users', component: UserListComponent, canActivate: [AuthGuard] },
      { path: 'all-orders', component: ServiceListComponent, canActivate: [AuthGuard] },
      { path: 'my-orders', component: UserServicesComponent, canActivate: [AuthGuard] },
      { path: 'place-order', component: ServiceCreateComponent, canActivate: [AuthGuard] },
      { path: 'payment-details', component: PaymentListComponent, canActivate: [AuthGuard] },
      { path: 'add-payment-details', component: PaymentCreateComponent, canActivate: [AuthGuard] },
    ],
    canActivate: [AuthGuard] 
  },
  { path: '404', component: NotFoundComponent },
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
