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
  private userId: string;
  user: User;
  private userListenerSubs: Subscription;
  todayDate: Date = new Date();
  serviceTypes = [
    {
      name: 'Basic',
      price: 135.95,
      description: 'Basic: R135.95 Wash, Dry & Fold',
    },
    {
      name: 'Premium',
      price: 179.75,
      description: 'Premium: R179.75 Iron Only',
    },
    {
      name: 'Advanced',
      price: 189.95,
      description: 'Advanced: R49.95 Wash, Dry, Iron & Fold',
    },
  ];

  selectedServiceType: { name: string; price: number; description: string };
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

  showPaymentDetails = false;

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

    this.googlePaymentRequest();
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
        //this.isLoading = true;
        console.log(form.value);

        if (!this.user.subscription) {
          this.selectedServiceType = this.serviceTypes.find(
            (s) => s.name === form.value.serviceType
          );
          console.log(this.selectedServiceType);
        }

        // const service: ServiceRequest = {
        //   id: null,
        //   serviceType: this.selectedServiceType.name || this.user.subscription,
        //   reference: form.value.reference,
        //   pickupTime: form.value.pickupTime,
        //   paymentMethod: form.value.paymentMethod || 'Monthly subscription',
        //   paymentStatus: 'Pending',
        //   status: this.status[0],
        //   requestedOn: new Date(Date.now()).toISOString(),
        //   returnedOn: null,
        //   owner: this.userId,
        // };

        // this.serviceRequestService.addService(service);
        // form.resetForm();
        // console.log(service);
      }
    });
  }

  googlePaymentRequest() {
    this.paymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId',
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '100.00',
        currencyCode: 'USD',
        countryCode: 'US',
      },
    };
  }

  async onLoadPaymentData(event: Event) {
    const paymentData = (event as CustomEvent<google.payments.api.PaymentData>)
      .detail;
    const emptyCart = {}
    await this.serviceRequestService.processOrder(emptyCart, paymentData);
    this.router.navigate(['my-orders'])
  }

  ngOnDestroy(): void {
    this.userListenerSubs.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
