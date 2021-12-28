import { ServiceRequest } from './../service-requests.model';
import { Component, OnInit, Input } from '@angular/core';
import { ServiceRequestService } from '../service-request.service';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css'],
})
export class ServiceViewComponent implements OnInit {
  @Input() service: ServiceRequest;
  message: String;

  private serviceService: ServiceRequestService;
  constructor(serviceService: ServiceRequestService) {
    this.serviceService = serviceService;
  }

  ngOnInit(): void {}

  sendMessage(id: String) {
    this.serviceService.sendMessage(id, this.message)
    this.message = '';
  }
}
