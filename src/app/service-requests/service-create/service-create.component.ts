import { Router } from '@angular/router';
import { User } from 'src/app/users/user.model';
import { AuthService } from 'src/app/authentication/auth.service';
import { ServiceRequest } from './../service-requests.model';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceRequestService } from './../service-request.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/users/user.service';
@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css'],
})
export class ServiceCreateComponent implements OnInit, OnDestroy {

  showAlerts = true;
  private userId: string;
  user: User;
  private userListenerSubs: Subscription;
  todayDate: Date = new Date();z
  serviceTypes = [
    {
      name: 'Basic',
      price: 35 * 100,
      description: 'Basic: R35 per kg - Wash, Dry & Fold',
    },
    {
      name: 'Premium',
      price: 40 * 100,
      description: 'Premium: R40 per kg - Iron Only',
    },
    {
      name: 'Advanced',
      price: 55 * 100,
      description: 'Advanced: R55 per kg - Wash, Dry, Iron & Fold',
    },
  ];

  selectedServiceType: any = {};
  paymentRequest: google.payments.api.PaymentDataRequest;

  paymentMethods = ['In-app payment', 'Cash on delivery'];
  //Load only on update
  status = [
    'Pending collection',
    'Collected',
    'Washing',
    'Drying',
    'Ironing',
    'Folding',
    'Returned',
    'Cancelled',
  ];

  errorMsg: string;
  private errorSubscription: Subscription;

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  locked = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private serviceRequestService: ServiceRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userService.getUser(this.userId);
    this.userListenerSubs = this.userService
      .getUserUpdateListener()
      .subscribe((user) => {
        this.user = user;
        this.isLoading = false;
      });
    this.isLoadingSubscription = this.serviceRequestService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
    this.errorSubscription = this.serviceRequestService
      .getErrorListener()
      .subscribe((errorMsg) => {
        this.errorMsg = errorMsg.message;
      });

    setTimeout(() => {
      this.showAlerts = false;
    }, 8000);

  }

  onSendRequest(form: NgForm) {
    // Check if form is valid
    if (form.invalid) {
      return;
    }

    //If user not subscribed, get service chosen - once off
    if (!this.user.subscription) {
      this.selectedServiceType = this.serviceTypes.find(
        (s) => s.name === form.value.serviceType
      );
    }

    // Show confirm dialogue
    Swal.fire({
      title: 'Place order',
      text: "You won't be able to update this order once it is created!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3F51B5',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Yes, proceed',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        
        const service: ServiceRequest = {
          id: null,
          serviceType: this.selectedServiceType.name || this.user.subscription,
          reference: form.value.reference,
          pickupTime: form.value.pickupTime,
          paymentMethod: form.value.paymentMethod || 'Monthly subscription',
          paymentStatus: this.user.subscription ? 'Monthly' : 'Pending',
          status: this.status[0],
          requestedOn: new Date(Date.now()).toISOString(),
          returnedOn: null,
          owner: this.userId,
        };
        
        //Request a service
        this.serviceRequestService.addService(service);
      }
    })
  }

  ngOnDestroy(): void {
    this.userListenerSubs.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
