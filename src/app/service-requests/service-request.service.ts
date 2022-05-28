import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
                onceOff: service.onceOff,
              };
            }),
            totalServices: serviceData.result,
          };
        })
      )
      .subscribe(
        (transformedServicesData) => {
          this.services = transformedServicesData.services;
          this.servicesUpdated.next({
            services: [...this.services],
            servicesCount: transformedServicesData.totalServices,
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

  getServicesUpdateListener() {
    return this.servicesUpdated.asObservable();
  }

  processOrder(order: {}, paymentData: any) {
    // console.log(
    //   'TODO: send order to server',
    //   order,
    //   paymentData.shippingAddress,
    //   paymentData.shippingOptionData?.id,
    //   paymentData.paymentMethodData,
    // );
    // return Promise.resolve({
    //   orderId: Date.now().valueOf().toString(),
    // });
  }

  // getOnceOffService(userService) {
  //   this.http
  //     .post<{ status: string; data: {} }>(
  //       'http://localhost:3000/api/v1/services',
  //       userService
  //     )
  //     .subscribe(
  //       (response) => {
  //         //Get returned service Id
  //         const serviceId = { service: response.data['newService']._id };
  //         //Update user services property
  //         this.http
  //           .patch<{ status: string; data: {} }>(
  //             'http://localhost:3000/api/v1/users/update-user-service',
  //             serviceId
  //           )
  //           .subscribe(
  //             (response) => {
  //               this.isLoadingListener.next(false);
  //               this.errorListener.next({ message: null });
  //             },
  //             (error) => {
  //               this.isLoadingListener.next(false);
  //               this.errorListener.next({ message: error.error.message });
  //             }
  //           );
  //       },
  //       (error) => {
  //         this.isLoadingListener.next(false);
  //         this.errorListener.next({ message: error.error.message });
  //       }
  //     );
  // }

  createOrUpdateUser(route: string, details: {}) {
    let httpMethod: Observable<{ status: string; data: {} }>;

    if (route === 'create-user') {
      httpMethod = this.http.post<{ status: string; data: {} }>(`http://localhost:3000/api/v1/users/${route}`, details);
    }
    else if (route == 'update-user-service') {
      httpMethod = this.http.patch<{ status: string; data: {} }>(`http://localhost:3000/api/v1/users/${route}`, details);
    }

    httpMethod.subscribe((response) => {
      this.isLoadingListener.next(false);
      this.errorListener.next({ message: null });
      this.showSweetAlertToast(
        'Request Received!',
        'We\'ll get back to you in a moment',
        'success'
        );
      },
      (error) => {
        this.isLoadingListener.next(false);
        this.errorListener.next({ message: error.error.message });
        this.showSweetAlertToast(
          'Request Failed',
          'Error occurred while sending the request!',
          'error'
        );
      }
    );
  }

  addService(service, user) {
    this.http.post<{ status: string; data: {} }>('http://localhost:3000/api/v1/services', service)
      .subscribe((response) => {
        // Get returned service Id 
        const serviceId = { service: response.data['newService']._id };
        if (user) {
          // Create user
          this.createOrUpdateUser('create-user', Object.assign(user, serviceId));
        } else {
          // Update user services property
          this.createOrUpdateUser('update-user-service', serviceId);
        }
        // If the service does not have a  user is null (not a once off)', it means the user is logged in, so navigate to their orders list
        if (!user) {
          this.router.navigate(['/dashboard/my-orders']);
        }
      }, (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          // Show error alert
          this.showSweetAlertToast(
            'Request Failed',
            'Something wrong happened. Please try again, or contact if the issue persists.',
            'error'
          );
        }
      );
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
          this.showSweetAlertToast(
            'Status Updated',
            'Status updated successfully!',
            'success'
          );
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: null });
          this.router.navigate(['/dashboard/all-orders']);
        },
        (error) => {
          this.isLoadingListener.next(false);
          this.errorListener.next({ message: error.error.message });
          this.showSweetAlertToast(
            'Update Failed',
            'Error occurred while updating the status!',
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
