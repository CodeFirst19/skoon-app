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
  passwordUpdatedSuccessful = false;
  private passUpdatedSuccessSubscription: Subscription;

  constructor(private passwordReset: PasswordResetService) {}

  ngOnInit(): void {
    this.passUpdatedSuccessSubscription = this.passwordReset
      .getPasswordUpdated()
      .subscribe((passwordUpdated) => {
        this.passwordUpdatedSuccessful = passwordUpdated;
        console.log(this.passwordUpdatedSuccessful);
      });
  }

  onChangePassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.passwordReset.updatePassword(
      form.value.password,
      form.value.newPassword,
      form.value.newPasswordConfirm
    );
    form.resetForm();
  }

  ngOnDestroy(): void {
    this.passUpdatedSuccessSubscription.unsubscribe()
  }
}
