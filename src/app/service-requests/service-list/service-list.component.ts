import { AuthService } from './../../authentication/auth.service';
import { ServiceViewComponent } from './../service-view/service-view.component';
import { Router } from '@angular/router';
import { ServiceRequestService } from '../service-request.service';
import { ServiceRequest } from '../service-requests.model';
import {
  Component,
  OnInit,
  ViewChild,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;

  services: ServiceRequest[] = [];
  dataSource: MatTableDataSource<ServiceRequest>;
  displayedColumns: string[] = [
    'package',
    'pickupTime',
    'paymentMethod',
    'status',
    'statusUpdate',
    'viewMore',
  ];
  private serviceSubscription: Subscription;

  totalServices: number = 0;
  limit: number = 5;
  page: number = 1;
  pageSizeOptions: number[] = [3, 5, 10, 25, 50];
  searchKey: string = '';

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private serviceService: ServiceRequestService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private authService: AuthService
  ) {}

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
          this.dataSource = new MatTableDataSource<ServiceRequest>(
            this.services
          );
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          });
        }
      );
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY, HH:mm');
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
    console.log(service);
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  ngOnDestroy(): void {
    // TODO: 
    this.authListenerSubs.unsubscribe();
  }
}
