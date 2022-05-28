import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ServiceRequestService } from 'src/app/service-requests/service-request.service';
import { ServiceRequest } from 'src/app/service-requests/service-requests.model';

@Component({
  selector: 'app-get-once-off',
  templateUrl: './get-once-off.component.html',
  styleUrls: ['./get-once-off.component.css'],
})
export class GetOnceOffComponent implements OnInit {
  todayDate = new Date();
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

  constructor(
    public dialogRef: MatDialogRef<GetOnceOffComponent>,
    @Inject(MAT_DIALOG_DATA)
    public service: { name: string; description: string },
    private serviceRequestService: ServiceRequestService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
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

  onGetOnceOff(form: NgForm) {
    this.showLoader();
    if (form.invalid) {
      return;
    }

    const user = {
      preferredName: form.value.preferredName,
      address: form.value.address,
      email: form.value.email,
      phone: form.value.phone,
    };

    const userService = {
      serviceType: this.service.name,
      reference: null,
      pickupTime: form.value.pickupTime,
      paymentMethod: 'Cash on delivery',
      paymentStatus: 'Pending',
      status: this.status[0],
      requestedOn: new Date(Date.now()).toISOString(),
      returnedOn: null,
    };

    this.serviceRequestService.addService(userService, user);
    form.resetForm();
  }

  showLoader() {
    let timerInterval;
    Swal.fire({
      title: 'Requesting a service!',
      html: 'Please wait...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {},
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        if (!this.errorMsg) {
          Swal.fire(
            'Request Received!',
            "We'll get back to you in a moment",
            'success'
          );
        } else {
          Swal.fire(
            'Request Failed!',
            'Error occurred while sending the request!',
            'error'
          );
          this.errorMsg = null;
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
