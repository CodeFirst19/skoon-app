import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() userIsAuthenticated = false;
  @Output() serviceSubscription = new EventEmitter<string>();

  buttonText: string;

  showSkipButton = false;

  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading = false;
  private isLoadingSubscription: Subscription;

  serviceTypes = {
    basic: 'a basic service for R659/pm',
    advanced: 'an advanced service for R829/pm',
    premium: 'a premium service for R719/pm',
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.buttonText = this.userIsAuthenticated ? 'Subscribe' : 'Get it now';

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

  onServiceSubscription(serviceType: string) {
    if (this.userIsAuthenticated) {
      this.serviceSubscription.emit(serviceType);
    } else {
      this.router.navigate(['/signin']);
    }
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.showSkipButton = false;
  }
}
