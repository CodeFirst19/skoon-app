import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css'],
})
export class SubscribeComponent implements OnInit {
  currency = 'ZAR';
  reference = `ref-${Math.ceil(Math.random() * 10e13)}`;

  constructor(
    private userService: UserService,
    private router:Router,
    public dialogRef: MatDialogRef<SubscribeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public subscription: {
      email: string;
      serviceName: string;
      interval: string;
      amount: number;
      plan: string;
    }
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.subscription);
  }

  paymentCancel() {
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
  }

  paymentDone(ref: any) {
    console.log(ref);
    if (ref.status === 'success') {
      this.userService.updateMe({ subscription: this.subscription.serviceName, email: this.subscription.email });
      this.dialogRef.close();
      this.router.navigate(['/dashboard/my-profile']);
    }
  }
}
