import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('flipCardBasic') flipCardBasic: ElementRef;
  @ViewChild('flipCardInnerBasic') flipCardInnerBasic: ElementRef;

  @ViewChild('flipCardAdvanced') flipCardAdvanced: ElementRef;
  @ViewChild('flipCardInnerAdvanced') flipCardInnerAdvanced: ElementRef;

  @ViewChild('flipCardPremium') flipCardPremium: ElementRef;
  @ViewChild('flipCardInnerPremium') flipCardInnerPremium: ElementRef;

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

  onViewMore(serviceType: string) {
    switch (serviceType) {
      case 'basic':
        this.flipCardBasic.nativeElement.classList.add('flip-card-hover');
        this.flipCardInnerBasic.nativeElement.classList.add(
          'flip-card-inner-transform'
        );
        break;
      case 'advanced':
        this.flipCardAdvanced.nativeElement.classList.add('flip-card-hover');
        this.flipCardInnerAdvanced.nativeElement.classList.add(
          'flip-card-inner-transform'
        );
        break;
      case 'premium':
        this.flipCardPremium.nativeElement.classList.add('flip-card-hover');
        this.flipCardInnerPremium.nativeElement.classList.add(
          'flip-card-inner-transform'
        );
        break;
    }
  }

  onCancel(serviceType: string) {
    switch (serviceType) {
      case 'basic':
        this.flipCardBasic.nativeElement.classList.remove('flip-card-hover');
        this.flipCardInnerBasic.nativeElement.classList.remove(
          'flip-card-inner-transform'
        );
        console.log('removed');
        break;
      case 'advanced':
        this.flipCardAdvanced.nativeElement.classList.remove('flip-card-hover');
        this.flipCardInnerAdvanced.nativeElement.classList.remove(
          'flip-card-inner-transform'
        );
        break;
      case 'premium':
        this.flipCardPremium.nativeElement.classList.remove('flip-card-hover');
        this.flipCardInnerPremium.nativeElement.classList.remove(
          'flip-card-inner-transform'
        );
        break;
    }
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.showSkipButton = false;
  }
}
