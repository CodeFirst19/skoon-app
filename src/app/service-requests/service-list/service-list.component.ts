import { ServiceViewComponent } from './../service-view/service-view.component';
import { Router } from '@angular/router';
import { ServiceRequestService } from '../service-request.service';
import { ServiceRequest } from '../service-requests.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  services: ServiceRequest[] = [];
  private serviceSubscription: Subscription;

  totalServices: number = 0;
  limit: number = 5;
  page: number = 1;
  pageSizeOptions: number[] = [3, 5, 10, 25, 50];

  serviceService: ServiceRequestService;
  router: Router;
  constructor(
    public dialog: MatDialog,
    serviceService: ServiceRequestService,
    router: Router
  ) {
    this.serviceService = serviceService;
    this.router = router;
  }

  ngOnInit(): void {
    this.serviceService.getServices(this.page, this.limit);
    this.serviceSubscription = this.serviceService
      .getServicesUpdateListener()
      .subscribe(
        (serviceData: {
          services: ServiceRequest[];
          servicesCount: number;
        }) => {
          this.services = serviceData.services;
          this.totalServices = serviceData.servicesCount;
        }
      );
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY, HH:mm');
  }

  ngOnDestroy(): void {
    this.serviceSubscription.unsubscribe();
  }

  onUpdateStatusDialog(serviceId): void {
    const dialogRef = this.dialog.open(ServiceEditComponent, {
      width: '35%',
      data: serviceId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.serviceService.updateStatus(result.id, result.status);
        console.log('The dialog was closed');
        console.log(result);
      }
    });
  }

  onViewServiceDialog(service): void {
    console.log(service)
    const dialogRef = this.dialog.open(ServiceViewComponent, {
      width: '60%',
      data: service,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result.service.id);
        this.serviceService.sendMessage(result.service.id, result.message);
      }
    });
  }

  onPageChanged(pageData: PageEvent) {
    this.page = pageData.pageIndex + 1;
    this.limit = pageData.pageSize;
    this.serviceService.getServices(this.page, this.limit);
  }
}

