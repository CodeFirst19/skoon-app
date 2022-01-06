import { ServiceRequest } from './../service-requests/service-requests.model';
export interface User {
  preferredName: string;
  email: string;
  phone: string;
  address: string;
  socialMediaHandles: string[];
  role: String;
  services: ServiceRequest [];
}
