import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PaymentDetails } from '../paymentDetails.model';
import { PaymentDetailsService } from '../paymentDetails.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
})
export class PaymentListComponent implements OnInit, OnDestroy {
  paymentDetails: PaymentDetails[] = [];
  private paymentDetailsSubscription: Subscription;

  paymentDetailsService: PaymentDetailsService;
  constructor(paymentDetailsService: PaymentDetailsService) {
    this.paymentDetailsService = paymentDetailsService;
  }
  
  ngOnInit(): void {
    this.paymentDetails = this.paymentDetailsService.getPaymentDetails();
    this.paymentDetailsSubscription = this.paymentDetailsService
    .getPaymentDetailsUpdateListener()
    .subscribe((results: PaymentDetails[]) => {
      this.paymentDetails = results;
    });
  }

  ngOnDestroy(): void {
    this.paymentDetailsSubscription.unsubscribe();
  }
}
