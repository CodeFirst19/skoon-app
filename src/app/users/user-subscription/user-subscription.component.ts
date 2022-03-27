import { User } from './../user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/users/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { SubscribeComponent } from './subscribe/subscribe.component';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css'],
})
export class UserSubscriptionComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;

  userEmail: string;
  private userListenerSubs: Subscription;

  subscription = {
    basic: {
      amount: 67900,
      plan: 'PLN_sapr20mw8gpnk2s',
      description: 'a Basic service for R659/pm',
    },
    premium: {
      amount: 74900,
      plan: 'PLN_4efrsetavkvke1f',
      description: 'a Premium service for R719/pm',
    },
    advanced: {
      amount: 85900,
      plan: 'PLN_3op64og71uzzwki',
      description: 'an Advanced service for R829/pm',
    },
  };

  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading = false;
  private isLoadingSubscription: Subscription;

  reference = `ref-${Math.ceil(Math.random() * 10e13)}`;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();
    this.userService.getUser(userId);
    this.userListenerSubs = this.userService
      .getUserUpdateListener()
      .subscribe((user) => {
        this.userEmail = user.email;
      });

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoadingSubscription = this.userService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    this.errorSubscription = this.userService
      .getErrorListener()
      .subscribe((errorMsg) => {
        this.errorMsg = errorMsg.message;
      });
  }

  addSubscription(serviceSubscription: string) {
    if (!this.userIsAuthenticated) {
      this.router.navigate(['/signup']);
    } else {
      Swal.fire({
        title: 'New Subscription',
        text: `You are about to subscribe for ${
          this.subscription[serviceSubscription.toLowerCase()]['description']
        }`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3F51B5',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Yes, subscribe!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialog.open(SubscribeComponent, {
            panelClass: 'dialog-responsive',
            autoFocus: false,
            data: {
              email: this.userEmail,
              serviceName: serviceSubscription,
              interval: 'Monthly',
              amount:
                this.subscription[serviceSubscription.toLowerCase()]['amount'],
              plan: this.subscription[serviceSubscription.toLowerCase()][
                'plan'
              ],
            },
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
