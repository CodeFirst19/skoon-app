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

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  constructor(
    private passwordResetService: PasswordResetService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        this.passwordResetToken = paramMap.get('token');
        console.log(this.passwordResetToken);
      }
    });
    this.isLoadingSubscription = this.passwordResetService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

  onResetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.passwordResetService.resetPassword(
      form.value.newPassword,
      form.value.newPasswordConfirm,
      this.passwordResetToken
    );
    form.resetForm();
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
  }
}
