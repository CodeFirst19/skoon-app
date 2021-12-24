import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceRequest } from './service-requests.model';

@Injectable({ providedIn: 'root' })
export class ServiceRequestService {
  private services: ServiceRequest[] = [];
  private servicesUpdated = new Subject<ServiceRequest[]>();

  constructor(private http: HttpClient) {}

  getServices() {
    this.http.get<{ status: String, result: Number, data: any }>('http://localhost:3000/api/v1/services')
      .pipe(map((serviceData) => {
        return serviceData.data['services'].map(service => {
          // console.log(service)
          return {
            id: service._id,
            serviceType: service.serviceType,
            reference: service.reference,
            pickupTime: service.pickupTime,
            paymentType: service.paymentType,
            status: service.status,
            requestedOn: service.requestedOn,
            returnedOn: service.returnedOn,
          };
        })
      }))
      .subscribe((transformedServices) => {
        this.services = transformedServices;
        this.servicesUpdated.next([...this.services])
    });
  }

  getServicesUpdateListener() {
    return this.servicesUpdated.asObservable();
  }

  addService(service: ServiceRequest) {
    this.http.post<{ status: String, data: ServiceRequest[] }>('http://localhost:3000/api/v1/services', service)
      .subscribe((responseData) => {
        this.services.push(service);
        this.servicesUpdated.next([...this.services]);
        const id = responseData.data['newService']._id;
        service.id = id;
      })
    console.log(this.services)
  }
}
