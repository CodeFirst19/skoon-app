import { AuthInterceptor } from './authentication/auth-interceptor';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxGaugeModule } from 'ngx-gauge';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AppRoutingModule } from './app-routing.module';

import { AngularMaterialModule } from './modules/angular-material.module';


import { AppComponent } from './app.component';
import { PaymentCreateComponent } from './payments/payment-create/payment-create.component';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';
import { ServiceListComponent } from './service-requests/service-list/service-list.component';
import { ServiceCreateComponent } from './service-requests/service-create/service-create.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { ServiceViewComponent } from './service-requests/service-view/service-view.component';
import { ServiceEditComponent } from './service-requests/service-edit/service-edit.component';


import { UserViewComponent } from './users/user-view/user-view.component';
import { ProfileViewComponent } from './authentication/profile/profile-view/profile-view.component';
import { PasswordChangeComponent } from './authentication/profile/password-change/password-change.component';
import { ProfileEditComponent } from './authentication/profile/profile-edit/profile-edit.component';
import { ServiceStatsComponent } from './service-requests/service-stats/service-stats.component';
import { UserStatsComponent } from './users/user-stats/user-stats.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserServicesComponent } from './users/user-services/user-services.component';
import { UserSubscriptionComponent } from './users/user-subscription/user-subscription.component';
import { GPayDisableDirective } from './g-pay-disable.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubscribeComponent } from './users/user-subscription/subscribe/subscribe.component';
import { AuthenticationModule } from './modules/authentication.module';

import { HeaderComponent } from './header/header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { FeaturesComponent } from './features/features.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    PaymentCreateComponent,
    HeaderComponent,
    PaymentListComponent,
    ServiceListComponent,
    ServiceCreateComponent,
    UserListComponent,

    ServiceViewComponent,
    ServiceEditComponent,

    UserViewComponent,
    ProfileViewComponent,
    PasswordChangeComponent,
    ProfileEditComponent,
    FooterComponent,
    BannerComponent,
    FeaturesComponent,
    ContactsComponent,
    HomeComponent,
    ServiceStatsComponent,
    UserStatsComponent,
    NotFoundComponent,
    UserServicesComponent,
    UserSubscriptionComponent,
    GPayDisableDirective,
    DashboardComponent,
    SubscribeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,

    NgxGaugeModule,
    GooglePayButtonModule,
    Angular4PaystackModule.forRoot(
      'pk_test_4a7d011b31248be9d5bd84e9b11ab193de825c02'
      ),
    AngularMaterialModule,
    AuthenticationModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
