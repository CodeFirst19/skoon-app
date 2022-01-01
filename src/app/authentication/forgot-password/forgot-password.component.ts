import { PasswordResetService } from './../password-reset.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  emailSent = false;
  private emailSentSubscription: Subscription;

  constructor(private passwordReset: PasswordResetService) {}

  ngOnInit(): void {
    this.emailSentSubscription = this.passwordReset.getEmailSentUpdateListener()
      .subscribe((emailSent) => {
        this.emailSent = emailSent;
      })
  }

  onForgotPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.passwordReset.forgotPassword(form.value.email);
    form.resetForm();
  }
}
