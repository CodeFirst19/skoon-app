import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { UserService } from '../users/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeaturesComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  buttonText: string = this.userIsAuthenticated ? 'Subscribe' : 'Get it now';
  showSkipButton: boolean = false;

  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  serviceTypes = {
    basic: 'a basic service for R659/pm',
    advanced: 'an advanced service for R829/pm',
    premium: 'a premium service for R719/pm',
  };

  constructor(
    private authService: AuthService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  onServiceSubscription(serviceType) {
    if (!this.userIsAuthenticated) {
      this.router.navigate(['/signup']);
    } else {
      this.showSkipButton = true;
      Swal.fire({
        title: 'New Subscription',
        text: `You are about to subscribe for ${this.serviceTypes[serviceType]}`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3F51B5',
        cancelButtonColor: '#F44336',
        confirmButtonText: 'Yes, subscribe!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          const newSubscription = { subscription: serviceType };
          this.userService.updateMe(newSubscription);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.showSkipButton = false;
  }
}
