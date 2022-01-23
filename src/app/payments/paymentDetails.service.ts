import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentDetails } from './paymentDetails.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class PaymentDetailsService {
  private paymentDetails: PaymentDetails[] = [];
  private paymentDetailsUpdated = new Subject<{
    paymentDetails: PaymentDetails[];
    paymentDetailsCount: number;
  }>();

  private errorListener = new Subject<{ message: string }>();
  private isLoadingListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getPaymentDetails() {
    this.http
      .get<{ status: string; result: number; data: {} }>(
        'http://localhost:3000/api/v1/payment-details'
      )
      .pipe(
        map((paymentDetailsData) => {
          return {
            paymentDetails: paymentDetailsData.data['paymentDetails'].map(
              (paymentDetails) => {
                return {
                  id: paymentDetails._id,
                  accountName: paymentDetails.accountName,
                  bankName: paymentDetails.bankName,
                  branchCode: paymentDetails.branchCode,
                  accountNumber: paymentDetails.accountNumber,
                  reference: paymentDetails.reference,
                };
              }
            ),
            totalPaymentDetails: paymentDetailsData.result,
          };
        })
      )
      .subscribe(
        (transPaymentDtlsData) => {
          this.paymentDetails = transPaymentDtlsData.paymentDetails;
          this.paymentDetailsUpdated.next({
            paymentDetails: [...this.paymentDetails],
            paymentDetailsCount: transPaymentDtlsData.totalPaymentDetails,
          });
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: null });
        },
        (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
        }
      );
  }

  getPaymentDetailsUpdateListener() {
    return this.paymentDetailsUpdated.asObservable();
  }

  addPaymentDetails(paymentDetail: PaymentDetails) {
    this.http
      .post<{ status: string; data: {} }>(
        'http://localhost:3000/api/v1/payment-details',
        paymentDetail
      )
      .subscribe(
        (response) => {
          //Get returned paymentDetail Id
          const paymentDetailId = {
            peymentDetails: response.data['newPaymentDetail']._id,
          };
          //Update user paymentDetails property
          FIXME: this.http
            .patch<{ status: string; data: {} }>(
              'http://localhost:3000/api/v1/users/add-payent-details',
              paymentDetailId
            )
            .subscribe(
              (response) => {
                this.errorListener.next({ message: null });
                this.isLoadingListener.next(false);
              },
              (error) => {
                this.isLoadingListener.next(false);
                this.errorListener.next({ message: error.error.message });
              }
            );
          this.showSweetAlertToast(
            'Payment Details Added',
            'Payment details added successfully!',
            'success'
          );
          this.router.navigate(['/payment-details']);
        },
        (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          this.showSweetAlertToast(
            'Request Failed',
            'Error occurred while adding payment details!',
            'error'
          );
        }
      );
  }

  deletePaymentDetails(id) {
    this.http
      .delete<{ status: string; data: null }>(
        `http://localhost:3000/api/v1/payment-details/${id}`
      )
      .subscribe(
        (response) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: null });
          this.paymentDetails = this.paymentDetails.filter(p=>p.id !== id);
          this.paymentDetailsUpdated.next({
            paymentDetails: [...this.paymentDetails],
            paymentDetailsCount: this.paymentDetails.length,
          });

          this.showSweetAlertToast(
            'Deleted!',
            'Item has been deleted permanently.',
            'success'
          );
          this.router.navigate(['/payment-details']);
        },
        (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          this.showSweetAlertToast(
            'Delete Failed!',
            'An error occurred while trying to delete the item.',
            'error'
          );
        }
      );
  }

  getErrorListener() {
    return this.errorListener.asObservable();
  }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  showSweetAlertToast(title: string, message: string, status: SweetAlertIcon) {
    Swal.fire(title, message, status);
  }
}
