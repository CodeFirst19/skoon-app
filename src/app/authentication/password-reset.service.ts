import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private emailSentUpdated = new Subject<boolean>();
  private passwordResetUpdated = new Subject<boolean>();

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

  resetPassword(newPassword: string, newPasswordConfirm: string) {
    const userPasswords = {
      newPassword: newPassword,
      confirmPassword: newPasswordConfirm,
    };
    this.http
      .post<{ status: string; token: string; data: {} }>(
        'http://localhost:3000/api/v1/users/forgot-password',
        userPasswords
      )
      .subscribe((response) => {
        this.passwordResetUpdated.next(true)
      });
  }

  getEmailSentUpdateListener() {
    return this.emailSentUpdated.asObservable();
  }

  getPasswordResetUpdated() {
    return this.passwordResetUpdated.asObservable();
  }
}