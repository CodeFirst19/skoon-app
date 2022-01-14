import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Login } from './login/login.model';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Signup } from './signup/signup.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated: boolean = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  private isLoadingListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private route: Router
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signup(user: Signup) {
    this.http
      .post<{ status: string; token: string; expiresIn: number; data: {} }>(
        'http://localhost:3000/api/v1/users/signup',
        user
      )
      .subscribe((response) => {
        const token = response.token;
        this.isLoadingListener.next(false);
        this.route.navigate(['/signin']);
      });
  }

  login(user: Login) {
    this.http
      .post<{ status: string; token: string; expiresIn: number; data: {} }>(
        'http://localhost:3000/api/v1/users/login',
        user
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration / 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration);
          const user = response.data['user'];
          this.SaveAuthData(user._id, token, expirationDate);
          this.isLoadingListener.next(false);
          this.route.navigate(['/services']);
        }
      });
  }

  socialLogin(user: SocialUser) {
    this.http
      .post<{ status: string; token: string; expiresIn: number; data: {} }>(
        'http://localhost:3000/api/v1/users/social-login',
        user
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration / 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration);
          const user = response.data['user'];
          this.SaveAuthData(user._id, token, expirationDate);
          this.isLoadingListener.next(false);
          this.route.navigate(['/services']);
          console.log(response);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.isLoadingListener.next(false);
      this.route.navigate(['/services']);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.socialAuthService.signOut();
    clearTimeout(this.tokenTimer);
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.route.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private SaveAuthData(id: string, token: string, expirationDate: Date) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return undefined;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  getUserId() {
    const id = localStorage.getItem('id');
    return id;
  }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }
}
