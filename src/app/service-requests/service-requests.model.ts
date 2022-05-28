import { User } from 'src/app/users/user.model';
export interface ServiceRequest {
  id: string;
  serviceType: string;
  pickupTime: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  requestedOn: string;
  returnedOn: string;
  reference: string;
  owner: string;
  onceOff: string;
}
