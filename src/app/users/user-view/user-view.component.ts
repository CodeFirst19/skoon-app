import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../user.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css'],
})
export class UserViewComponent implements OnInit {
  notSubscribed: string = 'CURRENTLY NOT SUBSCRIBED TO ANY SERVICE';
  subscribed: string;
  constructor(
    public dialogRef: MatDialogRef<UserViewComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }
  
  ngOnInit(): void {
    this.subscribed = `CURRENTLY SUBSCRIBED TO ${this.user.subscription}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
