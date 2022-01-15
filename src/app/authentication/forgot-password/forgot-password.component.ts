import { PasswordResetService } from './../password-reset.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  constructor(private passwordResetService: PasswordResetService) {}

  ngOnInit(): void {
    this.isLoadingSubscription = this.passwordResetService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
    this.errorSubscription = this.passwordResetService
      .getErrorListener()
      .subscribe((errorMsg) => {
        this.errorMsg = errorMsg.message;
      });
  }

  onForgotPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.passwordResetService.forgotPassword(form.value.email);
    form.resetForm();
  }
  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
