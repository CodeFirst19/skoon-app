import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';


@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; usersCount: number }>();

  constructor(private http: HttpClient) {}

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
                socialMediaHandles: user.socialMedHandles,
                services: user.services
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
        // console.log(transformedServicesData.services);
      });
  }
}