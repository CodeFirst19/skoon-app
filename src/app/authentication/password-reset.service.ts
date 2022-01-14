import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {
  private isLoadingListener = new Subject<boolean>();

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  forgotPassword(email: string) {
    const userEmail = { email: email };
    this.http
      .post<{ status: string; token: string; data: {} }>(
        'http://localhost:3000/api/v1/users/forgot-password',
        userEmail
      )
      .subscribe((response) => {
        this.isLoadingListener.next(false);
        this.showSweetSuccessToast(
          'Sent',
          'We have sent you an email with a password reset link. Please check your email inbox or spam folder.',
          'success'
        );
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
        this.isLoadingListener.next(false);
        this.showSweetSuccessToast(
          'Updated',
          'You have successfully reset your password. Please login again with a new password.',
          'success'
        );
        this.router.navigate(['/signin']);
      });
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
        this.isLoadingListener.next(false);
        this.showSweetSuccessToast(
          'Updated',
          'Your password was successfully updated. Please login again with a new password.',
          'success'
        );
        this.authService.logout();
      });
  }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  showSweetSuccessToast(tittle: string, message: string, response) {
    Swal.fire(tittle, message, response);
  }
}
