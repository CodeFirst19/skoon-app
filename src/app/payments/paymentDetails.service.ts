import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PaymentDetails } from './paymentDetails.model';

@Injectable({ providedIn: 'root' })
export class PaymentDetailsService {
  private paymentDetails: PaymentDetails[] = [];
  private paymentDetailsUpdated = new Subject<PaymentDetails[]>();

  getPaymentDetails() {
    return [...this.paymentDetails];
  }

  getPaymentDetailsUpdateListener() {
    return this.paymentDetailsUpdated.asObservable();
  }

  addPaymentDetails(payment: PaymentDetails) {
    this.paymentDetails.push(payment);
    this.paymentDetailsUpdated.next([...this.paymentDetails]);
  }
}
