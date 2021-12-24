import { ServiceRequestService } from './../service-request.service';
import { ServiceRequest } from './../service-requests.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ServiceEditComponent } from '../service-edit/service-edit.component';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  statuses = [
    'Collected',
    'Washing',
    'Drying',
    'Ironing',
    'Folding',
    'Returned',
    'Cancelled',
  ];
  services: ServiceRequest[] = [];
  private serviceSubscription: Subscription;

  service: ServiceRequestService;
  constructor(public dialog: MatDialog, service: ServiceRequestService) {
    this.service = service;
  }

  ngOnInit(): void {
    this.service.getServices();
    this.serviceSubscription = this.service
      .getServicesUpdateListener()
      .subscribe((services: ServiceRequest[]) => {
        this.services = services;
      });
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY, HH:mm');
  }

  ngOnDestroy(): void {
    this.serviceSubscription.unsubscribe();
  }

  openDialog() {
    this.dialog.open(ServiceEditComponent, {
      data: {
        animal: 'lion',
      },
    });
  }
}

