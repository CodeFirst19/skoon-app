import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PaymentDetailsService } from '../paymentDetails.service';

import { PaymentDetails } from '../paymentDetails.model';

@Component({
  selector: 'app-payment-create',
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.css'],
})
export class PaymentCreateComponent {
  bankNames = ['Absa', 'Capitec', 'Nedbank', 'FNB', 'Standard Bank'];
  
  paymentDetailsService: PaymentDetailsService;
  constructor(paymentDetailsService: PaymentDetailsService) {
    this.paymentDetailsService = paymentDetailsService;
  }

  onAddPaymentDetails(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const payment: PaymentDetails = {
      accountName: form.value.accountName,
      bankName: form.value.bankName,
      branchCode: form.value.branchCode,
      accountNumber: form.value.accountNumber,
      reference: form.value.reference,
    };
    this.paymentDetailsService.addPaymentDetails(payment);
    form.resetForm();
  }
}
