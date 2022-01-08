import { AuthService } from 'src/app/authentication/auth.service';
import { ServiceRequest } from './../service-requests.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceRequestService } from './../service-request.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css'],
})
export class ServiceCreateComponent implements OnInit {
  userId: string;
  todayDate: Date = new Date();
  serviceTypes = [
    'Basic: R659pm Wash, Dry & Fold',
    'Premium: R719pm Iron Only',
    'Advanced: R829pm Wash, Dry, Iron & Fold',
  ];
  paymentMethods = ['In-app payment', 'cash on delivery'];
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

  private mode = 'create';
  private serviceId: string;
  private service: ServiceRequest;

  constructor(
    private authService: AuthService,
    public serviceRequestService: ServiceRequestService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('serviceId')) {
        this.mode = 'edit';
        this.serviceId = paramMap.get('serviceId');
        this.service = this.serviceRequestService.getService(this.serviceId);
      } else {
        this.mode = 'create';
        this.serviceId = null;
      }
    });
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
      paymentMethod: form.value.paymentMethod,
      paymentStatus: 'Pending',
      status: this.status[0],
      requestedOn: new Date(Date.now()).toISOString(),
      returnedOn: null,
      owner: this.userId
    };
    this.serviceRequestService.addService(service);
    form.resetForm();
  }
}
