import { ServiceRequest } from './../service-requests.model';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css'],
})
export class ServiceViewComponent {
  message: String;

  constructor(
    public dialogRef: MatDialogRef<ServiceViewComponent>,
    @Inject(MAT_DIALOG_DATA) public service: ServiceRequest
  ) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
