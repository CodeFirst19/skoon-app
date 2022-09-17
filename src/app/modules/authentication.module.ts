import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//Exposing angular material to this module, otherwise it will not be exposed by default.
import { AngularMaterialModule } from './angular-material.module';

import { SignupComponent } from './../authentication/signup/signup.component';
import { LoginComponent } from '../authentication/login/login/login.component';
import { ForgotPasswordComponent } from './../authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './../authentication/reset-password/reset-password.component';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

@NgModule({
  // You can remove the imports array and just have only exports to avoid redundancy
  declarations: [
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    SocialLoginModule,
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
              '1077472243313-scr2n2j3dfsl4uas62arocuuv411aui8.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('417082700164927'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})

export class AuthenticationModule {}
