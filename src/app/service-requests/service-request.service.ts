import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceRequest } from './service-requests.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private services: ServiceRequest[] = [];
  private servicesUpdated = new Subject<{
    services: ServiceRequest[];
    servicesCount: number;
  }>();

  private errorListener = new Subject<{ message: string }>();
  private isLoadingListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getServices(page: number, limit: number) {
    const queryParameters = `?page=${page}&limit=${limit}`;
    this.http
      .get<{ status: string; result: number; data: {} }>(
        `http://localhost:3000/api/v1/services${queryParameters}`
      )
      .pipe(
        map((serviceData) => {
          return {
            services: serviceData.data['services'].map((service) => {
              return {
                id: service._id,
                serviceType: service.serviceType,
                reference: service.reference,
                pickupTime: service.pickupTime,
                paymentMethod: service.paymentMethod,
                paymentStatus: service.paymentStatus,
                status: service.status,
                requestedOn: service.requestedOn,
                returnedOn: service.returnedOn,
                owner: service.owner,
              };
            }),
            totalServices: serviceData.result,
          };
        })
      )
      .subscribe((transformedServicesData) => {
        this.services = transformedServicesData.services;
        this.servicesUpdated.next({
          services: [...this.services],
          servicesCount: transformedServicesData.totalServices,
        });
        this.isLoadingListener.next(false);
        this.errorListener.next({ message: null });
      }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
      });
  }

  getServicesUpdateListener() {
    return this.servicesUpdated.asObservable();
  }

  addService(service: ServiceRequest) {
    this.http
      .post<{ status: string; data: {} }>(
        'http://localhost:3000/api/v1/services',
        service
      )
      .subscribe((response) => {
        //Get returned service Id
        const serviceId = { service: response.data['newService']._id };
        FIXME:
        //Update user services property
        this.http
          .patch<{ status: string; data: {} }>(
            'http://localhost:3000/api/v1/users/update-user-service',
            serviceId
          )
          .subscribe((response) => {
              this.isLoadingListener.next(false);
              this.errorListener.next({ message: null });
            }, (error) => {
              this.isLoadingListener.next(false);
              this.errorListener.next({ message: error.error.message });
              console.log(error.error.message);
            },
          );
        this.showSweetAlertToast('Request Sent', 'Your request was sent successfully!', 'success');
        this.router.navigate(['/services']);
      }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          this.showSweetAlertToast('Request Failed', 'Error occurred while sending the request!', 'error');
          console.log(error.error.message);
      });
  }

  updateStatus(id: string, status: string) {
    let service;

    if (status === 'Returned') {
      service = { status: status, returnedOn: Date.now() };
    } else {
      service = { status: status };
    }

    this.http
      .patch<{ status: string; data: ServiceRequest[] }>(
        `http://localhost:3000/api/v1/services/${id}`,
        service
      )
      .subscribe(
        (response) => {
          const index = this.services.findIndex((s) => s.id === id);
          this.services[index].status = service.status;
          this.showSweetAlertToast('Status Updated', 'Status updated successfully!', 'success');
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: null });
          this.router.navigate(['/services']);
        },
        (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          this.showSweetAlertToast('Update Failed', 'Error occurred while updating the status!', 'error');
          console.log(error.error.message);
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
