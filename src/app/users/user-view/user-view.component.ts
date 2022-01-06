import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../user.model';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css'],
})
export class UserViewComponent {
  constructor(
    public dialogRef: MatDialogRef<UserViewComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
