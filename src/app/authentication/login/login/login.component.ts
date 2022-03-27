import { AuthService } from './../../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Login } from '../login.model';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.authService.socialLogin(user);
      }
    });
    this.errorSubscription = this.authService.getErrorListener()
      .subscribe((errorMsg) => {
        this.errorMsg = errorMsg.message;
      })

    this.isLoadingSubscription = this.authService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const user: Login = {
      email: form.value.email,
      password: form.value.password,
    };

    this.authService.login(user);
    form.resetForm();
  }

  onSignInWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  onSignInWithFaceBook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
