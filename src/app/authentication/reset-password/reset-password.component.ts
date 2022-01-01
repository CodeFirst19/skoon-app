import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PasswordResetService } from '../password-reset.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  private token: string;
  passwordResetSuccessful = false;
  private passResetSuccessSubscription: Subscription;

  constructor(
    private passwordReset: PasswordResetService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        this.token = paramMap.get('token');
        console.log(this.token);
      }
    });

    
  }

  onResetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.passwordReset.resetPassword(
      form.value.newPassword,
      form.value.newPasswordConfirm
    );
    form.resetForm();
  }
}
