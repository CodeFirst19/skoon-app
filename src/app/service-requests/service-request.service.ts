import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceRequest } from './service-requests.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private services: ServiceRequest[] = [];
  private servicesUpdated = new Subject<{
    services: ServiceRequest[];
    servicesCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getServices(page: number, limit: number) {
    const queryParameters = `?page=${page}&limit=${limit}`;
    this.http
      .get<{ status: string; result: number; data: any }>(
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
        // console.log(transformedServicesData.services);
      });
  }

  getService(id: string) {
    console.log(this.services);
    console.log(this.services.find((s) => s.id === id));
    return { ...this.services.find((s) => s.id === id) };
  }

  getServicesUpdateListener() {
    return this.servicesUpdated.asObservable();
  }

  addService(service: ServiceRequest) {
    this.http
      .post<{ status: string; data: ServiceRequest[] }>(
        'http://localhost:3000/api/v1/services',
        service
      )
      .subscribe((responseData) => {
        // this.services.push(service);
        // this.servicesUpdated.next([...this.services]);
        // const id = responseData.data['newService']._id;
        // service.id = id;
        this.showSweetSuccessToast('request sent successfully!');
        this.router.navigate(['/view-services']);
      });
    console.log(this.services);
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
      .subscribe((responseData) => {
        const index = this.services.findIndex((s) => s.id === id);
        this.services[index].status = service.status;
        // this.servicesUpdated.next([...this.services]);
        this.showSweetSuccessToast('Status updated successfully!');
        // console.log(responseData.status);
        this.router.navigate(['/view-services']);
      });
  }

  sendMessage(id: string, message: string) {
    // const service = { message: message };
    // this.http
    //   .patch<{ status: string; data: ServiceRequest[] }>(
    //     `http://localhost:3000/api/v1/services/${id}`,
    //     service
    //   )
    //   .subscribe((responseData) => {
    //     // this.servicesUpdated.next([...this.services]);
    //     this.showSweetSuccessToast('Message send successfully!');
    //     console.log(responseData.status);
    //     this.router.navigate(['/']);
    //   });
  }

  showSweetSuccessToast(message) {
    Swal.fire('Success!', message, 'success');
  }
}
