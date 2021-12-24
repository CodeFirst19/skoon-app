import { ServiceRequest } from './../service-requests.model';
import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceRequestService } from './../service-request.service';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css'],
})
export class ServiceCreateComponent {
  serviceTypes = [
    'Basic: R659pm Wash, Dry & Fold',
    'Premium: R719pm Iron Only',
    'Advanced: R829pm Wash, Dry, Iron & Fold',
  ];
  paymentTypes = ['In-app payment', 'cash on delivery'];
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

  serviceRequestService: ServiceRequestService;
  constructor(serviceRequestService: ServiceRequestService) {
    this.serviceRequestService = serviceRequestService;
  }

  onAddService(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const service: ServiceRequest = {
      id: null,
      serviceType: form.value.serviceType,
      reference: form.value.reference,
      pickupTime: form.value.pickupTime,
      paymentType: form.value.paymentType,
      status: this.status[0],
      requestedOn: new Date(Date.now()).toDateString(),
      returnedOn: null,
    };
    this.serviceRequestService.addService(service);
    form.resetForm();
  }

}
