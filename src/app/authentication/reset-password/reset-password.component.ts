import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PasswordResetService } from '../password-reset.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private passwordResetToken: string;
  passwordResetSuccessful = false;
  private passResetSuccessSubscription: Subscription;

  constructor(
    private passwordReset: PasswordResetService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        this.passwordResetToken = paramMap.get('token');
        console.log(this.passwordResetToken);
      }
    });

    this.passResetSuccessSubscription = this.passwordReset
      .getPasswordUpdated()
      .subscribe((passwordUpdated) => {
        this.passwordResetSuccessful = passwordUpdated;
        console.log(this.passwordResetSuccessful);
      });
  }

  onResetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.passwordReset.resetPassword(
      form.value.newPassword,
      form.value.newPasswordConfirm,
      this.passwordResetToken
    );
    form.resetForm();
  }

  ngOnDestroy(): void {
   this.passResetSuccessSubscription.add();
  }
}
