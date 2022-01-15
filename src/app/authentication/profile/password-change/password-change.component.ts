import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PasswordResetService } from '../../password-reset.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css'],
})
export class PasswordChangeComponent implements OnInit, OnDestroy {
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

  onChangePassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.passwordResetService.updatePassword(
      form.value.password,
      form.value.newPassword,
      form.value.newPasswordConfirm
    );
    form.resetForm();
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
