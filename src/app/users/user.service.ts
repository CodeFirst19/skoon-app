import { AuthService } from './../authentication/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user.model';


@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];
  private user: User;
  private usersUpdated = new Subject<{ users: User[]; usersCount: number }>();
  private userUpdated = new Subject<User>();

  private errorListener = new Subject<{ message: string }>();
  private isLoadingListener = new Subject<boolean>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(page: number, limit: number) {
    const queryParameters = `?page=${page}&limit=${limit}`;
    this.http
      .get<{ status: string; result: number; data: {} }>(
        `http://localhost:3000/api/v1/users${queryParameters}`
      )
      .pipe(
        map((usersData) => {
          return {
            users: usersData.data['users'].map((user) => {
              return {
                preferredName: user.preferredName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                socialMediaHandles: user.socialMediaHandles,
                role: user.role,
                services: user.services,
              };
            }),
            totalUsers: usersData.result,
          };
        })
      )
      .subscribe((transformedUsersData) => {
        this.users = transformedUsersData.users;
        this.usersUpdated.next({
          users: [...this.users],
          usersCount: transformedUsersData.totalUsers,
        });
        this.isLoadingListener.next(false);
        this.errorListener.next({ message: null });
      }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
      });
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getUser(id: string) {
    this.http
      .get<{ status: string; data: {} }>(
        `http://localhost:3000/api/v1/users/${id}`
      )
      .subscribe((response) => {
          this.user = response.data['user'];
          this.userUpdated.next({ ...this.user });
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: null });
        }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
        }
      );
  }

  updateMe(user: {}) {
    this.isLoadingListener.next(true);
    this.http
      .patch<{ status: string; data: {} }>(
        'http://localhost:3000/api/v1/users/update-me',
        user
      )
      .subscribe((response) => {
        this.user = response.data['user'];
        this.userUpdated.next({ ...this.user });
        this.isLoadingListener.next(false);
        this.isLoadingListener.next(false);
        this.errorListener.next({ message: null });
        this.showSweetSuccessToast(
          'Updated',
          'Your profile was successfully updated',
          'success'
        );
      }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
           this.showSweetSuccessToast(
             'Update Failed!',
             'An error occurred while trying to update your profile.',
             'error'
           );
      });
  }

  deleteMe() {
    this.http
      .delete<{ status: string; data: null }>(
        'http://localhost:3000/api/v1/users/delete-me'
      )
      .subscribe((response) => {
        this.isLoadingListener.next(false);
        this.errorListener.next({ message: null });
        this.showSweetSuccessToast(
          'Deleted!',
          'Your account has been deleted permanently.',
          'success'
        );
        this.authService.logout();
      }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          this.showSweetSuccessToast(
            'Delete Failed!',
            'An error occurred while trying to delete your account.',
            'error'
          );
      });
  }

  getErrorListener() {
    return this.errorListener.asObservable();
  }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  showSweetSuccessToast(tittle: string, message: string, response) {
    Swal.fire(tittle, message, response);
  }
}