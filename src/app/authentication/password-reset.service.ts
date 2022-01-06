import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private emailSentUpdated = new Subject<boolean>();
  private passwordUpdated = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  forgotPassword(email: string) {
    const userEmail = { email: email };
    this.http
      .post<{ status: string; token: string; data: {} }>(
        'http://localhost:3000/api/v1/users/forgot-password',
        userEmail
      )
      .subscribe((response) => {
        this.emailSentUpdated.next(true);
      });
  }

  resetPassword(
    newPassword: string,
    newPasswordConfirm: string,
    passwordResetToken: string
  ) {
    const token = passwordResetToken;
    const userPasswords = {
      password: newPassword,
      passwordConfirm: newPasswordConfirm,
    };
    this.http
      .patch<{ status: string; token: string; data: {} }>(
        `http://localhost:3000/api/v1/users/reset-password/${token}`,
        userPasswords
      )
      .subscribe((response) => {
        this.passwordUpdated.next(true);
      });
  }

  getEmailSentUpdateListener() {
    return this.emailSentUpdated.asObservable();
  }

  getPasswordUpdated() {
    return this.passwordUpdated.asObservable();
  }

  updatePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirm: string
  ) {
    const userPasswords = {
      passwordCurrent: currentPassword,
      password: newPassword,
      passwordConfirm: passwordConfirm,
    };

    this.http
      .patch<{ status: string; token: string; data: {} }>(
        'http://localhost:3000/api/v1/users/update-my-password',
        userPasswords
      )
      .subscribe((response) => {
        this.passwordUpdated.next(true);
      });
  }
}