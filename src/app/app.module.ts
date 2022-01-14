import { AuthInterceptor } from './authentication/auth-interceptor';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaymentCreateComponent } from './payments/payment-create/payment-create.component';
import { HeaderComponent } from './header/header/header.component';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';
import { ServiceListComponent } from './service-requests/service-list/service-list.component';
import { ServiceCreateComponent } from './service-requests/service-create/service-create.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { LoginComponent } from './authentication/login/login/login.component';
import { ServiceViewComponent } from './service-requests/service-view/service-view.component';
import { ServiceEditComponent } from './service-requests/service-edit/service-edit.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { ProfileViewComponent } from './authentication/profile/profile-view/profile-view.component';
import { PasswordChangeComponent } from './authentication/profile/password-change/password-change.component';
import { ProfileEditComponent } from './authentication/profile/profile-edit/profile-edit.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { FeaturesComponent } from './features/features.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HomeComponent } from './home/home.component';
import { ServiceStatsComponent } from './service-requests/service-stats/service-stats.component';
import { UserStatsComponent } from './users/user-stats/user-stats.component';


@NgModule({
  declarations: [
    AppComponent,
    PaymentCreateComponent,
    HeaderComponent,
    PaymentListComponent,
    ServiceListComponent,
    ServiceCreateComponent,
    UserListComponent,
    LoginComponent,
    ServiceViewComponent,
    ServiceEditComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    NgxGaugeModule,

    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '801836438696-eojjl4c8oob292rf61a6r6l9kfh1st6f.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('417082700164927'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
