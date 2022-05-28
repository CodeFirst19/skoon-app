import { ServiceRequest } from './../service-requests.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.css'],
})
export class ServiceViewComponent implements OnInit {
  message: string;
  user: User;

  constructor(
    public dialogRef: MatDialogRef<ServiceViewComponent>,
    @Inject(MAT_DIALOG_DATA) public service: ServiceRequest
  ) { }

  ngOnInit(): void {
    this.user = this.service.owner
      ? JSON.parse(JSON.stringify(this.service.owner))
      : JSON.parse(JSON.stringify(this.service.onceOff));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
