import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css'],
})
export class UserStatsComponent implements OnInit, OnDestroy {
  totalUsers: number = 0;
  stats: { users: number; administrators: number; total: number };
  gaugeType = 'semi';
  gaugeValue = 28.3;
  // gaugeLabel = 'Speed';
  gaugeAppendText;
  thickValue = 4;
  foregroundColor = '#303F9F';

  private userSubscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService
      .getUsersUpdateListener()
      .subscribe((userData: { users: User[]; usersCount: number }) => {
        this.totalUsers = userData.usersCount;
        this.stats = this.reportStats(userData.users);
      });
  }

  reportStats(services: User[]) {
    let users = 0;
    let admins = 0;

    services.forEach((user) => {
      if (user.role === 'user') {
        users += 1;
      } else {
        admins += 1;
      }
    });

    return {
      users: users,
      administrators: admins,
      total: this.totalUsers,
    };
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
