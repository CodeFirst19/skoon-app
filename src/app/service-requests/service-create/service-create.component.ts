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
  // For paystack payment
  currency = 'ZAR';
  paymentReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  showPaymentServices = false;
  order: { email: string; amount: number; reference: string };
  paymentStatus: string;

  showAlerts = true;
  private userId: string;
  user: User;
  private userListenerSubs: Subscription;
  todayDate: Date = new Date();
  serviceTypes = [
    {
      name: 'Basic',
      price: 136 * 100,
      description: 'Basic: R135.95 Wash, Dry & Fold',
    },
    {
      name: 'Premium',
      price: 180 * 100,
      description: 'Premium: R179.75 Iron Only',
    },
    {
      name: 'Advanced',
      price: 190 * 100,
      description: 'Advanced: R49.95 Wash, Dry, Iron & Fold',
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

  inAppPayment = false;

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

    this.googlePaymentRequest();

    setTimeout(() => {
      this.showAlerts = false;
    }, 8000);

    //Paystack payment reference
    this.paymentReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  // Form values
  pickupTime: string;
  paymentMethod: string;
  serviceReference: string;

  onMakeOrder(form: NgForm) {
    // Check if form is valid
    if (form.invalid) {
      return;
    }
    // Assign form with values to the high level form variable
    this.pickupTime = form.value.pickupTime;
    this.paymentMethod = form.value.paymentMethod;
    this.serviceReference = form.value.reference;

    // For in-app-payment
    this.inAppPayment = this.paymentMethod === 'In-app payment' ? true : false;

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
        //Lock fields to be not editable
        this.locked = true;

        // User on subscription
        if (this.user.subscription) {
          this.paymentStatus = 'Monthly';
          this.onAddService();
        }
        // Once-off on cash-on-delivery
        else if (form.value.paymentMethod === 'Cash on delivery') {
          this.paymentStatus = 'Pending';
          this.onAddService();
          // Once-off on in-app-payment
        } else {
          this.showPaymentServices = true;
          this.order = {
            email: this.user.email,
            amount: this.selectedServiceType.price,
            reference: this.paymentReference,
          };
        }
      }
    });
  }

  onAddService() {
    //this.isLoading = true;
    const service: ServiceRequest = {
      id: null,
      serviceType: this.selectedServiceType.name || this.user.subscription,
      reference: this.serviceReference,
      pickupTime: this.pickupTime,
      paymentMethod: this.paymentMethod || 'Monthly subscription',
      paymentStatus: this.paymentStatus,
      status: this.status[0],
      requestedOn: new Date(Date.now()).toISOString(),
      returnedOn: null,
      owner: this.userId,
    };
    this.serviceRequestService.addService(service);
  }

  // Google pay
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
    const emptyCart = {};
    await this.serviceRequestService.processOrder(emptyCart, paymentData);
    this.router.navigate(['my-orders']);
  }

  //Paystack payments

  // paymentInit() {
  //   console.log('Payment initialized');
  // }

  paymentDone(ref: any) {
    this.paymentStatus = ref.message;
    if (ref.status === 'success') {
      this.onAddService();
    } else {
      this.locked = false;
      this.showPaymentServices = false;
    }
  }

  paymentCancel() {
    this.paymentStatus = 'Cancelled';
    this.paymentReference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  onEditDetails() {
    this.locked = false;
  }

  ngOnDestroy(): void {
    this.userListenerSubs.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
