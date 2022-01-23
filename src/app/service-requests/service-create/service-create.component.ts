import { User } from 'src/app/users/user.model';
import { AuthService } from 'src/app/authentication/auth.service';
import { ServiceRequest } from './../service-requests.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  private userId: string;
  user: User;
  private userListenerSubs: Subscription;
  todayDate: Date = new Date();
  serviceTypes = [
    'Basic: R164.75 Wash, Dry & Fold',
    'Premium: R179.75 Iron Only',
    'Advanced: R207.25 Wash, Dry, Iron & Fold',
  ];
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

  showPaymentDetails = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private serviceRequestService: ServiceRequestService
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
  }

  onAddService(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.showPaymentDetails =
      form.value.paymentMethod === 'In-app payment' ? true : false;

    Swal.fire({
      title: 'Proceed?',
      text: "You won't be able to update this order once it is created!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3F51B5',
      cancelButtonColor: '#F44336',
      confirmButtonText: 'Yes, create it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        const service: ServiceRequest = {
          id: null,
          serviceType: form.value.serviceType,
          reference: form.value.reference,
          pickupTime: form.value.pickupTime,
          paymentMethod: form.value.paymentMethod,
          paymentStatus: 'Pending',
          status: this.status[0],
          requestedOn: new Date(Date.now()).toISOString(),
          returnedOn: null,
          owner: this.userId,
        };
        this.serviceRequestService.addService(service);
        form.resetForm();
      }
    });
  }

  ngOnDestroy(): void {
    this.userListenerSubs.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
